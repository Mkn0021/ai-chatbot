import { cn } from "@/lib/utils";
import {
	SectionHeader,
	SectionHeaderBlock,
	SectionSubHeader,
} from "@/components/ui/section-header";

export const StatSection = () => {
	return (
		<section className="relative w-full py-20">
			<Header />
			<div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-4">
				<Card title={"5x"} subtitle={"Faster insights vs manual queries"} />
				<Card title={"100%"} subtitle={"Works locally & securely"} />
				<Card title={"10+"} subtitle={"Databases supported"} />
				<Card title={"<50ms"} subtitle={"Average AI response time"} />
			</div>
		</section>
	);
};

const Header = () => {
	return (
		<SectionHeaderBlock>
			<SectionHeader>
				{"Connect your "}
				<span className="text-[oklch(0.65_0.25_30)]">data</span>
				{" with AI seamlessly"}
			</SectionHeader>
			<SectionSubHeader className="mx-4">
				{
					"Run AI models locally or in the cloud, get actionable insights, and automate tasks across your databases instantly."
				}
			</SectionSubHeader>
		</SectionHeaderBlock>
	);
};

const Card = ({ title, subtitle }: { title: string; subtitle: string }) => {
	return (
		<div className="bg-background/50 relative overflow-hidden rounded-xl border border-gray-200 p-6 backdrop-blur-sm transition-discrete hover:shadow-xl">
			<GridBackground />
			<div className="relative z-10">
				<h3 className="mb-2 text-4xl font-bold">{title}</h3>
				<p className="text-muted-foreground">{subtitle}</p>
			</div>
		</div>
	);
};

export function GridBackground() {
	return (
		<div
			className={cn(
				"absolute inset-0",
				"bg-size-[20px_20px]",
				"bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
				"dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
				"mask-radial-[at_center_center,white,transparent_80%]",
			)}
		/>
	);
}
