"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartProps } from "@/types";

type ChartLineInteractiveProps = ChartProps & {
	xAxisKey?: string;
	dataKeys: string[];
};

export function ChartLineInteractive({
	chartData,
	title,
	description,
	chartConfig,
	xAxisKey = "date",
	dataKeys,
}: ChartLineInteractiveProps) {
	const [activeChart, setActiveChart] = React.useState<string>(dataKeys[0]);

	const total = React.useMemo(() => {
		const totals: Record<string, number> = {};
		dataKeys.forEach((key) => {
			totals[key] = chartData.reduce((acc, curr) => acc + (curr[key] || 0), 0);
		});
		return totals;
	}, [chartData, dataKeys]);

	return (
		<Card className="w-full max-w-6xl">
			<CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<div className="flex">
					{dataKeys.map((key) => {
						const chart = key;
						return (
							<button
								key={chart}
								data-active={activeChart === chart}
								className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
								onClick={() => setActiveChart(chart)}
							>
								<span className="text-muted-foreground text-xs">
									{chartConfig[chart]?.label || chart}
								</span>
								<span className="text-lg leading-none font-bold sm:text-3xl">
									{(total[key] || 0).toLocaleString()}
								</span>
							</button>
						);
					})}
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
							top: 16,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey={xAxisKey}
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								});
							}}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									nameKey="views"
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										});
									}}
								/>
							}
						/>
						<Line
							dataKey={activeChart}
							type="monotone"
							stroke={`var(--chart-${(dataKeys.indexOf(activeChart) % 5) + 1})`}
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
