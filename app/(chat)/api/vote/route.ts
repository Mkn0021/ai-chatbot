import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";
import { ChatIdQuerySchema, VoteMessageSchema } from "@/app/(chat)/schema";
import { getChatById, getVotesByChatId, voteMessage } from "@/app/(chat)/action";

// GET - api/vote
export const GET = asyncHandler(
    async (_, context, data) => {
        const { chatId } = data.query;

        const chat = await getChatById({ id: chatId });

        if (!chat) {
            throw APIError.notFound("Chat not found");
        }


        if (chat.userId !== context.session!.user.id) {
            throw APIError.forbidden("You are not authorized to access these votes");
        }

        const votes = await getVotesByChatId({ id: chatId });

        return {
            data: votes,
            message: 'Votes retrieved successfully'
        };
    },
    ChatIdQuerySchema
);

// PATCH - api/vote
export const PATCH = asyncHandler(
    async (_, context, data) => {
        const chat = await getChatById({ id: data.body.chatId });

        if (!chat) {
            throw APIError.notFound("Chat not found");
        }

        if (chat.userId !== context.session!.user.id) {
            throw APIError.forbidden("You are not authorized to vote in this chat");
        }

        await voteMessage(data.body);

        return {
            message: 'Message voted successfully'
        };
    },
    VoteMessageSchema
);