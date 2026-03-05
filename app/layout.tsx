import "./globals.css";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { AppProviders } from "@/components/homepage/app-providers";

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
		<html
			lang="en"
			suppressHydrationWarning
			className={`${inter.variable} ${manrope.variable}`}
		>
			<body className="antialiased">
				<AppProviders>{children}</AppProviders>
			</body>
		</html>
	);
}
