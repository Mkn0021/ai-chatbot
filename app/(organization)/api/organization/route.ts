import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";
import { UpdateOrganizationSchema } from "@/app/(organization)/schema";
import {
	getOrganizationById,
	updateOrganization,
} from "@/app/(organization)/actions";

// GET /api/organization
export const GET = asyncHandler(
	async (_, context, __) => {
		const organizationId = context.session!.user.organizationId;

		if (!organizationId) {
			throw APIError.notFound("User does not belong to an organization");
		}

		const result = await getOrganizationById({ organizationId });

		return {
			...result,
			message: "Organization fetched successfully",
		};
	},
	{
		cache: {
			table: "organization",
			getId: (context) => context.session?.user.organizationId ?? null,
		},
	},
);

// PUT /api/organization
export const PUT = asyncHandler(
	async (_, context, data) => {
		const organizationId = context.session!.user.organizationId;

		if (!organizationId) {
			throw APIError.notFound("User does not belong to an organization");
		}

		const result = await updateOrganization(organizationId, data.body);

		return {
			...result,
			message: "Organization updated successfully",
		};
	},
	{
		validationSchema: UpdateOrganizationSchema,
		cache: {
			table: "organization",
			getId: (ctx) => ctx.session?.user.organizationId ?? null,
		},
	},
);
