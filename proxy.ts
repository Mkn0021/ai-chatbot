import { auth } from "@/app/(auth)/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (session && pathname === "/login") {
		return NextResponse.redirect(new URL("/chat", request.url));
	}

	if (!session && pathname.startsWith("/chat")) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/login", "/chat/:path*"],
};
