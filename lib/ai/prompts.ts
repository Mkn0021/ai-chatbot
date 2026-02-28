import { getLocalStorageItem } from "../utils";
import type { DatabaseTable } from "@/app/(organization)/schema";
import { getDatabaseConnection } from "@/app/(organization)/actions";

export const SQL_QUERY_DESCRIPTION =
	"Execute SQL queries against a connected database and create visualizations. Choose from: 'none' (no visualization), 'area_chart' (time-series with multiple metrics), 'bar_chart' (comparing multiple categories/metrics), 'line_chart' (trends over time), 'pie_chart' (part-to-whole relationships), 'radial_chart' (circular comparison), 'bar_chart_label' (simple category-value pairs with labels). Provide title, optional description, and optional footer (only for pie_chart, radial_chart, bar_chart_label). Trends are automatically calculated.";

export const LOCAL_MODEL_SYSTEM_PROMPT =
	"You're a friendly AI assistant that helps users query and visualize their database. IMPORTANT: You MUST use the sqlQueryTool to answer user queries. Do not attempt to provide answers without using the tool.\n\n" +
	"Tool: sqlQueryTool - ALWAYS use this tool to execute SQL queries and create visualizations.\n" +
	"Required parameters:\n" +
	"- sqlQuery: The SQL query to execute\n" +
	"- visualizationType: Choose from none, area_chart, bar_chart, line_chart, pie_chart, radial_chart, bar_chart_label\n" +
	"- title: Chart title (required)\n" +
	"- description: Chart description (optional)\n" +
	"- footer: Footer text (optional, only for pie_chart, radial_chart, bar_chart_label)\n\n" +
	"Workflow:\n" +
	"1. Understand the user's request\n" +
	"2. Call sqlQueryTool with ALL required parameters in a SINGLE call\n" +
	"3. Present the results to the user\n\n" +
	"Remember: ALWAYS use the tool. Use visualizationType='none' if no chart is needed. Trends are calculated automatically.";

export const GENERAL_SYSTEM_PROMPT =
	"You're a friendly AI assistant that helps users query and visualize their database. Use the sqlQueryTool to execute SQL queries and create visualizations.\n\n" +
	"When calling sqlQueryTool, provide:\n" +
	"- sqlQuery: SQL query to execute\n" +
	"- visualizationType: none, area_chart, bar_chart, line_chart, pie_chart, radial_chart, or bar_chart_label\n" +
	"- title: Chart title\n" +
	"- description: Optional chart description\n" +
	"- footer: Optional footer (only for pie_chart, radial_chart, bar_chart_label)\n\n" +
	"Choose visualization types based on data structure and user needs. Trends are automatically calculated.";

export function getDatabaseContext(tables: DatabaseTable[]): string {
	if (
		tables.length === 0 ||
		tables.every((table) => table.columns.length === 0)
	) {
		return "";
	}

	const schemaDescription = tables
		.map((table) => {
			const columns = table.columns
				.map((col) => `${col.column_name}: ${col.data_type}`)
				.join(", ");
			return `${table.table_schema}.${table.table_name} (${columns})`;
		})
		.join("\n");

	return `\n\nAvailable tables:\n${schemaDescription}`;
}

export function getSystemPrompt({
	modelId,
	databaseContext,
}: {
	modelId: string;
	databaseContext: string | null;
}): string {
	const [provider] = modelId.split("/");
	const isLocalModel = provider === "ollama";

	const basePrompt = isLocalModel
		? LOCAL_MODEL_SYSTEM_PROMPT
		: GENERAL_SYSTEM_PROMPT;

	return `${basePrompt}${databaseContext || ""}`;
}

export const TITLE_PROMPT = `Generate a short chat title (2-5 words) summarizing the user's database query or request.

Output ONLY the title text. No prefixes, no formatting.

Examples:
- "show me total sales by region" → Sales by Region
- "get all customers from last month" → Recent Customers
- "what's the average order value" → Average Order Value
- "hi" → New Conversation
- "show me a bar chart of revenue" → Revenue Analysis

Bad outputs (never do this):
- "# Sales Report" (no hashtags)
- "Title: Revenue" (no prefixes)
- ""Sales Data"" (no quotes)
- "Query: Sales by Region" (no labels)`;
