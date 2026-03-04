import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Manrope } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
	title: "AI Chatbot",
	description:
		"Connect with our AI-powered chatbot for instant assistance and information.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} ${manrope.variable}`}>
			<body className="antialiased">
				<Toaster position="top-right" />
				<TooltipProvider>{children}</TooltipProvider>
				<Analytics />
			</body>
		</html>
	);
}
