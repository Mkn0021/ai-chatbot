import { asyncHandler } from "@/lib/api/response";
import { getOrganizationModelInfo } from "@/app/(chat)/actions";

// GET - api/model
export const GET = asyncHandler(
    async (_, context, __) => {
        const organizationId = context.session?.user.organizationId;

        const organization = await getOrganizationModelInfo({ organizationId })

        return {
            data: organization.chatModels,
            message: 'Model retrieved successfully'
        };
    },
);