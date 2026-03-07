"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
		>
			<TooltipProvider>{children}</TooltipProvider>
		</ThemeProvider>
	);
}
