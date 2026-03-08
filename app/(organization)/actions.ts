import "server-only";

import db from "@/lib/db";
import { User } from "better-auth";
import APIError from "@/lib/api/error";
import { generateUUID, generateEtag } from "@/lib/utils";
import { eq, max } from "drizzle-orm";
import {
	organization,
	organizationModel,
	user as userTable,
	databaseConnection,
} from "@/lib/db/schemas";
import {
	UpdateOrganizationInput,
	CreateOrganizationModelInput,
	UpdateOrganizationModelInput,
	ConnectDatabaseInput,
	DatabaseTable,
	UpdateTableSelectionInput,
	GetOrganizationByIdResult,
} from "./schema";
import { Pool } from "pg";
import { getDatabaseContext } from "@/lib/ai/prompts";

export async function createUserOrganization({ user }: { user: User }) {
	try {
		const result = await db.transaction(async (tx) => {
			const [userOrg] = await tx
				.insert(organization)
				.values({
					id: generateUUID(),
					name: `${user.name}'s Organization`,
					dailyMessageLimit: 1000,
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

export async function getOrganizationById({
	organizationId,
}: {
	organizationId: string;
}) {
	const org = await db.query.organization.findFirst({
		where: eq(organization.id, organizationId),
		columns: {
			createdAt: false,
		},
	});

	if (!org) {
		throw APIError.notFound("Organization not found");
	}

	const { updatedAt, ...orgData } = org;

	return {
		data: orgData,
		etag: generateEtag(updatedAt),
	};
}

export async function getOrganizationWithModels({
	organizationId,
}: {
	organizationId: string;
}): Promise<GetOrganizationByIdResult> {
	const org = await db.query.organization.findFirst({
		where: eq(organization.id, organizationId),
		columns: {
			createdAt: false,
		},
		with: {
			databaseConnection: {
				columns: {
					databaseContext: true,
				},
			},
			models: {
				columns: {
					id: true,
					name: true,
					provider: true,
					description: true,
					baseUrl: true,
					status: true,
				},
			},
		},
	});

	if (!org) {
		throw APIError.notFound("Organization not found");
	}

	return {
		id: org.id,
		name: org.name,
		dailyMessageLimit: org.dailyMessageLimit,
		databaseContext: org.databaseConnection?.databaseContext ?? null,
		models: org.models,
	};
}

export async function updateOrganization(
	organizationId: string,
	data: UpdateOrganizationInput,
) {
	const [updatedOrg] = await db
		.update(organization)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(organization.id, organizationId))
		.returning();

	if (!updatedOrg) throw APIError.notFound("Organization not found");

	return {
		data: updatedOrg,
		etag: generateEtag(updatedOrg.updatedAt),
	};
}

export async function getOrganizationModels(organizationId: string) {
	const [models, maxResult] = await Promise.all([
		db.query.organizationModel.findMany({
			where: eq(organizationModel.organizationId, organizationId),
		}),
		db
			.select({ latestUpdatedAt: max(organizationModel.updatedAt) })
			.from(organizationModel)
			.where(eq(organizationModel.organizationId, organizationId))
			.then((result) => result[0]),
	]);

	const maxUpdatedAt = maxResult?.latestUpdatedAt || new Date();

	return {
		data: models,
		etag: generateEtag(maxUpdatedAt),
	};
}

export async function createOrganizationModel(
	organizationId: string,
	data: CreateOrganizationModelInput,
) {
	if (!data.id) {
		throw APIError.badRequest("Model ID is required");
	}

	const existingModel = await db.query.organizationModel.findFirst({
		where: eq(organizationModel.id, data.id),
	});

	if (existingModel) {
		throw APIError.badRequest(
			`A model with the ID "${data.id}" already exists`,
		);
	}

	const [model] = await db
		.insert(organizationModel)
		.values({
			...data,
			organizationId,
			updatedAt: new Date(),
		})
		.returning();

	if (!model) throw APIError.internal("Failed to create model");

	const { updatedAt, ...modelData } = model;

	return {
		data: modelData,
		etag: generateEtag(updatedAt),
	};
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

	return {
		data: updatedModel,
		etag: generateEtag(updatedModel.updatedAt),
	};
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

	const { updatedAt, ...modelData } = deletedModel;

	return {
		data: modelData,
		etag: generateEtag(updatedAt),
	};
}

export async function getDatabaseTables(
	organizationId: string,
	data: ConnectDatabaseInput,
) {
	const { connectionString, name } = data;
	let pool: Pool | null = null;

	try {
		pool = new Pool({
			connectionString,
			connectionTimeoutMillis: 8000,
			max: 1,
			idleTimeoutMillis: 3000,
		});

		await pool.query("SELECT 1");

		const tablesQuery = `
			SELECT
				table_schema,
				table_name,
				json_agg(column_obj ORDER BY ordinal_position) AS columns
			FROM (
				SELECT DISTINCT
					table_schema,
					table_name,
					column_name,
					data_type,
					ordinal_position,
					jsonb_build_object(
						'column_name', column_name,
						'data_type', data_type
					) AS column_obj
				FROM information_schema.columns
				WHERE table_schema = 'public'
			) t
			GROUP BY table_schema, table_name
			ORDER BY table_schema, table_name;
		`;

		const result = await pool.query(tablesQuery);
		const tablesData: DatabaseTable[] = result.rows;

		const [connection] = await db
			.insert(databaseConnection)
			.values({
				id: generateUUID(),
				organizationId,
				connectionString,
				name: name || "Database Connection",
				tablesData: tablesData,
				selectedTables: [],
				isActive: true,
				updatedAt: new Date(),
			})
			.returning();

		if (!connection) {
			throw APIError.internal("Failed to save connection");
		}

		return {
			data: {
				connection,
				tables: tablesData.map((t) => ({ ...t, isSelected: false })),
			},
			etag: generateEtag(connection.updatedAt),
		};
	} catch (error: any) {
		throw APIError.badRequest(error.message || "Failed to connect to database");
	} finally {
		if (pool) await pool.end();
	}
}

export async function getDatabaseConnection(organizationId: string) {
	const connection = await db.query.databaseConnection.findFirst({
		where: eq(databaseConnection.organizationId, organizationId),
	});

	if (!connection) {
		return {
			data: null,
			etag: generateEtag(new Date()),
		};
	}

	const tablesData = (connection.tablesData as DatabaseTable[]) || [];
	const selectedTables = (connection.selectedTables as string[]) || [];

	const tables = tablesData.map((t) => ({
		...t,
		isSelected: selectedTables.includes(`${t.table_schema}.${t.table_name}`),
	}));

	return {
		data: {
			connection: {
				id: connection.id,
				name: connection.name,
				isActive: connection.isActive,
			},
			tables,
		},
		etag: generateEtag(connection.updatedAt),
	};
}

export async function updateTableSelection(
	organizationId: string,
	data: UpdateTableSelectionInput,
) {
	return await db.transaction(async (tx) => {
		const connection = await tx.query.databaseConnection.findFirst({
			where: eq(databaseConnection.organizationId, organizationId),
		});

		if (!connection) {
			throw APIError.notFound("No database connection found");
		}

		if (!connection.tablesData) {
			throw APIError.badRequest("No tables metadata found");
		}

		const filteredTables = (connection.tablesData as DatabaseTable[]).filter(
			(table) =>
				data.selectedTables.includes(
					`${table.table_schema}.${table.table_name}`,
				),
		);

		const newDatabaseContext = getDatabaseContext(filteredTables);

		const [updated] = await tx
			.update(databaseConnection)
			.set({
				selectedTables: data.selectedTables as string[],
				databaseContext: newDatabaseContext,
				updatedAt: new Date(),
			})
			.where(eq(databaseConnection.id, connection.id))
			.returning();

		if (!updated) {
			throw APIError.internal("Failed to update table selection");
		}

		const tablesData = (updated.tablesData as DatabaseTable[]) || [];
		const selectedTables = (updated.selectedTables as string[]) || [];

		const tables = tablesData.map((t) => ({
			...t,
			isSelected: selectedTables.includes(`${t.table_schema}.${t.table_name}`),
		}));

		return {
			data: {
				connection: {
					id: updated.id,
					name: updated.name,
					isActive: updated.isActive,
				},
				tables,
			},
			etag: generateEtag(updated.updatedAt),
		};
	});
}

export async function deleteDatabaseConnection(organizationId: string) {
	return await db.transaction(async (tx) => {
		const connection = await tx.query.databaseConnection.findFirst({
			where: eq(databaseConnection.organizationId, organizationId),
		});

		if (!connection) {
			throw APIError.notFound("No database connection found");
		}

		await tx
			.update(databaseConnection)
			.set({
				tablesData: [],
				selectedTables: [],
				databaseContext: null,
				isActive: false,
				updatedAt: new Date(),
			})
			.where(eq(databaseConnection.id, connection.id));

		const [deleted] = await tx
			.delete(databaseConnection)
			.where(eq(databaseConnection.id, connection.id))
			.returning();

		if (!deleted)
			throw APIError.internal("Failed to delete database connection");

		const { updatedAt, ...deletedData } = deleted;

		return {
			data: deletedData,
			etag: generateEtag(updatedAt),
		};
	});
}
