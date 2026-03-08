import {
	getDatabaseTables,
	getDatabaseConnection,
	updateTableSelection,
	deleteDatabaseConnection,
} from "@/app/(organization)/actions";
import {
	ConnectDatabaseSchema,
	UpdateTableSelectionSchema,
} from "@/app/(organization)/schema";
import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";

// POST - /api/organization/database
export const POST = asyncHandler(
	async (_, context, validatedData) => {
		const organizationId = context.session?.user.organizationId;

		if (!organizationId) {
			throw APIError.unauthorized("No organization found");
		}

		const result = await getDatabaseTables(organizationId, validatedData.body);

		return {
			...result,
			message: "Connected and saved successfully",
		};
	},
	{
		validationSchema: ConnectDatabaseSchema,
		cache: {
			table: "databaseConnection",
			getId: (context) => context.session?.user.organizationId ?? null,
		},
	},
);

// GET - /api/organization/database
export const GET = asyncHandler(
	async (_, context, __) => {
		const organizationId = context.session?.user.organizationId;

		if (!organizationId) {
			throw APIError.unauthorized("No organization found");
		}

		const result = await getDatabaseConnection(organizationId);

		return {
			...result,
			message: result ? "Connection found" : "No connection found",
		};
	},
	{
		cache: {
			table: "databaseConnection",
			getId: (context) => context.session?.user.organizationId ?? null,
		},
	},
);

// PUT - /api/organization/database
export const PUT = asyncHandler(
	async (_, context, validatedData) => {
		const organizationId = context.session?.user.organizationId;

		if (!organizationId) {
			throw APIError.unauthorized("No organization found");
		}

		const result = await updateTableSelection(
			organizationId,
			validatedData.body,
		);

		return {
			...result,
			message: "Table selection updated",
		};
	},
	{
		validationSchema: UpdateTableSelectionSchema,
		cache: {
			table: "databaseConnection",
			getId: (context) => context.session?.user.organizationId ?? null,
		},
	},
);

// DELETE - /api/organization/database
export const DELETE = asyncHandler(
	async (_, context, __) => {
		const organizationId = context.session?.user.organizationId;

		if (!organizationId) {
			throw APIError.unauthorized("No organization found");
		}

		const result = await deleteDatabaseConnection(organizationId);

		return {
			...result,
			message: "Database disconnected successfully",
		};
	},
	{
		cache: {
			table: "databaseConnection",
			getId: (context) => context.session?.user.organizationId ?? null,
		},
	},
);
