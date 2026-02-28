"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { createContext, useContext, type ReactNode } from "react";
import type { GetOrganizationByIdResult } from "@/app/(organization)/schema";

interface OrganizationContextType {
	organization: GetOrganizationByIdResult | null;
	isLoading: boolean;
	error: Error | null;
	mutate: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
	undefined,
);

export function OrganizationProvider({ children }: { children: ReactNode }) {
	const {
		data: organization,
		error,
		isLoading,
		mutate,
	} = useSWR<GetOrganizationByIdResult>("/api/organization", fetcher);

	return (
		<OrganizationContext.Provider
			value={{
				organization: organization || null,
				isLoading,
				error: error || null,
				mutate,
			}}
		>
			{children}
		</OrganizationContext.Provider>
	);
}

export function useOrganization() {
	const context = useContext(OrganizationContext);
	if (context === undefined) {
		throw new Error(
			"useOrganization must be used within an OrganizationProvider",
		);
	}
	return context;
}
