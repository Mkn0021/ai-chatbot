import { env } from "@/lib/env";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseURL = env.BETTER_AUTH_URL;

	return [
		{
			url: baseURL,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1,
		},
		{
			url: `${baseURL}/chat`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: `${baseURL}/login`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];
}
