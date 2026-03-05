"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeManager() {
	const { setTheme } = useTheme();
	const pathname = usePathname();

	useEffect(() => {
		if (pathname === "/" || pathname?.startsWith("/login")) {
			setTheme("light");
		}
	}, [pathname, setTheme]);

	return null;
}
