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

export const SqlQueryInputSchema = {
	body: z.object({
		databaseUrl: z
			.url("Invalid database URL")
			.describe("PostgreSQL database connection URL"),
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
	}),
};

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
export type ExecuteCustomSqlInput = z.infer<typeof SqlQueryInputSchema.body>;

