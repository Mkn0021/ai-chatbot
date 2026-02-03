import { NextRequest } from "next/server";
import type { InferValidatedData, ValidationSchema } from "@/types";

export const validateRequest = async <T extends ValidationSchema>(
	req: NextRequest,
	schema?: T,
	params?: Record<string, string>,
): Promise<InferValidatedData<T>> => {
	if (!schema) {
		return {} as InferValidatedData<T>;
	}

	const url = new URL(req.url);
	const queryParams = Object.fromEntries(url.searchParams);

	const result: any = {
		query: undefined,
		params: undefined,
		body: undefined,
	};

	if (schema.query) {
		result.query = await schema.query.parseAsync(queryParams);
	}

	if (schema.params && params) {
		result.params = await schema.params.parseAsync(params);
	}

	if (schema.body && req.method !== "GET" && req.method !== "HEAD") {
		const bodyText = await req.text();
		const body = bodyText ? JSON.parse(bodyText) : {};
		result.body = await schema.body.parseAsync(body);
	}

	return result as InferValidatedData<T>;
};
