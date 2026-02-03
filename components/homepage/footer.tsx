import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Heart } from "lucide-react";

export const Footer = () => {
	return (
		<footer className="m-10 mx-auto w-full max-w-7xl rounded-xl bg-gray-50 px-8 pt-20 pb-8">
			<div className="flex flex-col justify-between gap-12 md:flex-row">
				<div className="flex flex-col items-start">
					<Logo />
					<h2 className="mt-8 max-w-md text-2xl font-medium">
						Transform education with AI. Automate academic workflows
						intelligently.
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-8 justify-self-end md:grid-cols-4">
					<FooterColumn
						title="Platform"
						items={["Features", "Pricing", "API Docs", "Status"]}
					/>
					<FooterColumn
						title="University"
						items={[
							"For Teachers",
							"For Students",
							"For Admins",
							"Case Studies",
						]}
					/>
					<FooterColumn
						title="Company"
						items={["About", "Blog", "Careers", "Contact"]}
					/>
				</div>
			</div>
			<MadeWithLove />
		</footer>
	);
};

const FooterColumn = ({ title, items }: { title: string; items: string[] }) => {
	return (
		<div className="space-y-6">
			<h3 className="font-semibold">{title}</h3>
			<ul className="space-y-3">
				{items.map((item, index) => (
					<li
						key={index}
						className="text-muted-foreground hover:text-foreground cursor-pointer"
					>
						{item}
					</li>
				))}
			</ul>
		</div>
	);
};

const MadeWithLove = () => {
	return (
		<div className="mx-auto flex w-full items-center justify-center gap-2 pt-20 text-sm">
			<span>Made with</span>
			<Heart className="text-primary size-4 fill-current" />
			<span>by</span>
			<Link
				href="https://github.com/MKN0021"
				target="_blank"
				rel="noopener noreferrer"
				className="font-medium text-neutral-700 hover:text-black"
			>
				@Mkn0021
			</Link>
		</div>
	);
};
