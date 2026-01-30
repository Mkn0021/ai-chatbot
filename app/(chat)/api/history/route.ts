import { asyncHandler } from "@/lib/api/response";
import { GetChatsHistorySchema } from "@/app/(chat)/schema";
import { deleteAllChatsByUserId, getChatsByUserId } from "@/app/(chat)/action";

// GET - api/history
export const GET = asyncHandler(
    async (_, context, data) => {
        const { limit, startingAfter, endingBefore } = data.query;

        const chats = await getChatsByUserId({
            id: context.session!.user.id,
            limit,
            startingAfter,
            endingBefore,
        });

        return {
            data: chats,
            message: 'Chats retrieved successfully'
        };
    },
    GetChatsHistorySchema
);

// DELETE - api/history
export const DELETE = asyncHandler(
    async (_, context, __) => {
        const result = await deleteAllChatsByUserId({
            userId: context.session!.user.id
        });

        return {
            data: result,
            message: 'All chats deleted successfully'
        };
    }
);