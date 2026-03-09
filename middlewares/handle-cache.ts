import { redis } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import type { CacheConfig, HandlerResult, Session } from "@/types";

const ETAG_TTL = 60 * 60 * 24; // 24 hours

interface CacheContext {
	params: Record<string, string>;
	session?: Session;
}

export const checkCache = async (
	req: NextRequest,
	cache: CacheConfig,
	ctx: CacheContext,
): Promise<NextResponse | null> => {
	if (req.method !== "GET") return null;

	const cacheId = cache.getId(ctx);
	if (!cacheId) return null;

	try {
		const storedEtag = await redis.get<string>(
			`etag:${cache.table}:${cacheId}`,
		);
		if (!storedEtag) return null;

		if (req.headers.get("If-None-Match") !== String(storedEtag)) return null;

		return new NextResponse(null, {
			status: 304,
			headers: { ETag: storedEtag, "Content-Length": "0" },
		});
	} catch (error) {
		console.error("Cache check failed:", error);
		return null;
	}
};

export const persistCache = async (
	result: Pick<HandlerResult<unknown>, "etag">,
	cache: CacheConfig,
	ctx: CacheContext,
): Promise<void> => {
	if (!result.etag) return;

	const cacheId = cache.getId(ctx);
	if (!cacheId) return;

	try {
		await redis.set(`etag:${cache.table}:${cacheId}`, result.etag, {
			ex: ETAG_TTL,
		});
	} catch (error) {
		console.error("Cache persist failed:", error);
	}
};
