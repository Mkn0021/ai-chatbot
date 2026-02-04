import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Database, Sparkles, BarChart3, FileCode } from "lucide-react";

export function QueryProcessor() {
	return (
		<Circle className="size-90 mask-b-from-30%">
			<Circle className="size-70" variant="secondary" />
			<Circle className="size-45" />
			<Circle className="size-25" variant="secondary" />
			<Circle variant="secondary">
				<Icons.logo />
			</Circle>
			<IconBall className="top-5 right-1/2">
				<Database />
			</IconBall>
			<IconBall className="top-1/2 right-1/2 size-8 -translate-x-18">
				<Sparkles />
			</IconBall>
			<IconBall className="top-1/2 right-18 size-12 -translate-y-10">
				<FileCode />
			</IconBall>
			<IconBall className="right-12 bottom-20 size-8">
				<BarChart3 />
			</IconBall>
		</Circle>
	);
}

export function IconBall({
	children,
	className,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"absolute flex size-10 items-center justify-center rounded-full bg-gray-700 p-2",
				"border-[0.7px] border-[#E4E4E4] text-[#E4E4E4] drop-shadow-[0px_4px_6px_rgba(0,0,0,0.10)]",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function Circle({
	className,
	variant = "primary",
	children,
}: {
	className?: string;
	variant?: "primary" | "secondary";
	children?: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
				className,
				variant == "primary"
					? "bg-[radial-gradient(circle,rgba(249,250,251,1)_0%,rgba(255,187,128,1)_50%,var(--color-chart-1)_100%)]"
					: "bg-white",
			)}
		>
			{children}
		</div>
	);
}
