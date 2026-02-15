"use client";

import type { SqlQueryResult } from "@/types";
import type { ChartConfig } from "@/components/ui/chart";
import {
	ChartAreaInteractive,
	ChartBarInteractive,
	ChartBarLabel,
	ChartLineInteractive,
	ChartPieLabel,
	ChartRadialGrid,
} from "@/components/chatpage/tools/chart";

export interface SqlQueryResultProps {
	result: SqlQueryResult;
}

const generateChartConfig = (columns: string[]): ChartConfig => {
	const config: ChartConfig = {};
	const colors = [
		"hsl(var(--chart-1))",
		"hsl(var(--chart-2))",
		"hsl(var(--chart-3))",
		"hsl(var(--chart-4))",
		"hsl(var(--chart-5))",
	];

	columns.forEach((col, index) => {
		if (
			col.toLowerCase() !== "date" &&
			col.toLowerCase() !== "month" &&
			col.toLowerCase() !== "name"
		) {
			config[col] = {
				label: col.charAt(0).toUpperCase() + col.slice(1),
				color: colors[index % colors.length],
			};
		}
	});

	return config;
};

const determineKeys = (
	data: Record<string, unknown>[],
	columns: string[],
): { xAxisKey: string; dataKeys: string[] } => {
	const xAxisCandidates = [
		"date",
		"month",
		"year",
		"name",
		"category",
		"label",
	];
	const xAxisKey =
		columns.find((col) => xAxisCandidates.includes(col.toLowerCase())) ||
		columns[0];

	const dataKeys = columns.filter(
		(col) => col !== xAxisKey && typeof data[0]?.[col] === "number",
	);

	return {
		xAxisKey,
		dataKeys: dataKeys.length > 0 ? dataKeys : [columns[1] || columns[0]],
	};
};

export function SqlQueryResult({ result }: SqlQueryResultProps) {
	const { data, visualizationType, columns, chartProps } = result;
	const chartConfig = generateChartConfig(columns);
	const { xAxisKey, dataKeys } = determineKeys(data, columns);

	// Use chartProps from result
	const title = chartProps?.title || "Query Results";
	const description = chartProps?.description || `${data.length} rows returned`;
	const footer = chartProps?.footer;
	const trendText = chartProps?.trendText;
	const trendDirection = chartProps?.trendDirection;
	const nameKey = chartProps?.nameKey || xAxisKey;
	const resultDataKeys = chartProps?.dataKeys || dataKeys;

	const baseChartProps = {
		title,
		description,
		chartData: data,
		chartConfig,
	};

	switch (visualizationType) {
		case "area_chart":
			return (
				<ChartAreaInteractive
					{...baseChartProps}
					xAxisKey={nameKey}
					dataKeys={resultDataKeys}
				/>
			);

		case "bar_chart":
			return (
				<ChartBarInteractive
					{...baseChartProps}
					xAxisKey={nameKey}
					dataKeys={resultDataKeys}
				/>
			);

		case "line_chart":
			return (
				<ChartLineInteractive
					{...baseChartProps}
					xAxisKey={nameKey}
					dataKeys={resultDataKeys}
				/>
			);

		case "pie_chart":
			return (
				<ChartPieLabel
					{...baseChartProps}
					nameKey={nameKey}
					dataKey={resultDataKeys[0]}
					footer={footer}
					trendText={trendText}
					trendDirection={trendDirection}
				/>
			);

		case "radial_chart":
			return (
				<ChartRadialGrid
					{...baseChartProps}
					nameKey={nameKey}
					dataKey={resultDataKeys[0]}
					footer={footer}
					trendText={trendText}
					trendDirection={trendDirection}
				/>
			);

		case "bar_chart_label":
			return (
				<ChartBarLabel
					{...baseChartProps}
					xAxisKey={nameKey}
					yAxisKey={resultDataKeys[0]}
					footer={footer}
					trendText={trendText}
					trendDirection={trendDirection}
				/>
			);

		default:
			return (
				<div className="rounded-md border p-4 text-sm">
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div>
			);
	}
}
