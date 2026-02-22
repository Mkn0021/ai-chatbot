import { asyncHandler } from "@/lib/api/response";
import { getOrganizationModelInfo } from "@/app/(organization)/actions";

// GET - api/model
export const GET = asyncHandler(async (_, context, __) => {
	const organizationId = context.session?.user.organizationId;

	const organization = await getOrganizationModelInfo({ organizationId });

	return {
		data: organization.models,
		message: "Model retrieved successfully",
	};
});
