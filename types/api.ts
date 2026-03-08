import { z } from "zod";
import type APIError from "@/lib/api/error";
import { auth } from "@/app/(auth)/auth";

export interface SuccessResponse<T> {
	success: true;
	data: T;
	message?: string;
}

export interface ErrorResponse {
	success: false;
	error: string;
	details?: unknown;
}

export interface HandlerResult<T> {
	data?: T;
	message?: string;
	statusCode?: number;
	etag?: string;
	file?: { buffer: Buffer; fileName: string; contentType: string };
	cookies?: { name: string; value: string; maxAge?: number }[];
	headers?: Record<string, string>;
}

export interface ValidationSchema {
	body?: z.ZodSchema;
	query?: z.ZodSchema;
	params?: z.ZodSchema;
}

export interface CacheConfig {
	table: string;
	getId: (context: {
		params?: Record<string, string>;
		session?: Session;
	}) => string | null;
}

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export type InferValidatedData<T extends ValidationSchema | undefined> =
	T extends ValidationSchema
		? {
				query: T["query"] extends z.ZodSchema ? z.infer<T["query"]> : undefined;
				params: T["params"] extends z.ZodSchema
					? z.infer<T["params"]>
					: undefined;
				body: T["body"] extends z.ZodSchema ? z.infer<T["body"]> : undefined;
			}
		: {};

export type ToastOptions<TResponse> = {
	loading: string;
	success: string | ((data: TResponse) => string);
	error: string | ((error: APIError) => string);
};

export type FetcherOptions<TResponse, TCache> = RequestInit & {
	mutator?: (
		current: TCache | undefined,
		response: TResponse,
	) => TCache | undefined;
	cacheKey?: string;
	toast?: ToastOptions<TResponse>;
	persistCache?: boolean;
};
