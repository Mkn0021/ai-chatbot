import { asyncHandler } from "@/lib/api/response";
import { executeSqlQuery } from "@/app/(chat)/actions";
import { SqlQueryInputSchema } from "@/app/(chat)/schema";

// POST - api/execute-sql
export const POST = asyncHandler(async (_, context, data) => {
	const { sqlQuery, visualizationType } = data.body;

	const organizationId = context.session!.user.organizationId;

	const result = await executeSqlQuery({
		organizationId,
		sqlQuery,
		visualizationType,
	});

	return {
		data: result,
		message: "SQL query executed successfully",
	};
}, SqlQueryInputSchema);
