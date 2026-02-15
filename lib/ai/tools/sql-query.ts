import { tool, UIMessageStreamWriter } from "ai";
import { SQL_QUERY_DESCRIPTION } from "@/lib/ai/prompts";
import { SqlQueryInputSchema } from "@/app/(chat)/schema";
import { executeSqlQuery } from "@/app/(chat)/actions";
import { auth } from "@/app/(auth)/auth";
import { ChatMessage, SqlQueryResult } from "@/types";

type SqlQeueryProps = {
	session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
	dataStream: UIMessageStreamWriter<ChatMessage>;
};

export const sqlQueryTool = ({ session, dataStream }: SqlQeueryProps) =>
	tool({
		description: SQL_QUERY_DESCRIPTION,
		inputSchema: SqlQueryInputSchema,
		needsApproval: true,
		execute: async (input) => {
			const organizationId = session!.user.organizationId;

			const sqlResult = await executeSqlQuery({
				organizationId,
				sqlQuery: input.sqlQuery,
			});

			const result: SqlQueryResult = {
				...sqlResult,
				visualizationType: input.visualizationType,
				chartProps: {
					title: input.title,
					description: input.description,
					footer: input.footer,
					trendText: sqlResult.metadata.trend?.text,
					trendDirection: sqlResult.metadata.trend?.direction
				},
			};

			return result;
		},
	});
