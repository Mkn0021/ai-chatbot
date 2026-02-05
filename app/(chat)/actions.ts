import "server-only";

import { Pool } from "pg";
import db from "@/lib/db";
import APIError from "@/lib/api/error";
import { TITLE_PROMPT } from "@/lib/ai/prompts";
import { getTextFromMessage } from "@/lib/utils";
import { DEFAULT_MODELS } from "@/lib/ai/models";
import { drizzle } from "drizzle-orm/node-postgres";
import { generateText, LanguageModel, type UIMessage } from "ai";
import type {
	ExecuteCustomSqlInput,
	GetChatsByUserId,
	UpdateChatVisibilityInput,
	VisibilityType,
	VoteMessageInput,
} from "./schema";
import {
	and,
	asc,
	count,
	desc,
	eq,
	gt,
	gte,
	inArray,
	lt,
	type SQL,
} from "drizzle-orm";
import {
	type Chat,
	chat,
	type DBMessage,
	message,
	organization,
	organizationModel,
	stream,
	vote,
} from "@/lib/db/schemas";
import type { SqlQueryResult } from "@/types";

const DAILY_MESSAGE_LIMIT = 30;

export async function saveChat({
	id,
	userId,
	title,
	visibility,
}: {
	id: string;
	userId: string;
	title: string;
	visibility: VisibilityType;
}) {
	try {
		return await db.insert(chat).values({
			id,
			createdAt: new Date(),
			userId,
			title,
			visibility,
		});
	} catch (_error) {
		throw APIError.badRequest("Failed to save chat");
	}
}

export async function deleteChatById({ id }: { id: string }) {
	try {
		await db.delete(vote).where(eq(vote.chatId, id));
		await db.delete(message).where(eq(message.chatId, id));
		await db.delete(stream).where(eq(stream.chatId, id));

		const [chatsDeleted] = await db
			.delete(chat)
			.where(eq(chat.id, id))
			.returning();
		return chatsDeleted;
	} catch (_error) {
		throw APIError.badRequest("Failed to delete chat by id");
	}
}

export async function deleteAllChatsByUserId({ userId }: { userId: string }) {
	try {
		const userChats = await db
			.select({ id: chat.id })
			.from(chat)
			.where(eq(chat.userId, userId));

		if (userChats.length === 0) {
			return { deletedCount: 0 };
		}

		const chatIds = userChats.map((c) => c.id);

		await db.delete(vote).where(inArray(vote.chatId, chatIds));
		await db.delete(message).where(inArray(message.chatId, chatIds));
		await db.delete(stream).where(inArray(stream.chatId, chatIds));

		const deletedChats = await db
			.delete(chat)
			.where(eq(chat.userId, userId))
			.returning();

		return { deletedCount: deletedChats.length };
	} catch (_error) {
		throw APIError.badRequest("Failed to delete all chats by user id");
	}
}

export async function getChatsByUserId(inputData: GetChatsByUserId) {
	try {
		const extendedLimit = inputData.limit + 1;

		const query = (whereCondition?: SQL<any>) =>
			db
				.select()
				.from(chat)
				.where(
					whereCondition
						? and(whereCondition, eq(chat.userId, inputData.id))
						: eq(chat.userId, inputData.id),
				)
				.orderBy(desc(chat.createdAt))
				.limit(extendedLimit);

		let filteredChats: Chat[] = [];

		if (inputData.startingAfter) {
			const [selectedChat] = await db
				.select()
				.from(chat)
				.where(eq(chat.id, inputData.startingAfter))
				.limit(1);

			if (!selectedChat) {
				throw APIError.notFound(
					`Chat with id ${inputData.startingAfter} not found`,
				);
			}

			filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
		} else if (inputData.endingBefore) {
			const [selectedChat] = await db
				.select()
				.from(chat)
				.where(eq(chat.id, inputData.endingBefore))
				.limit(1);

			if (!selectedChat) {
				throw APIError.notFound(
					`Chat with id ${inputData.endingBefore} not found`,
				);
			}

			filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
		} else {
			filteredChats = await query();
		}

		const hasMore = filteredChats.length > inputData.limit;

		return {
			chats: hasMore ? filteredChats.slice(0, inputData.limit) : filteredChats,
			hasMore,
		};
	} catch (_error) {
		throw APIError.badRequest("Failed to get chats by user id");
	}
}

