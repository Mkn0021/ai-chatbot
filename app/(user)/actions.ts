import "server-only";

import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { user } from "@/lib/db/schemas";
import { AdminUpdateUserInput, UpdateMeInput } from "./schema";

export async function getUserById(userId: string) {
	return db.query.user.findFirst({
		where: eq(user.id, userId),
	});
}

export async function getAllUsers(options?: {
	limit?: number;
	offset?: number;
}) {
	return db.query.user.findMany({
		limit: options?.limit,
		offset: options?.offset,
	});
}

export async function updateUser(
	userId: string,
	data: UpdateMeInput | AdminUpdateUserInput,
) {
	const [userRecord] = await db
		.update(user)
		.set(data)
		.where(eq(user.id, userId))
		.returning();

	return userRecord;
}

export async function deleteUserById(userId: string) {
	await db.delete(user).where(eq(user.id, userId));
}
