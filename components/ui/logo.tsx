import Link from "next/link";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
	return (
		<Link
			href={"/"}
			className={cn(
				"relative z-20 flex shrink-0 items-center justify-center gap-2 px-2 py-1 text-sm font-normal text-black",
				className,
			)}
		>
			<Icons.logo />
			<span className="text-lg font-medium text-black">shape.ai</span>
		</Link>
	);
}
