import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";
import { getAllUsers } from "@/app/(user)/actions";
import { FetchUsersSchema } from "@/app/(user)/schema";

// GET /api/user
export const GET = asyncHandler(
    async (_, context, data) => {
        const limit = data.query?.limit;
        const offset = data.query?.offset ?? 0;

        if (context.session!.user.role !== 'admin') {
            throw APIError.forbidden("Admin access required");
        }

        const users = await getAllUsers({ limit, offset });

        return {
            data: users,
            message: "Users fetched successfully",
        };
    },
    FetchUsersSchema
);
