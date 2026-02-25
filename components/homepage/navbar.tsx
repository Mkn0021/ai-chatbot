"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
	return (
		<div className="fixed inset-x-0 top-2 z-50 w-full opacity-100">
			<DesktopNavbar />
		</div>
	);
}

export function DesktopNavbar() {
	const { scrollY } = useScroll();

	const navbarStyle = {
		width: useTransform(scrollY, [0, 100], ["100%", "80%"]),
		opacity: useTransform(scrollY, [0, 100], [1, 1]),
		translateY: useTransform(scrollY, [0, 100], [0, 4]),
		backgroundColor: useTransform(
			scrollY,
			[0, 100],
			["rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.95)"],
		),
		backdropFilter: useTransform(
			scrollY,
			[0, 100],
			["blur(5px)", "blur(10px)"],
		),
		boxShadow: useTransform(
			scrollY,
			[0, 100],
			["transparent 0px 0px 0px", "rgba(0, 0, 0, 0.1) 0px 10px 30px -10px"],
		),
	};

	const buttonStyle = {
		opacity: useTransform(scrollY, [0, 30], [1, 0]),
		display: useTransform(scrollY, [0, 30], ["flex", "none"]),
	};

	//TODO: after implementing mobile navbar:  hidden lg:flex
	return (
		<motion.div
			className="relative z-100 mx-auto flex max-w-4xl flex-row items-center justify-between self-center rounded-full px-4 py-3 md:px-8"
			style={navbarStyle}
		>
			<Logo />

			<div className="flex flex-1 flex-row items-center justify-end space-x-2 text-sm">
				<div className="relative">
					<Link
						className="relative px-3 py-1.5 text-black/90 transition-colors"
						href="/#home"
					>
						<span className="relative z-10">Home</span>
					</Link>
				</div>
				<div className="relative">
					<Link
						className="relative px-3 py-1.5 text-black/90 transition-colors"
						href="/#product"
					>
						<span className="relative z-10">Product</span>
					</Link>
				</div>
			</div>

			<motion.div
				className="flex items-center gap-2 sm:ml-6"
				style={buttonStyle}
			>
				<Button variant="outline" asChild className="hidden sm:block">
					<Link href="/login">Login</Link>
				</Button>
				<Button asChild className="hidden sm:block">
					<Link href="/login?tab=sign-up">Signup</Link>
				</Button>
			</motion.div>
		</motion.div>
	);
}
