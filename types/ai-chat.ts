import { z } from "zod";
import type { UIMessage } from "ai";
import { Suggestion } from "@/lib/db/schemas";
import { ExecuteCustomSqlInput } from "@/app/(chat)/schema";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
	createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type ChatTools = {};

export type CustomUIDataTypes = {
	textDelta: string;
	imageDelta: string;
	sheetDelta: string;
	codeDelta: string;
	suggestion: Suggestion;
	appendMessage: string;
	id: string;
	title: string;
	clear: null;
	finish: null;
	"chat-title": string;
};

export type ChatMessage = UIMessage<
	MessageMetadata,
	CustomUIDataTypes,
	ChatTools
>;

export type Attachment = {
	name: string;
	url: string;
	contentType: string;
};

export type SqlQueryResult = {
	success: boolean;
	data: Record<string, unknown>[];
	rowCount: number;
	visualizationType: ExecuteCustomSqlInput["visualizationType"];
	columns: string[];
	metadata: {
		fields?: Array<{
			name: string;
			dataTypeID: number;
		}>;
		executedAt: string;
	};
	message?: string;
};
