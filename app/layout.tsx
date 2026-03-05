import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

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
				<Toaster position="top-right" />
				{children}
				<Analytics />
			</body>
		</html>
	);
}
