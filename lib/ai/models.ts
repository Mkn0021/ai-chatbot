import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { ollama } from 'ai-sdk-ollama';

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
];

export function getLanguageModel(modelId: string) {
    const [provider, model] = modelId.split('/');

    switch (provider) {
        case 'openai':
            return openai(model);

        case 'gemini':
            return google(model);

        case 'ollama':
            return ollama(model);

        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}