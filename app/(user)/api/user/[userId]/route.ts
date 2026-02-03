import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";
import { getUserById, updateUser, deleteUserById } from "@/app/(user)/actions";
import { UserIdParamsSchema, AdminUpdateUserSchema } from "@/app/(user)/schema";

// GET - api/user/[userId]
export const GET = asyncHandler(async (_, context, data) => {
	const userId = data.params!.userId;

	if (context.session!.user.role !== "admin") {
		throw APIError.forbidden("Admin access required");
	}

	const userRecord = await getUserById(userId);
	if (!userRecord) throw APIError.notFound("User not found");

	return {
		data: userRecord,
		message: "User retrieved successfully",
	};
}, UserIdParamsSchema);

// PUT - api/user/[userId]
export const PUT = asyncHandler(async (_, context, data) => {
	const userId = data.params!.userId;

	if (context.session!.user.role !== "admin") {
		throw APIError.forbidden("Admin access required");
	}

	const updatedUser = await updateUser(userId, data.body);

	return {
		data: updatedUser,
		message: "User updated successfully",
	};
}, AdminUpdateUserSchema);

// DELETE - api/user/[userId]
export const DELETE = asyncHandler(async (_, context, data) => {
	const userId = data.params!.userId;

	if (context.session!.user.role !== "admin") {
		throw APIError.forbidden("Admin access required");
	}

	await deleteUserById(userId);

	return {
		message: "User deleted successfully",
	};
}, UserIdParamsSchema);
