import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";
import { getAllUsers } from "@/app/(user)/actions";
import { FetchUsersSchema } from "@/app/(user)/schema";

// GET /api/user
export const GET = asyncHandler(
	async (_, context, data) => {
		const limit = data.query?.limit;
		const offset = data.query?.offset ?? 0;

		if (context.session!.user.role !== "admin") {
			throw APIError.forbidden("Admin access required");
		}

		const result = await getAllUsers({ limit, offset });

		return {
			...result,
			message: "Users fetched successfully",
		};
	},
	{
		validationSchema: FetchUsersSchema,
		cache: {
			table: "users",
			getId: () => "all-users",
		},
	},
);
