import { asyncHandler } from "@/lib/api/response";
import { UpdateChatVisibilitySchema } from "@/app/(chat)/schema";
import { updateChatVisibilityById } from "@/app/(chat)/actions";

// PATCH - /api/chat/visibility
export const PATCH = asyncHandler(async (_, __, data) => {
	const updatedChat = await updateChatVisibilityById(data.body);

	return {
		data: updatedChat,
		message: "Chat visibility updated successfully",
	};
}, UpdateChatVisibilitySchema);
