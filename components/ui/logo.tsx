import Link from "next/link";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

export function Logo({ className }: {
    className?: string
}) {
    return (
        <Link href={"/"} className={cn("font-normal flex gap-2 justify-center items-center text-sm text-black px-2 py-1 shrink-0 relative z-20", className)}>
            <Icons.logo />
            <span className="font-medium text-black  text-lg">shape.ai</span>
        </Link>
    )
}