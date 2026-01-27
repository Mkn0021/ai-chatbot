import db from "@/lib/db";
import { headers } from "next/headers";
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
    plugins: [nextCookies()],
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "student",
            },
        },
    },
});

// Helper function to get session in server components/API routes
export async function getSession() {
    return await auth.api.getSession({
        headers: await headers(),
    });
}