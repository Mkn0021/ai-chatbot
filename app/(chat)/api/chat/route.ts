import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";
import { ChatIdQuerySchema } from "@/app/(chat)/schema";
import { deleteChatById, getChatById } from "@/app/(chat)/action";

// DELETE - api/chat
export const DELETE = asyncHandler(
    async (_, context, data) => {
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
            message: 'Chat deleted successfully'
        };
    },
    ChatIdQuerySchema
);