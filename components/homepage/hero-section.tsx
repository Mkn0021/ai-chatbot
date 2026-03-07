import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MobilePhone } from "@/components/ui/mobile-phone";

export const HeroSection = () => {
	return (
		<section className="relative flex w-full flex-col items-center justify-center pt-32 md:pt-52">
			<div className="absolute inset-y-0 left-1/2 -z-10 w-screen max-w-[76rem] -translate-x-1/2 rounded-b-3xl bg-linear-to-t from-[rgba(247,135,67,1)] via-[rgba(255,244,239,1)] to-white" />
			<h1 className="relative z-20 mx-auto mb-4 max-w-6xl text-center text-4xl font-semibold tracking-tight text-balance text-gray-700 md:text-7xl">
				<span className="inline-block align-top leading-[0.5] text-balance decoration-inherit md:leading-[0.8]">
					<Heading>
						Build <HeadingAccent>Personalized AI</HeadingAccent>
					</Heading>
					<Heading>
						with Your Own <HeadingAccent>Data</HeadingAccent>
					</Heading>
				</span>
			</h1>
			<SubHeading>
				Create AI that understands your data, your schema, and your workflows.
				<br />
				Run locally or in the cloud with full control.
			</SubHeading>
			<Button
				size="lg"
				asChild
				className="z-10 mt-6 mb-8 flex w-full flex-col items-center justify-center gap-4 px-4 py-6 sm:mt-8 sm:mb-10 sm:w-auto sm:flex-row sm:px-8 md:mb-20"
			>
				<Link href="/login">Get Started</Link>
			</Button>
			<div className="relative min-h-84 w-full overflow-hidden pt-8">
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

const Heading = ({
	children,
	as = "h1",
	className,
}: {
	children: React.ReactNode;
	as?: "h1" | "h2" | "span";
	className?: string;
}) => {
	const Tag = as;
	return (
		<Tag
			className={cn(
				"inline-block bg-linear-to-b bg-clip-text py-2 text-transparent opacity-100",
				"from-[rgba(94,94,94,1)] to-[rgba(0,0,0,1)]",
				className,
			)}
		>
			{children}
		</Tag>
	);
};

const HeadingAccent = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<Heading
		as="span"
		className={cn(
			"from-[rgba(255,167,86,1)] to-[rgba(238,96,44,1)]",
			className,
		)}
	>
		{children}
	</Heading>
);
