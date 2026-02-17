import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

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
				{children}
			</body>
		</html>
	);
}
