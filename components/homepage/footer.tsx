import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Heart } from "lucide-react";

export const Footer = () => {
	return (
		<footer className="m-10 mx-auto w-full max-w-7xl rounded-xl bg-gray-50 px-8 pt-20 pb-8">
			<div className="flex flex-col justify-between gap-12 md:flex-row">
				<div className="flex flex-col items-start">
					<Logo className="p-0" />
					<h2 className="mt-8 max-w-md text-2xl font-medium">
						Connect any database. Use any AI model. Get insights in seconds.
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-8 justify-self-end md:grid-cols-4">
					<FooterColumn
						title="Product"
						items={[
							"Database Setup",
							"AI Models",
							"Query Chat",
							"Visualize",
							"Security",
							"API",
						]}
					/>
					<FooterColumn
						title="Resources"
						items={[
							"Docs",
							"Tutorials",
							"Community",
							"Blog",
							"Support",
							"Status",
						]}
					/>
					<FooterColumn
						title="Company"
						items={[
							"About",
							"Careers",
							"Contact",
							"Privacy",
							"Terms",
							"Partners",
						]}
					/>
				</div>
			</div>
		</footer>
	);
};

const FooterColumn = ({ title, items }: { title: string; items: string[] }) => {
	return (
		<div className="space-y-6">
			<h3 className="font-semibold">{title}</h3>
			<ul className="grid grid-cols-2 justify-evenly gap-2 sm:space-y-1 md:grid-cols-1">
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
