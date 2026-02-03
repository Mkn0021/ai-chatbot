import APIError from "./error";
import { auth } from "@/app/(auth)/auth";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/middlewares/error-handler";
import { validateRequest } from "@/middlewares/validate-request";
import type {
	ErrorResponse,
	HandlerResult,
	InferValidatedData,
	SuccessResponse,
	ValidationSchema,
} from "@/types";

export const apiResponse = {
	success: <T>(
		data: T,
		message?: string,
		statusCode = 200,
		options?: {
			file?: { buffer: Buffer; fileName: string; contentType: string };
			cookies?: { name: string; value: string; maxAge?: number }[];
			headers?: Record<string, string>;
		},
	): NextResponse<SuccessResponse<T>> => {
		const response = NextResponse.json(
			{ success: true, data, message } as SuccessResponse<T>,
			{ status: statusCode },
		);

		if (options?.headers) {
			Object.entries(options.headers).forEach(([key, value]) => {
				response.headers.set(key, value);
			});
		}

		if (options?.cookies) {
			options.cookies.forEach((cookie) => {
				response.cookies.set(cookie.name, cookie.value, {
					maxAge: cookie.maxAge,
				});
			});
		}

		if (options?.file) {
			const { buffer, fileName, contentType } = options.file;
			return new NextResponse(buffer as any, {
				status: statusCode,
				headers: {
					"Content-Type": contentType,
					"Content-Disposition": `attachment; filename="${fileName}"`,
					...options.headers,
				},
			}) as NextResponse<SuccessResponse<T>>;
		}

		return response;
	},

	error: (
		error: string | APIError | Error,
		statusCode = 500,
	): NextResponse<ErrorResponse> => {
		if (error instanceof APIError) {
			const responseBody: ErrorResponse & { details?: unknown } = {
				success: false,
				error: error.message,
			};
			if (error.details) {
				responseBody.details = error.details;
			}
			return NextResponse.json(responseBody, { status: error.statusCode });
		}

		const message = error instanceof Error ? error.message : error;
		return NextResponse.json(
			{ success: false, error: message },
			{ status: statusCode },
		);
	},
};

export const asyncHandler = <T, S extends ValidationSchema | undefined>(
	handler: (
		req: NextRequest,
		context: {
			params?: Record<string, string>;
			session?: Awaited<ReturnType<typeof auth.api.getSession>>;
		},
		validatedData: InferValidatedData<S>,
	) => Promise<HandlerResult<T>>,
	schema?: S,
	requireAuth = true,
) => {
	return async (
		req: NextRequest,
		context: { params: Promise<Record<string, string>> },
	) => {
		try {
			// Resolve the Promise for params (Next.js 14+ compatibility)
			const resolvedParams = await context.params;

			const session = await auth.api.getSession({ headers: req.headers });
			if (requireAuth && !session)
				throw APIError.unauthorized(
					"You must be logged in to access this resource",
				);

			// TODO: Implement input sanitization, rate limiting as needed
			const validatedData = await validateRequest(req, schema, resolvedParams);
			const result = await handler(
				req,
				{ params: resolvedParams, session },
				validatedData as InferValidatedData<S>,
			);

			return apiResponse.success(
				result.data ?? null,
				result.message,
				result.statusCode || 200,
				{
					...(result.file ? { file: result.file } : {}),
					...(result.cookies ? { cookies: result.cookies } : {}),
					...(result.headers ? { headers: result.headers } : {}),
				},
			);
		} catch (error) {
			return errorHandler(error);
		}
	};
};
