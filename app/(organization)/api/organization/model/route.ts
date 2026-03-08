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
export const GET = asyncHandler(
	async (_, context, __) => {
		const organizationId = context.session!.user.organizationId;

		if (!organizationId) {
			throw APIError.notFound("User does not belong to an organization");
		}

		const result = await getOrganizationModels(organizationId);

		return {
			...result,
			message: "Models fetched successfully",
		};
	},
	{
		cache: {
			table: "organizationModels",
			getId: (context) => context.session?.user.organizationId ?? null,
		},
	},
);

// POST /api/organization/model
export const POST = asyncHandler(
	async (_, context, data) => {
		const organizationId = context.session!.user.organizationId;

		if (!organizationId) {
			throw APIError.notFound("User does not belong to an organization");
		}

		const result = await createOrganizationModel(organizationId, data.body);

		return {
			...result,
			message: "Model created successfully",
		};
	},
	{
		validationSchema: CreateOrganizationModelSchema,
		cache: {
			table: "organizationModels",
			getId: (ctx) => ctx.session?.user.organizationId ?? null,
		},
	},
);

// PUT /api/organization/model
export const PUT = asyncHandler(
	async (req, context, data) => {
		const organizationId = context.session!.user.organizationId;

		if (!organizationId) {
			throw APIError.notFound("User does not belong to an organization");
		}

		const url = new URL(req.url);
		const modelId = url.searchParams.get("id");

		if (!modelId) {
			throw APIError.badRequest("Model ID is required");
		}

		const result = await updateOrganizationModel(
			modelId,
			organizationId,
			data.body,
		);

		return {
			...result,
			message: "Model updated successfully",
		};
	},
	{
		validationSchema: UpdateOrganizationModelSchema,
		cache: {
			table: "organizationModels",
			getId: (ctx) => ctx.session?.user.organizationId ?? null,
		},
	},
);

// DELETE /api/organization/model
export const DELETE = asyncHandler(
	async (req, context, __) => {
		const organizationId = context.session!.user.organizationId;

		if (!organizationId) {
			throw APIError.notFound("User does not belong to an organization");
		}

		const url = new URL(req.url);
		const modelId = url.searchParams.get("id");

		if (!modelId) {
			throw APIError.badRequest("Model ID is required");
		}

		const result = await deleteOrganizationModel(modelId, organizationId);

		return {
			...result,
			message: "Model deleted successfully",
		};
	},
	{
		cache: {
			table: "organizationModels",
			getId: (ctx) => ctx.session?.user.organizationId ?? null,
		},
	},
);
