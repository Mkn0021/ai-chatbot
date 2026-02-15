import { tool, UIMessageStreamWriter } from "ai";
import { SQL_QUERY_DESCRIPTION } from "@/lib/ai/prompts";
import { SqlQueryInputSchema } from "@/app/(chat)/schema";
import { executeSqlQuery } from "@/app/(chat)/actions";
import { auth } from "@/app/(auth)/auth";
import { ChatMessage } from "@/types";

type SqlQeueryProps = {
	session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
	dataStream: UIMessageStreamWriter<ChatMessage>;
};

export const sqlQueryTool = ({ session, dataStream }: SqlQeueryProps) =>
	tool({
		description: SQL_QUERY_DESCRIPTION,
		inputSchema: SqlQueryInputSchema.body,
		needsApproval: true,
		execute: async ({ sqlQuery, visualizationType }) => {
			const organizationId = session!.user.organizationId;

			const sqlResult = await executeSqlQuery({
				organizationId,
				sqlQuery,
				visualizationType,
			});

			return sqlResult;
		},
	});
