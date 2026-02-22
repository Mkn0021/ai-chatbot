import "server-only";

import db from "@/lib/db";
import { User } from "better-auth";
import APIError from "@/lib/api/error";
import { generateUUID } from "@/lib/utils";
import { DEFAULT_MODELS } from "@/lib/ai/models";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { organization, user as userTable } from "@/lib/db/schemas";
import { UpdateOrganizationInput } from "./schema";

export async function createUserOrganization({ user }: { user: User }) {
	try {
		const result = await db.transaction(async (tx) => {
			const [userOrg] = await tx
				.insert(organization)
				.values({
					id: generateUUID(),
					name: `${user.name}'s Organization`,
					dailyMessageLimit: 1000,
					defaultModelId: DEFAULT_MODELS[0].id,
				})
				.returning();

			if (!userOrg) throw APIError.internal("Failed to create organization");

			await tx
				.update(userTable)
				.set({
					organizationId: userOrg.id,
					updatedAt: new Date(),
				})
				.where(eq(userTable.id, user.id));

			return userOrg;
		});

		return result;
	} catch (_error) {
		throw APIError.internal("Failed to create user organization");
	}
}

export async function getOrganizationById(organizationId: string) {
	const org = await db.query.organization.findFirst({
		where: eq(organization.id, organizationId),
	});

	if (!org) throw APIError.notFound("Organization not found");

	return org;
}

export async function updateOrganization(
	organizationId: string,
	data: UpdateOrganizationInput,
) {
	const [updatedOrg] = await db
		.update(organization)
		.set({ ...data })
		.where(eq(organization.id, organizationId))
		.returning();

	if (!updatedOrg) throw APIError.notFound("Organization not found");

	return updatedOrg;
}
