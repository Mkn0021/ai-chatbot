import APIError from "@/lib/api/error";
import { asyncHandler } from "@/lib/api/response";
import { UpdateOrganizationSchema } from "@/app/(organization)/schema";
import {
	getOrganizationById,
	updateOrganization,
} from "@/app/(organization)/actions";

// GET /api/organization
export const GET = asyncHandler(async (_, context, __) => {
	const organizationId = context.session!.user.organizationId;

	if (!organizationId) {
		throw APIError.notFound("User does not belong to an organization");
	}

	const organization = await getOrganizationById(organizationId);

	return {
		data: organization,
		message: "Organization fetched successfully",
	};
});

// PUT /api/organization
export const PUT = asyncHandler(async (_, context, data) => {
	const organizationId = context.session!.user.organizationId;

	if (!organizationId) {
		throw APIError.notFound("User does not belong to an organization");
	}

	const organization = await updateOrganization(organizationId, data.body);

	return {
		data: organization,
		message: "Organization updated successfully",
	};
}, UpdateOrganizationSchema);
