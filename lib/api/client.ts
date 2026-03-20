"use client";

import APIError from "@/lib/api/error";
import { mutate as globalMutate } from "swr";
import { toast as sonnerToast } from "sonner";
import type { FetcherOptions } from "@/types";
import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";

const CACHE_NAME = "api-cache:v1";

const DEFAULT_SWR_CONFIG = {
	revalidateOnFocus: false,
	revalidateOnReconnect: false,
	shouldRetryOnError: false,
	dedupingInterval: 86400000, // 24 hours
	errorRetryCount: 2,
} satisfies SWRConfiguration;

const defaultMutator = <TResponse, TCache>(
	method: string,
	response: TResponse,
	current: TCache | undefined,
): TCache | undefined => {
	switch (method.toUpperCase()) {
		case "POST":
			if (!Array.isArray(current)) return [response] as unknown as TCache;
			return [...current, response] as unknown as TCache;

		case "PUT":
		case "PATCH": {
			if (!Array.isArray(current)) return response as unknown as TCache;
			const updated = response as unknown as { id: unknown };
			return current.map((item) =>
				(item as { id: unknown }).id === updated.id
					? { ...item, ...updated }
					: item,
			) as unknown as TCache;
		}

		case "DELETE": {
			if (!Array.isArray(current)) return undefined;
			const deleted = response as unknown as { id: unknown };
			return current.filter(
				(item) => (item as { id: unknown }).id !== deleted.id,
			) as unknown as TCache;
		}

		default:
			return current;
	}
};

const execute = async <TResponse, TCache>(
	input: RequestInfo | URL,
	options?: FetcherOptions<TResponse, TCache>,
): Promise<TResponse> => {
	const { mutator, toast: _, persistCache, ...init } = options ?? {};
	const method = init.method ?? "GET";
	const key = options?.cacheKey ?? input.toString();
	const isGet = method.toUpperCase() === "GET";

	if (isGet) {
		const cached = await getCacheItem<{ data: TResponse; etag?: string }>(key);
		if (cached?.etag) {
			init.headers = { ...init.headers, "If-None-Match": cached.etag };
		}
	}

	const response = await fetch(input, init);

	if (response.status === 304) {
		const cached = await getCacheItem<{ data: TResponse; etag?: string }>(key);
		if (cached) return cached.data;
	}

	if (!response.ok) {
		const body = await response.json();
		throw new APIError(body.error ?? body.cause, response.status, {
			code: body.code,
		});
	}

	const json = await response.json();
	const data: TResponse = json.data;
	const etag = response.headers.get("ETag");

	if (isGet) {
		if (etag && persistCache) {
			await setCacheItem(key, { data, etag });
		}
		return data;
	}

	const updated = await globalMutate<TCache>(
		key,
		(current) =>
			mutator
				? mutator(current, data)
				: defaultMutator<TResponse, TCache>(method, data, current),
		{ revalidate: false },
	);

	if (updated !== undefined) {
		await setCacheItem(key, { data: updated, etag: etag });
	}

	return data;
};

export const fetcher = <TResponse, TCache = TResponse>(
	input: RequestInfo | URL,
	options?: FetcherOptions<TResponse, TCache>,
): Promise<TResponse> => {
	const executePromise = execute(input, options);

	if (options?.toast) {
		const { toast } = options;
		sonnerToast.promise(executePromise, {
			loading: toast.loading,
			success: toast.success as string | ((data: TResponse) => string),
			error: toast.error as string | ((error: unknown) => string),
		});
	}

	return executePromise;
};

export const useApi = <T>(
	url: string | null,
	options?: SWRConfiguration<T, APIError> & { persistCache?: boolean },
): SWRResponse<T, APIError> => {
	return useSWR<T, APIError>(
		url,
		(key: string) => fetcher<T>(key, { persistCache: options?.persistCache }),
		{
			...DEFAULT_SWR_CONFIG,
			...options,
			fallbackData: undefined,
		},
	);
};

const getCacheItem = async <T>(key: string): Promise<T | undefined> => {
	if (typeof window === "undefined") return undefined;
	try {
		const cache = await caches.open(CACHE_NAME);
		const response = await cache.match(key);
		if (!response) return undefined;
		const json = await response.json();
		return json as T;
	} catch {
		return undefined;
	}
};

const setCacheItem = async (key: string, value: unknown): Promise<void> => {
	if (typeof window === "undefined") return;
	try {
		const cache = await caches.open(CACHE_NAME);
		const response = new Response(JSON.stringify(value), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
		await cache.put(key, response);
	} catch {
		// silently fail
	}
};
