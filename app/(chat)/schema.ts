import "server-only";

import { z } from "zod";
import { chat, vote } from "@/lib/db/schemas";
import { createSelectSchema } from "drizzle-zod";

const ChatSelectSchema = createSelectSchema(chat);
const VoteSelectSchema = createSelectSchema(vote);

const MessageSchema = z.object({
	id: z.string(),
	role: z.string(),
	parts: z.array(z.any()),
});

export const ChatStreamSchema = z.object({
	id: z.string(),
	message: MessageSchema.extend({
		role: z.enum(["user"]),
	}).optional(),
	messages: z.array(MessageSchema).optional(), // For Tools
	selectedChatModel: z.string(),
	selectedVisibilityType: ChatSelectSchema.shape.visibility,
	apiKey: z.string().optional(), // Optional because ollama doesn't need it
});

export const GetChatsHistorySchema = {
	query: z
		.object({
			limit: z.coerce.number().int().min(1).max(100).default(10),
			startingAfter: z.string().optional(),
			endingBefore: z.string().optional(),
		})
		.refine((data) => !(data.startingAfter && data.endingBefore), {
			message: "Only one of startingAfter or endingBefore can be provided.",
		}),
};

export const ChatIdQuerySchema = {
	query: z.object({
		chatId: z.string().min(1),
	}),
};

export const MessageIdQuerySchema = {
	query: z.object({
		messageId: z.string().min(1),
	}),
};

export const UpdateChatVisibilitySchema = {
	body: ChatSelectSchema.pick({
		id: true,
		visibility: true,
	}),
};

export const VoteMessageSchema = {
	body: VoteSelectSchema,
};

export const SqlQueryInputSchema = z.object({
	sqlQuery: z
		.string()
		.min(1, "SQL query cannot be empty")
		.describe("SQL query to execute against the custom database"),
	visualizationType: z
		.enum([
			"none",
			"area_chart",
			"bar_chart",
			"line_chart",
			"pie_chart",
			"radial_chart",
			"bar_chart_label",
		])
		.describe("Type of visualization for the query results"),
	title: z.string().describe("Title for the visualization"),
	description: z
		.string()
		.optional()
		.describe("Description for the visualization"),
	footer: z
		.string()
		.optional()
		.describe(
			"Footer text for the visualization. Only applicable for pie_chart, radial_chart, and bar_chart_label. Trends are automatically calculated by the backend.",
		),
});

const ExecuteSqlInputSchema = z.object({
	sqlQuery: SqlQueryInputSchema.shape.sqlQuery,
	organizationId: z.string().min(1, "Organization ID is required"),
});

export type Chat = z.infer<typeof ChatSelectSchema>;
export type ChatStream = z.infer<typeof ChatStreamSchema>;
export type GetChatsByUserId = z.infer<typeof GetChatsHistorySchema.query> & {
	id: string;
};
export type VoteMessageInput = z.infer<typeof VoteMessageSchema.body>;
export type UpdateChatVisibilityInput = z.infer<
	typeof UpdateChatVisibilitySchema.body
>;
export type VisibilityType = z.infer<typeof ChatSelectSchema.shape.visibility>;
export type ExecuteSqlInput = z.infer<typeof ExecuteSqlInputSchema>;
export type VisualizationType = z.infer<
	typeof SqlQueryInputSchema.shape.visualizationType
>;
export type ChartPropsInput = Omit<
	z.infer<typeof SqlQueryInputSchema>,
	"sqlQuery" | "visualizationType"
>;
