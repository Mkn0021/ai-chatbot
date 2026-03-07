import { cn } from "@/lib/utils";
import {
	SectionHeader,
	SectionHeaderBlock,
	SectionSubHeader,
} from "@/components/ui/section-header";

export const StatSection = () => {
	return (
		<section className="relative w-full">
			<Header />
			<div className="relative z-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardTitle>5x</CardTitle>
					<CardSubtitle>Faster insights vs manual queries</CardSubtitle>
				</Card>
				<Card>
					<CardTitle>100%</CardTitle>
					<CardSubtitle>Works locally & securely</CardSubtitle>
				</Card>
				<Card>
					<CardTitle>10+</CardTitle>
					<CardSubtitle>Databases supported</CardSubtitle>
				</Card>
				<Card>
					<CardTitle>&lt;50ms</CardTitle>
					<CardSubtitle>Average AI response time</CardSubtitle>
				</Card>
			</div>
		</section>
	);
};

const Header = () => {
	return (
		<SectionHeaderBlock>
			<SectionHeader>
				Connect your
				<span className="text-[oklch(0.65_0.25_30)]"> data </span>
				with AI seamlessly
			</SectionHeader>
			<SectionSubHeader className="mx-4">
				Run AI models locally or in the cloud, get actionable insights, and
				automate tasks across your databases instantly.
			</SectionSubHeader>
		</SectionHeaderBlock>
	);
};

const Card = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="bg-background/50 relative overflow-hidden rounded-xl border border-gray-200 p-6 backdrop-blur-sm transition-discrete hover:shadow-xl">
			<GridBackground />
			<div className="relative z-10">{children}</div>
		</div>
	);
};

const CardTitle = ({ children }: { children: React.ReactNode }) => (
	<h3 className="mb-2 text-4xl font-bold">{children}</h3>
);

const CardSubtitle = ({ children }: { children: React.ReactNode }) => (
	<p className="text-muted-foreground">{children}</p>
);

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
