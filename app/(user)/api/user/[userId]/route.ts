import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";
import { getUserById, updateUser, deleteUserById } from "@/app/(user)/actions";
import { UserIdParamsSchema, AdminUpdateUserSchema } from "@/app/(user)/schema";

// GET - api/user/[userId]
export const GET = asyncHandler(
	async (_, context, data) => {
		const userId = data.params!.userId;

		if (context.session!.user.role !== "admin") {
			throw APIError.forbidden("Admin access required");
		}

		const result = await getUserById(userId);

		return {
			...result,
			message: "User retrieved successfully",
		};
	},
	{
		validationSchema: UserIdParamsSchema,
		cache: {
			table: "users",
			getId: (data) => data.params!.userId,
		},
	},
);

// PUT - api/user/[userId]
export const PUT = asyncHandler(
	async (_, context, data) => {
		const userId = data.params!.userId;

		if (context.session!.user.role !== "admin") {
			throw APIError.forbidden("Admin access required");
		}

		const result = await updateUser(userId, data.body);

		return {
			...result,
			message: "User updated successfully",
		};
	},
	{
		validationSchema: AdminUpdateUserSchema,
		cache: {
			table: "users",
			getId: (data) => data.params!.userId,
		},
	},
);

// DELETE - api/user/[userId]
export const DELETE = asyncHandler(
	async (_, context, data) => {
		const userId = data.params!.userId;

		if (context.session!.user.role !== "admin") {
			throw APIError.forbidden("Admin access required");
		}

		await deleteUserById(userId);

		return {
			message: "User deleted successfully",
		};
	},
	{
		validationSchema: UserIdParamsSchema,
		cache: {
			table: "users",
			getId: (data) => data.params!.userId,
		},
	},
);
