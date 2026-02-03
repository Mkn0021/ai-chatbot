import { cn } from "@/lib/utils";

export const SectionHeaderBlock = ({
	className,
	children,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return <div className={cn("mb-12 text-center", className)}>{children}</div>;
};

export const SectionHeader = ({
	children,
	className,
	as = "h2",
}: {
	children: React.ReactNode;
	className?: string;
	as?: "h1" | "h2" | "h3";
}) => {
	const Tag = as;
	return (
		<Tag className={cn("mb-4 text-4xl font-bold", className)}>{children}</Tag>
	);
};

export const SectionSubHeader = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return <p className={cn("text-muted-foreground", className)}>{children}</p>;
};
