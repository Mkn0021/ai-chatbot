import "server-only";

import db from "@/lib/db";
import { eq, max } from "drizzle-orm";
import APIError from "@/lib/api/error";
import { user } from "@/lib/db/schemas";
import { generateEtag } from "@/lib/utils";
import { AdminUpdateUserInput, UpdateMeInput } from "./schema";

export async function getUserById(userId: string) {
	const userRecord = await db.query.user.findFirst({
		where: eq(user.id, userId),
	});

	if (!userRecord) {
		throw APIError.notFound("User not found");
	}

	return {
		data: userRecord,
		etag: generateEtag(userRecord.updatedAt),
	};
}

export async function getAllUsers(options?: {
	limit?: number;
	offset?: number;
}) {
	const [users, maxResult] = await Promise.all([
		db.query.user.findMany({
			limit: options?.limit,
			offset: options?.offset,
		}),
		db
			.select({ latestUpdatedAt: max(user.updatedAt) })
			.from(user)
			.then((result) => result[0]),
	]);

	const maxUpdatedAt: Date = maxResult?.latestUpdatedAt ?? new Date();

	return {
		data: users,
		etag: generateEtag(maxUpdatedAt),
	};
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

	return {
		data: userRecord,
		etag: generateEtag(userRecord.updatedAt),
	};
}

export async function deleteUserById(userId: string) {
	await db.delete(user).where(eq(user.id, userId));
}
