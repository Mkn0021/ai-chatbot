import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvSchema = z.object({
    POSTGRES_URL: z.url().nonempty("POSTGRES_URL is required"),
    BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
    BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH must be provided for Authentication"),

    // Google OAuth
    GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
    GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
})


export const env = (() => {
    const result = EnvSchema.safeParse(process.env);
    if (!result.success) {
        throw new Error(
            `Invalid environment variables:\n${result.error.issues
                .map(i => `${i.path}: ${i.message}`)
                .join("\n")}`
        );
    }
    return result.data;
})();