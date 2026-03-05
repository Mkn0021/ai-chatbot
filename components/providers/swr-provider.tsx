"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

export function SWRProvider({ children }: { children: ReactNode }) {
	return (
		<SWRConfig
			value={{
				revalidateOnFocus: false,
				revalidateOnReconnect: false,
				shouldRetryOnError: false,
				dedupingInterval: 3600000, // 1 hour - cache requests, only refetch when explicitly mutated
				errorRetryCount: 2,
			}}
		>
			{children}
		</SWRConfig>
	);
}
