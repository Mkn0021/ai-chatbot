import "server-only";

import db from "@/lib/db";
import { User } from "better-auth";
import APIError from "@/lib/api/error";
import { generateUUID, generateModelId } from "@/lib/utils";
import { DEFAULT_MODELS } from "@/lib/ai/models";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import {
	organization,
	organizationModel,
	user as userTable,
} from "@/lib/db/schemas";
import {
	UpdateOrganizationInput,
	CreateOrganizationModelInput,
	UpdateOrganizationModelInput,
} from "./schema";

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

export async function getOrganizationModels(organizationId: string) {
	const models = await db.query.organizationModel.findMany({
		where: eq(organizationModel.organizationId, organizationId),
	});

	return models;
}

export async function createOrganizationModel(
	organizationId: string,
	data: CreateOrganizationModelInput,
) {
	const modelId = generateModelId(data.provider, data.name);

	const existingModel = await db.query.organizationModel.findFirst({
		where: eq(organizationModel.id, modelId),
	});

	if (existingModel) {
		throw APIError.badRequest(
			`A model with the name "${data.name}" already exists for this provider`,
		);
	}

	const [model] = await db
		.insert(organizationModel)
		.values({
			id: modelId,
			organizationId,
			...data,
		})
		.returning();

	if (!model) throw APIError.internal("Failed to create model");

	return model;
}

export async function updateOrganizationModel(
	modelId: string,
	organizationId: string,
	data: UpdateOrganizationModelInput,
) {
	const existingModel = await db.query.organizationModel.findFirst({
		where: eq(organizationModel.id, modelId),
	});

	if (!existingModel) throw APIError.notFound("Model not found");

	if (existingModel.organizationId !== organizationId) {
		throw APIError.forbidden("You don't have permission to update this model");
	}

	const [updatedModel] = await db
		.update(organizationModel)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(organizationModel.id, modelId))
		.returning();

	if (!updatedModel) throw APIError.internal("Failed to update model");

	return updatedModel;
}

export async function deleteOrganizationModel(
	modelId: string,
	organizationId: string,
) {
	const existingModel = await db.query.organizationModel.findFirst({
		where: eq(organizationModel.id, modelId),
	});

	if (!existingModel) throw APIError.notFound("Model not found");

	if (existingModel.organizationId !== organizationId) {
		throw APIError.forbidden("You don't have permission to delete this model");
	}

	const [deletedModel] = await db
		.delete(organizationModel)
		.where(eq(organizationModel.id, modelId))
		.returning();

	if (!deletedModel) throw APIError.internal("Failed to delete model");

	return deletedModel;
}

export async function getOrganizationModelInfo({
	organizationId,
}: {
	organizationId?: string;
}) {
	if (!organizationId) {
		throw APIError.notFound("User does not belong to an organization");
	}

	const models = await db.query.organizationModel.findMany({
		where: eq(organizationModel.organizationId, organizationId),
	});

	const org = await db.query.organization.findFirst({
		where: eq(organization.id, organizationId),
	});

	if (!org) {
		throw APIError.notFound("Organization not found");
	}

	return {
		models,
		dailyMessageLimit: org.dailyMessageLimit || 100,
	};
}
