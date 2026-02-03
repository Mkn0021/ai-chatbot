import APIError from "@/lib/api/error";
import { auth } from "@/app/(auth)/auth";
import { DBMessage } from "@/lib/db/schemas";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { asyncHandler } from "@/lib/api/response";
import { getLanguageModel } from "@/lib/ai/models";
import { getStreamContext } from "@/lib/ai/context";
import { errorHandler } from "@/middlewares/error-handler";
import { ChatIdQuerySchema, ChatStreamSchema } from "@/app/(chat)/schema";
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	generateId,
	stepCountIs,
	streamText,
} from "ai";
import {
	createStreamId,
	deleteChatById,
	generateTitleFromUserMessage,
	getChatById,
	getMessageCountByUserId,
	getMessagesByChatId,
	getOrganizationModelInfo,
	saveChat,
	saveMessages,
	updateChatTitleById,
	updateMessage,
} from "@/app/(chat)/actions";
import { ChatMessage } from "@/types";
import { convertToUIMessages, generateUUID } from "@/lib/utils";

// POST - api/chat
export async function POST(req: Request) {
	try {
		const session = await auth.api.getSession({ headers: req.headers });

		if (!session?.user) {
			throw APIError.unauthorized("You must be logged in to create a chat");
		}

		const input = ChatStreamSchema.parse(await req.json());

		const messageCount = await getMessageCountByUserId({
			id: session.user.id,
			differenceInHours: 24,
		});

		const { messageLimit, chatModels } = await getOrganizationModelInfo({
			organizationId: session.user.organizationId!,
		});

		if (messageCount > messageLimit) {
			throw APIError.forbidden("You hit the rate limit, try again after 24hr");
		}

		if (!chatModels.some((model) => model.id === input.selectedChatModel)) {
			throw APIError.notFound(
				`Model "${input.selectedChatModel}" is not available for your organization`,
			);
		}

		const isToolApprovalFlow = Boolean(input.messages);

		const chat = await getChatById({ id: input.id });
		let messagesFromDb: DBMessage[] = [];
		let titlePromise: Promise<string> | null = null;

		if (chat) {
			if (chat.userId !== session.user.id) {
				throw APIError.forbidden("You're not allowed to access the chat");
			}
			if (!isToolApprovalFlow) {
				messagesFromDb = await getMessagesByChatId({ id: input.id });
			}
		} else if (input.message?.role === "user") {
			await saveChat({
				id: input.id,
				userId: session.user.id,
				title: "New chat",
				visibility: input.selectedVisibilityType,
			});
			titlePromise = generateTitleFromUserMessage({
				message: input.message,
				chatModel: getLanguageModel(input.selectedChatModel),
			});
		}

		const uiMessages = isToolApprovalFlow
			? (input.messages as ChatMessage[])
			: [...convertToUIMessages(messagesFromDb), input.message as ChatMessage];

		if (input.message?.role === "user") {
			await saveMessages({
				messages: [
					{
						chatId: input.id,
						id: input.message.id,
						role: "user",
						parts: input.message.parts,
						attachments: [],
						createdAt: new Date(),
					},
				],
			});
		}

		const modelMessages = await convertToModelMessages(uiMessages);

		const stream = createUIMessageStream({
			originalMessages: isToolApprovalFlow ? uiMessages : undefined,
			execute: async ({ writer: dataStream }) => {
				const result = streamText({
					model: getLanguageModel(input.selectedChatModel),
					system: SYSTEM_PROMPT,
					messages: modelMessages,
					stopWhen: stepCountIs(5),
					experimental_activeTools: [], //TODO: add tools here
					tools: {},
					experimental_telemetry: {
						isEnabled: false, //TODO: isProductionEnvironment
						functionId: "stream-text",
					},
				});

				dataStream.merge(result.toUIMessageStream({ sendReasoning: true }));

				if (titlePromise) {
					const title = await titlePromise;
					dataStream.write({ type: "data-chat-title", data: title });
					updateChatTitleById({ chatId: input.id, title });
				}
			},
			generateId: generateUUID,
			onFinish: async ({ messages: finishedMessages }) => {
				if (isToolApprovalFlow) {
					for (const finishedMsg of finishedMessages) {
						const existingMsg = uiMessages.find((m) => m.id === finishedMsg.id);
						if (existingMsg) {
							await updateMessage({
								id: finishedMsg.id,
								parts: finishedMsg.parts,
							});
						} else {
							await saveMessages({
								messages: [
									{
										id: finishedMsg.id,
										role: finishedMsg.role,
										parts: finishedMsg.parts,
										createdAt: new Date(),
										attachments: [],
										chatId: input.id,
									},
								],
							});
						}
					}
				} else if (finishedMessages.length > 0) {
					await saveMessages({
						messages: finishedMessages.map((currentMessage) => ({
							id: currentMessage.id,
							role: currentMessage.role,
							parts: currentMessage.parts,
							createdAt: new Date(),
							attachments: [],
							chatId: input.id,
						})),
					});
				}
			},
			onError: () => "Oops, an error occurred!",
		});

		return createUIMessageStreamResponse({
			stream,
			async consumeSseStream({ stream: sseStream }) {
				if (!process.env.REDIS_URL) {
					return;
				}
				try {
					const streamContext = getStreamContext();
					if (streamContext) {
						const streamId = generateId();
						await createStreamId({ streamId, chatId: input.id });
						await streamContext.createNewResumableStream(
							streamId,
							() => sseStream,
						);
					}
				} catch (_) {
					// ignore redis errors
				}
			},
		});
	} catch (error) {
		return errorHandler(error);
	}
}

// DELETE - api/chat
export const DELETE = asyncHandler(async (_, context, data) => {
	const { chatId } = data.query;

	const chat = await getChatById({ id: chatId });

	if (!chat) {
		throw APIError.notFound("Chat not found");
	}

	if (chat.userId !== context.session!.user.id) {
		throw APIError.forbidden("You are not authorized to delete this chat");
	}

	const deletedChat = await deleteChatById({ id: chatId });

	return {
		data: deletedChat,
		message: "Chat deleted successfully",
	};
}, ChatIdQuerySchema);
