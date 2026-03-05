import { env } from "@/lib/env";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseURL = env.BETTER_AUTH_URL;

	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", "/auth/", "/(auth)"],
		},
		sitemap: `${baseURL}/sitemap.xml`,
	};
}
