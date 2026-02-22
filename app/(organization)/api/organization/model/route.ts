import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";
import {
	CreateOrganizationModelSchema,
	UpdateOrganizationModelSchema,
} from "@/app/(organization)/schema";
import {
	getOrganizationModels,
	createOrganizationModel,
	updateOrganizationModel,
	deleteOrganizationModel,
} from "@/app/(organization)/actions";

// GET /api/organization/model
export const GET = asyncHandler(async (_, context, __) => {
	const organizationId = context.session!.user.organizationId;

	if (!organizationId) {
		throw APIError.notFound("User does not belong to an organization");
	}

	const models = await getOrganizationModels(organizationId);

	return {
		data: models,
		message: "Models fetched successfully",
	};
});

// POST /api/organization/model
export const POST = asyncHandler(async (_, context, data) => {
	const organizationId = context.session!.user.organizationId;

	if (!organizationId) {
		throw APIError.notFound("User does not belong to an organization");
	}

	const model = await createOrganizationModel(organizationId, data.body);

	return {
		data: model,
		message: "Model created successfully",
	};
}, CreateOrganizationModelSchema);

// PUT /api/organization/model
export const PUT = asyncHandler(async (req, context, data) => {
	const organizationId = context.session!.user.organizationId;

	if (!organizationId) {
		throw APIError.notFound("User does not belong to an organization");
	}

	const url = new URL(req.url);
	const modelId = url.searchParams.get("id");

	if (!modelId) {
		throw APIError.badRequest("Model ID is required");
	}

	const model = await updateOrganizationModel(
		modelId,
		organizationId,
		data.body,
	);

	return {
		data: model,
		message: "Model updated successfully",
	};
}, UpdateOrganizationModelSchema);

// DELETE /api/organization/model
export const DELETE = asyncHandler(async (req, context, __) => {
	const organizationId = context.session!.user.organizationId;

	if (!organizationId) {
		throw APIError.notFound("User does not belong to an organization");
	}

	const url = new URL(req.url);
	const modelId = url.searchParams.get("id");

	if (!modelId) {
		throw APIError.badRequest("Model ID is required");
	}

	const model = await deleteOrganizationModel(modelId, organizationId);

	return {
		data: model,
		message: "Model deleted successfully",
	};
});
