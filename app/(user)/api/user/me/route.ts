import { auth } from "@/app/(auth)/auth";
import { asyncHandler } from "@/lib/api/response";
import { UpdateMeSchema } from "@/app/(user)/schema";
import { deleteUserById, getUserById, updateUser } from "@/app/(user)/actions";

// GET - api/user/me
export const GET = asyncHandler(
	async (_, context, __) => {
		const result = await getUserById(context.session!.user.id);

		return {
			...result,
			message: "User retrieved successfully",
		};
	},
	{
		cache: {
			table: "users",
			getId: (context) => context.session?.user.id ?? null,
		},
	},
);

// PUT - api/user/me
export const PUT = asyncHandler(
	async (_, context, data) => {
		const result = await updateUser(context.session!.user.id, data.body);

		return {
			...result,
			message: "User updated successfully",
		};
	},
	{
		validationSchema: UpdateMeSchema,
		cache: {
			table: "users",
			getId: (context) => context.session?.user.id ?? null,
		},
	},
);

// DELETE - api/user/me
export const DELETE = asyncHandler(
	async (req, context, __) => {
		await deleteUserById(context.session!.user.id);
		await auth.api.signOut({ headers: req.headers });

		return {
			message: "User deleted successfully",
		};
	},
	{
		cache: {
			table: "users",
			getId: (context) => context.session?.user.id ?? null,
		},
	},
);
