"use client";

import APIError from "./error";
import { toast as sonnerToast } from "sonner";
import useSWR, {
	type SWRConfiguration,
	type SWRResponse,
	mutate as globalMutate,
} from "swr";

import type { FetcherOptions } from "@/types";

const DEFAULT_SWR_CONFIG = {
	revalidateOnFocus: false,
	revalidateOnReconnect: false,
	shouldRetryOnError: false,
	dedupingInterval: 3600000,
	errorRetryCount: 2,
} satisfies SWRConfiguration;

function defaultMutator<TResponse, TCache>(
	method: string,
	response: TResponse,
	current: TCache | undefined,
): TCache | undefined {
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
}

export async function fetcher<TResponse, TCache = TResponse>(
	input: RequestInfo | URL,
	options?: FetcherOptions<TResponse, TCache>,
): Promise<TResponse> {
	const { mutator, toast, ...init } = options ?? {};

	const execute = async (): Promise<TResponse> => {
		const response = await fetch(input, init);

		if (!response.ok) {
			const body = await response.json();
			throw new APIError(body.error ?? body.cause, response.status, {
				code: body.code,
			});
		}

		const json = await response.json();
		const data: TResponse = json.data;

		const method = init.method ?? "GET";
		const key = options?.cacheKey ?? input.toString();

		if (method.toUpperCase() !== "GET") {
			await globalMutate<TCache>(
				key,
				(current) =>
					mutator
						? mutator(current, data)
						: defaultMutator<TResponse, TCache>(method, data, current),
				{ revalidate: false },
			);
		}

		return data;
	};

	if (toast) {
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

		try {
			const data = await execute();
			resolveResponse(data);
			return data;
		} catch (error) {
			rejectResponse(error);
			throw error;
		}
	}

	return execute();
}

export function useApi<T>(
	url: string | null,
	options?: SWRConfiguration<T, APIError>,
): SWRResponse<T, APIError> {
	return useSWR<T, APIError>(url, (key: string) => fetcher<T>(key), {
		...DEFAULT_SWR_CONFIG,
		...options,
	});
}
