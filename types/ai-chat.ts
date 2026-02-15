import { z } from "zod";
import { Suggestion } from "@/lib/db/schemas";
import { sqlQueryTool } from "@/lib/ai/tools";
import type { InferUITool, UIMessage } from "ai";
import { ChartConfig } from "@/components/ui/chart";
import type { VisualizationType, ChartPropsInput } from "@/app/(chat)/schema";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
	createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type ChatTools = {
	sqlQuery: InferUITool<ReturnType<typeof sqlQueryTool>>;
};

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
	"sql-query-result": SqlQueryResult;
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
	visualizationType: VisualizationType;
	columns: string[];
	metadata: {
		fields?: Array<{
			name: string;
			dataTypeID: number;
		}>;
		executedAt: string;
		trend?: {
			direction: "up" | "down";
			percentage: number;
			text: string;
		};
	};
	message?: string;
	chartProps?: ChartPropsInput & {
		trendText?: string;
		trendDirection?: "up" | "down";
	};
};

export type ChartProps = {
	title: string;
	description: string;
	chartData: Array<Record<string, any>>;
	chartConfig: ChartConfig;
};
