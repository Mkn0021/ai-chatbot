import db from "@/lib/db";
import { env } from "@/lib/env";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 7 // 7 days
        }
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
    plugins: [nextCookies()],
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
            },
            organizationId: {
                type: "string",
                required: false,
            },
        },
    },
});
