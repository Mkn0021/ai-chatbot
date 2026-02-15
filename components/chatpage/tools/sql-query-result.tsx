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
	const { data, visualizationType, columns } = result;
	const chartConfig = generateChartConfig(columns);
	const { xAxisKey, dataKeys } = determineKeys(data, columns);

	const chartProps = {
		title: "Query Results",
		description: `${data.length} rows returned`,
		chartData: data,
		chartConfig,
	};

	switch (visualizationType) {
		case "area_chart":
			return (
				<ChartAreaInteractive
					{...chartProps}
					xAxisKey={xAxisKey}
					dataKeys={dataKeys}
				/>
			);

		case "bar_chart":
			return (
				<ChartBarInteractive
					{...chartProps}
					xAxisKey={xAxisKey}
					dataKeys={dataKeys}
				/>
			);

		case "line_chart":
			return (
				<ChartLineInteractive
					{...chartProps}
					xAxisKey={xAxisKey}
					dataKeys={dataKeys}
				/>
			);

		case "pie_chart":
			return (
				<ChartPieLabel
					{...chartProps}
					nameKey={xAxisKey}
					dataKey={dataKeys[0]}
				/>
			);

		case "radial_chart":
			return (
				<ChartRadialGrid
					{...chartProps}
					nameKey={xAxisKey}
					dataKey={dataKeys[0]}
				/>
			);

		case "bar_chart_label":
			return (
				<ChartBarLabel
					{...chartProps}
					xAxisKey={xAxisKey}
					yAxisKey={dataKeys[0]}
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
