import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const EnvSchema = z.object({
	POSTGRES_URL: z.url().nonempty("POSTGRES_URL is required"),
	BETTER_AUTH_URL: z
		.url()
		.min(1, "BETTER_AUTH_URL must be provided for Authentication"),
	BETTER_AUTH_SECRET: z
		.string()
		.min(1, "BETTER_AUTH_SECRET must be provided for Authentication"),

	// Google OAuth
	GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
	GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),

	// Upstash Redis
	KV_REST_API_URL: z.url().min(1, "KV_REST_API_URL is required"),
	KV_REST_API_TOKEN: z.string().min(1, "KV_REST_API_TOKEN is required"),
});

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof EnvSchema> {}
	}
}

export const env: z.infer<typeof EnvSchema> = (() => {
	const result = EnvSchema.safeParse(process.env);
	if (!result.success) {
		throw new Error(
			`Invalid environment variables:\n${result.error.issues
				.map((i) => `${i.path}: ${i.message}`)
				.join("\n")}`,
		);
	}
	return result.data;
})();
