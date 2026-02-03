import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobilePhone } from "@/components/ui/mobile-phone";

export const HeroSection = () => {
	return (
		<section className="relative mx-auto my-2 flex max-w-7xl flex-col items-center justify-center overflow-hidden rounded-b-3xl bg-linear-to-t from-[rgba(247,135,67,1)] via-[rgba(255,244,239,1)] to-[rgba(255,255,255,1)] px-4 pt-32 md:my-20 md:px-8">
			<div className="relative z-20 mx-auto mb-4 max-w-6xl text-center text-4xl font-semibold tracking-tight text-balance text-gray-700 md:text-7xl">
				<span className="inline-block align-top text-balance decoration-inherit">
					<HeroHeading title="Build " cta_title="Personalized AI" />
					<HeroHeading
						title="with your own "
						cta_title="Data"
						className="-mt-2"
					/>
				</span>
			</div>
			<SubHeading>
				Create AI that understands your data, your schema, and your workflows.
				<br />
				Run locally or in the cloud with full control.
			</SubHeading>
			<div className="z-10 mt-6 mb-8 flex w-full flex-col items-center justify-center gap-4 px-4 sm:mt-8 sm:mb-10 sm:flex-row sm:px-8 md:mb-20">
				<Button size="lg" asChild>
					<Link href="/login">Get Started</Link>
				</Button>
			</div>
			<div className="relative min-h-84 w-full pt-8">
				<div className="absolute top-0 right-0 left-0 z-10">
					<MobilePhone />
				</div>
			</div>
		</section>
	);
};

export const SubHeading = ({ children }: { children: React.ReactNode }) => {
	return (
		<p className="relative z-20 mx-auto mt-4 max-w-2xl transform-none px-4 text-center text-base/6 text-gray-600 opacity-100 sm:text-base">
			{children}
		</p>
	);
};

export const HeroHeading = ({
	title,
	cta_title,
	className,
	as = "h1",
}: {
	title: string;
	cta_title?: string;
	className?: string;
	as?: "h1" | "h2";
}) => {
	const Tag = as;
	const baseClass =
		"inline-block bg-linear-to-b bg-clip-text text-transparent opacity-100 py-2";
	return (
		<Tag
			className={cn(
				"from-[rgba(94,94,94,1)] to-[rgba(0,0,0,1)]",
				baseClass,
				className,
			)}
		>
			{title}
			<span
				className={cn(
					"from-[rgba(255,167,86,1)] to-[rgba(238,96,44,1)]",
					baseClass,
					className,
				)}
			>
				{cta_title}
			</span>
		</Tag>
	);
};
