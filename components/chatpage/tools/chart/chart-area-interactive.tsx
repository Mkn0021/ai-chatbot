"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ChartProps } from "@/types";

type ChartAreaInteractiveProps = ChartProps & {
	xAxisKey?: string;
	dataKeys: string[];
	timeRangeOptions?: Array<{ value: string; label: string; days: number }>;
};

export function ChartAreaInteractive({
	chartData,
	title,
	description,
	chartConfig,
	xAxisKey = "date",
	dataKeys,
	timeRangeOptions = [
		{ value: "90d", label: "Last 3 months", days: 90 },
		{ value: "30d", label: "Last 30 days", days: 30 },
		{ value: "7d", label: "Last 7 days", days: 7 },
		{ value: "all", label: "All time", days: -1 },
	],
}: ChartAreaInteractiveProps) {
	const [timeRange, setTimeRange] = React.useState(
		timeRangeOptions[0]?.value || "90d",
	);

	const filteredData = React.useMemo(() => {
		if (!chartData || chartData.length === 0) return [];

		const selectedRange = timeRangeOptions.find(
			(opt) => opt.value === timeRange,
		);
		if (!selectedRange || selectedRange.days === -1) return chartData;

		const dates = chartData.map((item) => new Date(item[xAxisKey]));
		const referenceDate = new Date(Math.max(...dates.map((d) => d.getTime())));

		const startDate = new Date(referenceDate);
		startDate.setDate(startDate.getDate() - selectedRange.days);

		return chartData.filter((item) => {
			const date = new Date(item[xAxisKey]);
			return date >= startDate;
		});
	}, [chartData, timeRange, xAxisKey, timeRangeOptions]);

	return (
		<Card className="w-full max-w-6xl">
			<CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
				<div className="grid flex-1 gap-1">
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</div>
				<Select value={timeRange} onValueChange={setTimeRange}>
					<SelectTrigger
						className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
						aria-label="Select a value"
					>
						<SelectValue
							placeholder={timeRangeOptions[0]?.label || "Select range"}
						/>
					</SelectTrigger>
					<SelectContent className="rounded-xl">
						{timeRangeOptions.map((option) => (
							<SelectItem
								key={option.value}
								value={option.value}
								className="rounded-lg"
							>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<AreaChart data={filteredData}>
						<defs>
							{dataKeys.map((key, index) => {
								const colorIndex = (index % 5) + 1;
								return (
									<linearGradient
										key={key}
										id={`fill${key}`}
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="5%"
											stopColor={`var(--chart-${colorIndex})`}
											stopOpacity={0.8}
										/>
										<stop
											offset="95%"
											stopColor={`var(--chart-${colorIndex})`}
											stopOpacity={0.1}
										/>
									</linearGradient>
								);
							})}
						</defs>
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
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										});
									}}
									indicator="dot"
								/>
							}
						/>
						{dataKeys.map((key, index) => {
							const colorIndex = (index % 5) + 1;
							return (
								<Area
									key={key}
									dataKey={key}
									type="natural"
									fill={`url(#fill${key})`}
									stroke={`var(--chart-${colorIndex})`}
									stackId="a"
								/>
							);
						})}
						<ChartLegend content={<ChartLegendContent />} />
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