export async function getChatById({ id }: { id: string }) {
	try {
		const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
		if (!selectedChat) {
			return null;
		}

		return selectedChat;
	} catch (_error) {
		throw APIError.badRequest("Failed to get chat by id");
	}
}

export async function saveMessages({ messages }: { messages: DBMessage[] }) {
	try {
		return await db.insert(message).values(messages);
	} catch (_error) {
		throw APIError.badRequest("Failed to save messages");
	}
}

export async function updateMessage({
	id,
	parts,
}: {
	id: string;
	parts: DBMessage["parts"];
}) {
	try {
		return await db.update(message).set({ parts }).where(eq(message.id, id));
	} catch (_error) {
		throw APIError.badRequest("Failed to update message");
	}
}

export async function getMessagesByChatId({ id }: { id: string }) {
	try {
		return await db
			.select()
			.from(message)
			.where(eq(message.chatId, id))
			.orderBy(asc(message.createdAt));
	} catch (_error) {
		throw APIError.badRequest("Failed to get messages by chat id");
	}
}

export async function voteMessage(inputData: VoteMessageInput) {
	try {
		const [existingVote] = await db
			.select()
			.from(vote)
			.where(and(eq(vote.messageId, inputData.messageId)));

		if (existingVote) {
			return await db
				.update(vote)
				.set({ isUpvoted: inputData.isUpvoted })
				.where(
					and(
						eq(vote.messageId, inputData.messageId),
						eq(vote.chatId, inputData.chatId),
					),
				);
		}
		return await db.insert(vote).values(inputData);
	} catch (_error) {
		throw APIError.badRequest("Failed to vote message");
	}
}

export async function getVotesByChatId({ id }: { id: string }) {
	try {
		return await db.select().from(vote).where(eq(vote.chatId, id));
	} catch (_error) {
		throw APIError.badRequest("Failed to get votes by chat id");
	}
}

export async function getMessageById({ id }: { id: string }) {
	try {
		return await db.select().from(message).where(eq(message.id, id));
	} catch (_error) {
		throw APIError.badRequest("Failed to get message by id");
	}
}

export async function deleteMessagesByChatIdAfterTimestamp({
	chatId,
	timestamp,
}: {
	chatId: string;
	timestamp: Date;
}) {
	try {
		const messagesToDelete = await db
			.select({ id: message.id })
			.from(message)
			.where(
				and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
			);

		const messageIds = messagesToDelete.map(
			(currentMessage) => currentMessage.id,
		);

		if (messageIds.length > 0) {
			await db
				.delete(vote)
				.where(
					and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)),
				);

			return await db
				.delete(message)
				.where(
					and(eq(message.chatId, chatId), inArray(message.id, messageIds)),
				);
		}
	} catch (_error) {
		throw APIError.badRequest(
			"Failed to delete messages by chat id after timestamp",
		);
	}
}

export async function updateChatVisibilityById(
	input: UpdateChatVisibilityInput,
) {
	try {
		return await db
			.update(chat)
			.set({
				visibility: input.visibility,
			})
			.where(eq(chat.id, input.id));
	} catch (_error) {
		throw APIError.badRequest("Failed to update chat visibility by id");
	}
}

export async function updateChatTitleById({
	chatId,
	title,
}: {
	chatId: string;
	title: string;
}) {
	try {
		return await db.update(chat).set({ title }).where(eq(chat.id, chatId));
	} catch (error) {
		console.warn("Failed to update title for chat", chatId, error);
		return;
	}
}

export async function getMessageCountByUserId({
	id,
	differenceInHours,
}: {
	id: string;
	differenceInHours: number;
}) {
	try {
		const twentyFourHoursAgo = new Date(
			Date.now() - differenceInHours * 60 * 60 * 1000,
		);

		const [stats] = await db
			.select({ count: count(message.id) })
			.from(message)
			.innerJoin(chat, eq(message.chatId, chat.id))
			.where(
				and(
					eq(chat.userId, id),
					gte(message.createdAt, twentyFourHoursAgo),
					eq(message.role, "user"),
				),
			)
			.execute();

		return stats?.count ?? 0;
	} catch (_error) {
		throw APIError.badRequest("Failed to get message count by user id");
	}
}

