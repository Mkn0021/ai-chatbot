"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from "recharts";

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

type ChartBarLabelProps = ChartProps & {
	xAxisKey: string;
	yAxisKey: string;
	footer?: string;
	trendText?: string;
	trendDirection?: "up" | "down";
};

export function ChartBarLabel({
	chartData,
	title,
	description,
	chartConfig,
	xAxisKey,
	yAxisKey,
	footer = "",
	trendText = "",
	trendDirection = "up",
}: ChartBarLabelProps) {
	const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;
	return (
		<Card className="w-full max-w-6xl">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart
						accessibilityLayer
						data={chartData}
						layout="vertical"
						margin={{
							right: 16,
						}}
					>
						<CartesianGrid horizontal={false} />
						<YAxis
							dataKey={xAxisKey}
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
							hide
						/>
						<XAxis dataKey={yAxisKey} type="number" hide />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="line" />}
						/>
						<Bar
							dataKey={yAxisKey}
							layout="vertical"
							fill="var(--chart-1)"
							radius={4}
						>
							<LabelList
								dataKey={xAxisKey}
								position="insideLeft"
								offset={8}
								className="fill-(--color-label)"
								fontSize={12}
							/>
							<LabelList
								dataKey={yAxisKey}
								position="right"
								offset={8}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 leading-none font-medium">
					{trendText} <TrendIcon className="h-4 w-4" />
				</div>
				<div className="text-muted-foreground leading-none">{footer}</div>
			</CardFooter>
		</Card>
	);
}
