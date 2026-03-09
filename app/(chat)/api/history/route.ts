import { asyncHandler } from "@/lib/api/response";
import { GetChatsHistorySchema } from "@/app/(chat)/schema";
import { deleteAllChatsByUserId, getChatsByUserId } from "@/app/(chat)/actions";

// GET - api/history
export const GET = asyncHandler(
	async (_, context, data) => {
		const { limit, startingAfter, endingBefore } = data.query;

		const result = await getChatsByUserId({
			id: context.session!.user.id,
			limit,
			startingAfter,
			endingBefore,
		});

		return {
			...result,
			message: "Chats retrieved successfully",
		};
	},
	{
		validationSchema: GetChatsHistorySchema,
		cache: {
			table: "chatHistory",
			getId: (context) => context.session?.user.id ?? null,
		},
	},
);

// DELETE - api/history
export const DELETE = asyncHandler(
	async (_, context, __) => {
		const result = await deleteAllChatsByUserId({
			userId: context.session!.user.id,
		});

		return {
			...result,
			message: "All chats deleted successfully",
		};
	},
	{
		cache: {
			table: "chatHistory",
			getId: (context) => context.session?.user.id ?? null,
		},
	},
);