export async function createStreamId({
	streamId,
	chatId,
}: {
	streamId: string;
	chatId: string;
}) {
	try {
		await db
			.insert(stream)
			.values({ id: streamId, chatId, createdAt: new Date() });
	} catch (_error) {
		throw APIError.badRequest("Failed to create stream id");
	}
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
	try {
		const streamIds = await db
			.select({ id: stream.id })
			.from(stream)
			.where(eq(stream.chatId, chatId))
			.orderBy(asc(stream.createdAt))
			.execute();

		return streamIds.map(({ id }) => id);
	} catch (_error) {
		throw APIError.badRequest("Failed to get stream ids by chat id");
	}
}

export async function getOrganizationModelInfo({
	organizationId,
}: {
	organizationId?: string;
}) {
	if (!organizationId || organizationId == "app") {
		return {
			messageLimit: DAILY_MESSAGE_LIMIT,
			chatModels: DEFAULT_MODELS,
		};
	}
	try {
		const [org] = await db
			.select({
				dailyLimit: organization.userDailyLimit,
			})
			.from(organization)
			.where(eq(organization.id, organizationId))
			.limit(1);

		const models = await db
			.select()
			.from(organizationModel)
			.where(and(eq(organizationModel.organizationId, organizationId)));

		return {
			messageLimit: org?.dailyLimit || DAILY_MESSAGE_LIMIT,
			chatModels: models.length > 0 ? models : DEFAULT_MODELS,
		};
	} catch (_error) {
		console.error("Failed to get organization model info");

		return {
			messageLimit: DAILY_MESSAGE_LIMIT,
			chatModels: DEFAULT_MODELS,
		};
	}
}

export async function generateTitleFromUserMessage({
	message,
	chatModel,
}: {
	message: UIMessage;
	chatModel: LanguageModel;
}) {
	const { text } = await generateText({
		model: chatModel,
		system: TITLE_PROMPT,
		prompt: getTextFromMessage(message),
	});
	return text
		.replace(/^[#*"\s]+/, "")
		.replace(/["]+$/, "")
		.trim();
}

export async function deleteTrailingMessages({ id }: { id: string }) {
	const [message] = await getMessageById({ id });

	await deleteMessagesByChatIdAfterTimestamp({
		chatId: message.chatId,
		timestamp: message.createdAt,
	});
}

export async function executeSqlQuery({
	databaseUrl,
	sqlQuery,
	visualizationType,
}: ExecuteCustomSqlInput): Promise<SqlQueryResult> {
	let pool: Pool | null = null;

	try {
		const trimmedQuery = sqlQuery.trim();
		const upperQuery = trimmedQuery.toUpperCase();

		if (!upperQuery.startsWith("SELECT")) {
			throw APIError.badRequest(
				"Only SELECT queries are allowed for security reasons",
			);
		}

		if (
			upperQuery.includes("DROP") ||
			upperQuery.includes("DELETE") ||
			upperQuery.includes("INSERT") ||
			upperQuery.includes("UPDATE") ||
			upperQuery.includes("ALTER") ||
			upperQuery.includes("TRUNCATE")
		) {
			throw APIError.badRequest(
				"Destructive operations are not allowed in queries",
			);
		}

		pool = new Pool({
			connectionString: databaseUrl,
			max: 1,
			connectionTimeoutMillis: 10000,
			idleTimeoutMillis: 5000,
			ssl: databaseUrl.includes("sslmode=require")
				? { rejectUnauthorized: false }
				: undefined,
		});

		await pool
			.connect()
			.then((client) => client.release())
			.catch(() => {
				throw APIError.badRequest(
					"Invalid database connection. Unable to connect to the provided database URL.",
				);
			});

		const customDb = drizzle(pool);
		const result = await customDb.execute(trimmedQuery);

		const columns = result.rows.length > 0 ? Object.keys(result.rows[0]) : [];

		return {
			success: true,
			data: result.rows || [],
			rowCount: result.rowCount || result.rows.length,
			visualizationType,
			columns,
			metadata: {
				fields: result.fields?.map((field) => ({
					name: field.name,
					dataTypeID: field.dataTypeID,
				})),
				executedAt: new Date().toISOString(),
			},
			message:
				!result.rows || result.rows.length === 0
					? "Query executed successfully but returned no results"
					: undefined,
		};
	} finally {
		if (pool) {
			try {
				await pool.end();
			} catch (closeError) {
				console.error("Error closing database pool:", closeError);
			}
		}
	}
}
