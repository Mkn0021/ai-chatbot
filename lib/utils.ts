import APIError from "./api/error";
import { formatISO } from "date-fns";
import { twMerge } from "tailwind-merge";
import { DBMessage } from "./db/schemas";
import { clsx, type ClassValue } from "clsx";
import { UIMessagePart, type UIMessage } from "ai";
import type { ChatMessage, ChatTools, CustomUIDataTypes } from "@/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const fetcher = async <T>(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<T> => {
	const response = await fetch(input, init);

	if (!response.ok) {
		const { code, cause } = await response.json();
		throw new APIError(cause, response.status, { code });
	}

	// AsyncHandler by Default return data : { data: T , message: string }
	const json = await response.json();
	return json.data;
};

export async function fetchWithErrorHandlers(
	input: RequestInfo | URL,
	init?: RequestInit,
) {
	try {
		const response = await fetch(input, init);

		if (!response.ok) {
			const { code, cause } = await response.json();
			throw new APIError(cause, response.status, { code });
		}

		return response;
	} catch (error: unknown) {
		if (typeof navigator !== "undefined" && !navigator.onLine) {
			throw new APIError("You appear to be offline", 0);
		}

		throw error;
	}
}

export function generateUUID(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function convertToUIMessages(messages: DBMessage[]): ChatMessage[] {
	return messages.map((message) => ({
		id: message.id,
		role: message.role as "user" | "assistant" | "system",
		parts: message.parts as UIMessagePart<CustomUIDataTypes, ChatTools>[],
		metadata: {
			createdAt: formatISO(message.createdAt),
		},
	}));
}

export function getTextFromMessage(message: ChatMessage | UIMessage): string {
	return message.parts
		.filter((part) => part.type === "text")
		.map((part) => (part as { type: "text"; text: string }).text)
		.join("");
}

export function sanitizeText(text: string) {
	return text.replace("<has_function_call>", "");
}

export const getApiKey = (modelId: string): string => {
	if (typeof window === "undefined") return "";
	return localStorage.getItem(`model_api_key_${modelId}`) || "";
};

export const setApiKey = (modelId: string, apiKey: string): void => {
	if (typeof window === "undefined") return;
	localStorage.setItem(`model_api_key_${modelId}`, apiKey);
};

export const removeApiKey = (modelId: string): void => {
	if (typeof window === "undefined") return;
	localStorage.removeItem(`model_api_key_${modelId}`);
};
