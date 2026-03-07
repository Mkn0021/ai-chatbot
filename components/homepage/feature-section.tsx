import { cn } from "@/lib/utils";
import { SeamlessIntegratiion } from "./features/seamless-integration";
import { DataVisualization } from "./features/data_visualization";
import { QueryProcessor } from "./features/query-processor";
import { RealtimeUpdates } from "./features/realtime-update";
import {
	SectionHeader,
	SectionHeaderBlock,
	SectionSubHeader,
} from "@/components/ui/section-header";

export const FeatureSection = () => {
	return (
		<section className="w-full" id="product">
			<Header />
			<div className="cols-1 mx-auto mt-20 grid max-w-3xl auto-rows-[25rem] gap-4 lg:max-w-none lg:grid-cols-5">
				<BentoCard className="lg:col-span-3">
					<BentoSkeleton>
						<SeamlessIntegratiion />
					</BentoSkeleton>
					<BentoContent>
						<BentoTitle>Universal Integrations</BentoTitle>
						<BentoSubtitle>
							Connect databases, send emails, schedule tasks, and trigger
							actions using natural language commands
						</BentoSubtitle>
					</BentoContent>
				</BentoCard>

				<BentoCard className="lg:col-span-2">
					<BentoSkeleton>
						<DataVisualization />
					</BentoSkeleton>
					<BentoContent>
						<BentoTitle>Visual Data Insights</BentoTitle>
						<BentoSubtitle>
							Transform complex queries into beautiful charts and visualizations
							for better data understanding
						</BentoSubtitle>
					</BentoContent>
				</BentoCard>

				<BentoCard className="lg:col-span-2">
					<BentoSkeleton>
						<QueryProcessor />
					</BentoSkeleton>
					<BentoContent>
						<BentoTitle>Intelligent Query Processing</BentoTitle>
						<BentoSubtitle>
							AI-powered natural language understanding that converts your
							questions into optimized database queries
						</BentoSubtitle>
					</BentoContent>
				</BentoCard>

				<BentoCard className="lg:col-span-3">
					<BentoSkeleton>
						<RealtimeUpdates />
					</BentoSkeleton>
					<BentoContent>
						<BentoTitle>Real-time Query Updates</BentoTitle>
						<BentoSubtitle>
							Live notifications and instant responses as your AI agent
							processes and analyzes your data
						</BentoSubtitle>
					</BentoContent>
				</BentoCard>
			</div>
		</section>
	);
};

export const Header = () => {
	return (
		<SectionHeaderBlock className="mb-16">
			<SectionHeader className="md:text-6xl">
				Database Intelligence
				<span className="text-[#FF7757]"> Reimagined</span>
			</SectionHeader>
			<SectionSubHeader>
				Chat naturally with your data using AI that understands your entire
				database context
			</SectionSubHeader>
		</SectionHeaderBlock>
	);
};

const BentoCard = ({
	children,
	className,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div
			className={cn(
				"group relative isolate flex flex-col justify-between overflow-hidden rounded-2xl bg-[#F9FAFB]!",
				"shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]",
				className,
			)}
		>
			<div className="absolute inset-x-0 bottom-0 z-10 h-[40%] bg-linear-to-t from-white via-white to-transparent" />
			{children}
		</div>
	);
};

const BentoSkeleton = ({ children }: { children?: React.ReactNode }) => (
	<div className="absolute inset-0 h-full w-full overflow-hidden transition-opacity duration-300">
		{children}
	</div>
);

const BentoContent = ({ children }: { children: React.ReactNode }) => (
	<div className="absolute bottom-0 z-10 p-6">{children}</div>
);

const BentoTitle = ({ children }: { children: React.ReactNode }) => (
	<h3 className="font-rubik inline-block text-[22px] leading-7.75 font-medium text-black">
		{children}
	</h3>
);

const BentoSubtitle = ({ children }: { children: React.ReactNode }) => (
	<p className="mt-2 max-w-sm font-sans text-sm font-normal tracking-tight text-neutral-400">
		{children}
	</p>
);
