"use client";

import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeManager } from "@/components/homepage/theme-manager";

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
			<ThemeManager />
			<Toaster position="top-right" />
			<TooltipProvider>{children}</TooltipProvider>
			<Analytics />
		</ThemeProvider>
	);
}
