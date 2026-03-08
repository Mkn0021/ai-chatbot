"use client";

import APIError from "@/lib/api/error";
import { toast as sonnerToast } from "sonner";
import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import { mutate as globalMutate } from "swr";
import type { FetcherOptions } from "@/types";

const DEFAULT_SWR_CONFIG = {
	revalidateOnFocus: false,
	revalidateOnReconnect: false,
	shouldRetryOnError: false,
	dedupingInterval: 3600000,
	errorRetryCount: 2,
} satisfies SWRConfiguration;

const ETAG_PREFIX = "etag:";
const CACHE_PREFIX = "cache:";

const readStorage = <T>(key: string): T | undefined => {
	const raw = getLocalStorageItem(`${CACHE_PREFIX}${key}`);
	if (!raw) return undefined;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return undefined;
	}
};

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
		const storedEtag = getLocalStorageItem(`${ETAG_PREFIX}${key}`);
		if (storedEtag) {
			init.headers = { ...init.headers, "If-None-Match": storedEtag };
		}
	}

	const response = await fetch(input, init);

	if (response.status === 304) {
		const cached = readStorage<TResponse>(key);
		if (cached) return cached;
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
		const previousEtag = getLocalStorageItem(`${ETAG_PREFIX}${key}`);
		if (etag && etag !== previousEtag) {
			if (persistCache)
				setLocalStorageItem(`${CACHE_PREFIX}${key}`, JSON.stringify(data));
			setLocalStorageItem(`${ETAG_PREFIX}${key}`, etag);
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

	if (updated) {
		setLocalStorageItem(`${CACHE_PREFIX}${key}`, JSON.stringify(updated));
		if (etag) setLocalStorageItem(`${ETAG_PREFIX}${key}`, etag);
	}

	return data;
};

export const fetcher = <TResponse, TCache = TResponse>(
	input: RequestInfo | URL,
	options?: FetcherOptions<TResponse, TCache>,
): Promise<TResponse> => {
	if (!options?.toast) return execute(input, options);

	const { toast } = options;
	let resolveResponse!: (value: TResponse) => void;
	let rejectResponse!: (reason: unknown) => void;

	const promise = new Promise<TResponse>((res, rej) => {
		resolveResponse = res;
		rejectResponse = rej;
	});

	sonnerToast.promise(promise, {
		loading: toast.loading,
		success: toast.success as string | ((data: TResponse) => string),
		error: toast.error as string | ((error: unknown) => string),
	});

	return execute(input, options).then(
		(data) => {
			resolveResponse(data);
			return data;
		},
		(error) => {
			rejectResponse(error);
			throw error;
		},
	);
};

export const useApi = <T>(
	url: string | null,
	options?: SWRConfiguration<T, APIError> & { persistCache?: boolean },
): SWRResponse<T, APIError> =>
	useSWR<T, APIError>(
		url,
		(key: string) => fetcher<T>(key, { persistCache: options?.persistCache }),
		{
			...DEFAULT_SWR_CONFIG,
			...options,
			fallbackData: url ? readStorage<T>(url) : undefined,
		},
	);
