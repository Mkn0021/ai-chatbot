import { deleteTrailingMessages } from "@/app/(chat)/actions";
import { MessageIdQuerySchema } from "@/app/(chat)/schema";
import { asyncHandler } from "@/lib/api/response";

// DELETE - api/chat/message
export const DELETE = asyncHandler(
    async (_, __, data) => {

        await deleteTrailingMessages({
            id: data.query.messageId,
        });

        return {
            message: 'Message deleted successfully'
        };
    },
    MessageIdQuerySchema
);