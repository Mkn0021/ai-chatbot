import { cn } from "@/lib/utils";
import { SeamlessIntegratiion } from "./features/seamless-integration";
import { DataVisualization } from "./features/data_visualization";
import { QueryProcessor } from "./features/query-processor";
import { RealtimeUpdates } from "./features/realtime-update";

export const FeatureSection = () => {
	return (
		<section
			className="mx-auto w-full max-w-7xl px-4 py-4 md:my-20 md:px-8 md:py-20"
			id="product"
		>
			<Header />
			<div className="cols-1 mx-auto mt-20 grid max-w-3xl auto-rows-[25rem] gap-4 lg:max-w-none lg:grid-cols-5">
				<BentoCard
					col="3"
					title="Universal Integrations"
					subtitle="Connect databases, send emails, schedule tasks, and trigger actions using natural language commands"
				>
					<SeamlessIntegratiion />
				</BentoCard>
				<BentoCard
					title="Visual Data Insights"
					subtitle="Transform complex queries into beautiful charts and visualizations for better data understanding"
				>
					<DataVisualization />
				</BentoCard>
				<BentoCard
					title="Intelligent Query Processing"
					subtitle="AI-powered natural language understanding that converts your questions into optimized database queries"
				>
					<QueryProcessor />
				</BentoCard>
				<BentoCard
					col="3"
					title="Real-time Query Updates"
					subtitle="Live notifications and instant responses as your AI agent processes and analyzes your data"
				>
					<RealtimeUpdates />
				</BentoCard>
			</div>
		</section>
	);
};

export const Header = () => {
	return (
		<div className="mb-16 text-center">
			<h2 className="mb-4 text-4xl font-bold md:text-6xl">
				Database Intelligence
				<span className="text-[#FF7757]"> Reimagined</span>
			</h2>
			<p className="mx-auto max-w-2xl text-gray-500">
				Chat naturally with your data using AI that understands your entire
				database context
			</p>
		</div>
	);
};

export const BentoCard = ({
	children,
	col = "2",
	title,
	subtitle,
}: {
	title: string;
	subtitle: string;
	col?: "2" | "3";
	children?: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"group relative isolate flex flex-col justify-between overflow-hidden rounded-2xl bg-[#F9FAFB]!",
				"shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]",
				col === "2" ? "lg:col-span-2" : "lg:col-span-3",
			)}
		>
			<div className="absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-300">
				{children}
			</div>
			<div className="absolute inset-x-0 bottom-0 z-10 h-[40%] bg-linear-to-t from-white via-white to-transparent" />
			<div className="absolute bottom-0 z-10 p-6">
				<h3 className="font-rubik inline-block text-[22px] leading-7.75 font-medium text-black">
					{title}
				</h3>
				<p className="mt-2 max-w-sm font-sans text-sm font-normal tracking-tight text-neutral-400">
					{subtitle}
				</p>
			</div>
		</div>
	);
};
