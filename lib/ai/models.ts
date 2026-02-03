import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { ollama } from "ai-sdk-ollama";

export type ChatModel = {
	id: string;
	name: string;
	provider: string;
	description: string;
};

export const DEFAULT_MODELS: ChatModel[] = [
	{
		id: "openai/gpt-4o-mini",
		name: "GPT-4o Mini",
		provider: "openai",
		description: "Fast and cost-effective for simple tasks",
	},
	{
		id: "openai/gpt-4o",
		name: "GPT-4o",
		provider: "openai",
		description: "Latest flagship model for advanced reasoning and creativity.",
	},
	{
		id: "openai/gpt-3.5-turbo",
		name: "GPT-3.5 Turbo",
		provider: "openai",
		description: "Efficient and reliable for everyday tasks.",
	},
	{
		id: "gemini/gemini-1.5-flash",
		name: "Gemini 1.5 Flash",
		provider: "google",
		description: "Fast, lightweight model for quick responses.",
	},
	{
		id: "gemini/gemini-1.5-pro",
		name: "Gemini 1.5 Pro",
		provider: "google",
		description: "Advanced model for complex tasks and reasoning.",
	},
	{
		id: "gemini/gemini-pro-vision",
		name: "Gemini Pro Vision",
		provider: "google",
		description: "Multimodal model for text and image understanding.",
	},
];

export function getLanguageModel(modelId: string) {
	const [provider, model] = modelId.split("/");

	switch (provider) {
		case "openai":
			return openai(model);

		case "google":
			return google(model);

		case "ollama":
			return ollama(model);

		default:
			throw new Error(`Unsupported provider: ${provider}`);
	}
}
