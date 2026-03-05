"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SWRProvider } from "@/components/providers/swr-provider";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SWRProvider>
			<ThemeProvider
				attribute="class"
				defaultTheme="light"
				enableSystem={false}
				disableTransitionOnChange
			>
				<TooltipProvider>{children}</TooltipProvider>
			</ThemeProvider>
		</SWRProvider>
	);
}
