import {
	getDatabaseTables,
	getDatabaseConnection,
	updateTableSelection,
} from "@/app/(organization)/actions";
import {
	ConnectDatabaseSchema,
	UpdateTableSelectionSchema,
} from "@/app/(organization)/schema";
import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";

// POST - api/organization/database/connect
export const POST = asyncHandler(async (_, context, validatedData) => {
	const organizationId = context.session?.user.organizationId;

	if (!organizationId) {
		throw APIError.unauthorized("No organization found");
	}

	const result = await getDatabaseTables(organizationId, validatedData.body);

	return {
		data: result,
		message: "Connected and saved successfully",
	};
}, ConnectDatabaseSchema);

// GET - api/organization/database/connect
export const GET = asyncHandler(async (_, context) => {
	const organizationId = context.session?.user.organizationId;

	if (!organizationId) {
		throw APIError.unauthorized("No organization found");
	}

	const result = await getDatabaseConnection(organizationId);

	return {
		data: result,
		message: result ? "Connection found" : "No connection found",
	};
});

// PUT - api/organization/database/connect
export const PUT = asyncHandler(async (_, context, validatedData) => {
	const organizationId = context.session?.user.organizationId;

	if (!organizationId) {
		throw APIError.unauthorized("No organization found");
	}

	const result = await updateTableSelection(organizationId, validatedData.body);

	return {
		data: result,
		message: "Table selection updated",
	};
}, UpdateTableSelectionSchema);
