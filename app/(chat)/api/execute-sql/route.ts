import { asyncHandler } from "@/lib/api/response";
import { SqlQueryInputSchema } from "@/app/(chat)/schema";
import { executeSqlQuery } from "@/app/(chat)/actions";

// POST - api/execute-sql
export const POST = asyncHandler(async (_, __, data) => {
	const { databaseUrl, sqlQuery, visualizationType } = data.body;

	const result = await executeSqlQuery({
		databaseUrl,
		sqlQuery,
		visualizationType,
	});

	return {
		data: result,
		message: "SQL query executed successfully",
	};
}, SqlQueryInputSchema);
