"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartProps } from "@/types";

type ChartRadialGridProps = ChartProps & {
	nameKey?: string;
	dataKey?: string;
	footer?: string;
	trendText?: string;
	trendDirection?: "up" | "down";
};

export function ChartRadialGrid({
	chartData,
	title,
	description,
	chartConfig,
	nameKey = "",
	dataKey = "",
	footer = "",
	trendText = "",
	trendDirection = "up",
}: ChartRadialGridProps) {
	const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;

	const coloredData = chartData.map((item, index) => ({
		...item,
		fill: `var(--chart-${(index % 5) + 1})`,
	}));

	return (
		<Card className="flex w-full max-w-md flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<RadialBarChart data={coloredData} innerRadius={30} outerRadius={100}>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel nameKey={nameKey} />}
						/>
						<PolarGrid gridType="circle" />
						<RadialBar dataKey={dataKey} />
					</RadialBarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 leading-none font-medium">
					{trendText} <TrendIcon className="h-4 w-4" />
				</div>
				<div className="text-muted-foreground leading-none">{footer}</div>
			</CardFooter>
		</Card>
	);
}
