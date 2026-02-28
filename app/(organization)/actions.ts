import "server-only";

import db from "@/lib/db";
import { User } from "better-auth";
import APIError from "@/lib/api/error";
import { generateUUID } from "@/lib/utils";
import { eq } from "drizzle-orm/sql/expressions/conditions";
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
	DatabaseTablesResult,
	GetDatabaseConnectionResult,
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
}): Promise<GetOrganizationByIdResult> {
	const org = await db.query.organization.findFirst({
		where: eq(organization.id, organizationId),
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

export async function getDatabaseTables(
	organizationId: string,
	data: ConnectDatabaseInput,
): Promise<DatabaseTablesResult> {
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
				WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'drizzle')
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
			})
			.returning();

		if (!connection) {
			throw APIError.internal("Failed to save connection");
		}

		return {
			connection,
			tables: tablesData.map((t) => ({ ...t, isSelected: false })),
		};
	} catch (error: any) {
		throw APIError.badRequest(error.message || "Failed to connect to database");
	} finally {
		if (pool) {
			await pool.end();
		}
	}
}

export async function getDatabaseConnection(
	organizationId: string,
): Promise<GetDatabaseConnectionResult | null> {
	const connection = await db.query.databaseConnection.findFirst({
		where: eq(databaseConnection.organizationId, organizationId),
	});

	if (!connection) {
		return null;
	}

	const tablesData = (connection.tablesData as DatabaseTable[]) || [];
	const selectedTables = (connection.selectedTables as string[]) || [];

	const tables = tablesData.map((t) => ({
		...t,
		isSelected: selectedTables.includes(`${t.table_schema}.${t.table_name}`),
	}));

	return {
		connection: {
			id: connection.id,
			name: connection.name,
			isActive: connection.isActive,
		},
		tables,
	};
}

export async function updateTableSelection(
	organizationId: string,
	data: UpdateTableSelectionInput,
): Promise<GetDatabaseConnectionResult> {
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
			connection: {
				id: updated.id,
				name: updated.name,
				isActive: updated.isActive,
			},
			tables,
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

		return deleted;
	});
}
