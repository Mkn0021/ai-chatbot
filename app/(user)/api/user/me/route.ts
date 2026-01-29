import APIError from '@/lib/api/error';
import { auth } from '@/app/(auth)/auth';
import { asyncHandler } from '@/lib/api/response';
import { UpdateMeSchema } from '@/app/(user)/api/schema';
import { deleteUserById, getUserById, updateUser } from '@/app/(user)/api/action';


// GET - api/user/me
export const GET = asyncHandler(
    async (_, context, __) => {

        const userRecord = await getUserById(context.session!.user.id);
        if (!userRecord) throw APIError.notFound("User not found");

        return {
            data: userRecord,
            message: 'User retrieved successfully'
        };
    }
);

// PUT - api/user/me
export const PUT = asyncHandler(
    async (_, context, data) => {

        const userRecord = await updateUser(context.session!.user.id, data.body);

        return {
            data: userRecord,
            message: 'User updated successfully'
        };
    },
    UpdateMeSchema
);


// DELETE - api/user/me
export const DELETE = asyncHandler(
    async (req, context, __) => {

        await deleteUserById(context.session!.user.id);
        await auth.api.signOut({ headers: req.headers });

        return {
            message: 'User deleted successfully'
        };
    }
);
