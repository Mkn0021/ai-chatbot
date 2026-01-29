import APIError from "@/lib/api/error";
import { NextResponse } from "next/server";
import type { ErrorResponse } from "@/types";
import { ZodError, prettifyError } from "zod";

export const errorHandler = (err: unknown): NextResponse<ErrorResponse> => {
    const logMessage = err instanceof ZodError ? prettifyError(err) : err instanceof Error ? err.message : "Unknown error";
    console.error("API Error:", logMessage);

    if (err instanceof APIError) {
        const { statusCode, message, details } = err;
        const response: ErrorResponse = { success: false, error: message };
        if (details) {
            response.details = details;
        }
        return NextResponse.json(response, { status: statusCode });
    }

    if (err instanceof ZodError) {
        const message = prettifyError(err);
        return NextResponse.json<ErrorResponse>(
            { success: false, error: message, details: err.issues },
            { status: 400 }
        );
    }

    if (err instanceof SyntaxError && "body" in err) {
        return NextResponse.json<ErrorResponse>(
            { success: false, error: "Malformed JSON in request body" },
            { status: 400 }
        );
    }

    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json<ErrorResponse>(
        { success: false, error: message },
        { status: 500 }
    );
};