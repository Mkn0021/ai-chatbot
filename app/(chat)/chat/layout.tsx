import Script from "next/script";
import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { auth } from "@/app/(auth)/auth";
import { AppSidebar } from "@/components/chatpage/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataStreamProvider } from "@/components/chatpage/data-stream-provider";
import { OrganizationProvider } from "@/components/chatpage/organization-provider";

const DEFAULT_AVATER = "/images/default-avatar.png";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Script
				src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
				strategy="beforeInteractive"
			/>
			<DataStreamProvider>
				<OrganizationProvider>
					<Suspense fallback={<div className="flex h-dvh" />}>
						<SidebarWrapper>{children}</SidebarWrapper>
					</Suspense>
				</OrganizationProvider>
			</DataStreamProvider>
		</>
	);
}

async function SidebarWrapper({ children }: { children: React.ReactNode }) {
	const [session, cookieStore] = await Promise.all([
		auth.api.getSession({ headers: await headers() }),
		cookies(),
	]);
	const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

	const user = session?.user
		? {
				...session.user,
				image: session.user.image ?? DEFAULT_AVATER,
			}
		: undefined;

	return (
		<SidebarProvider defaultOpen={!isCollapsed}>
			<AppSidebar user={user} />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
