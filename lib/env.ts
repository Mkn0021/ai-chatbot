import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvSchema = z.object({
    POSTGRES_URL: z.url().nonempty("POSTGRES_URL is required"),
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