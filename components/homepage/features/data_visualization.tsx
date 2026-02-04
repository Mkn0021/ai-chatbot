import React from "react";
import { cn } from "@/lib/utils";

export function DataVisualization() {
	return (
		<Terminal>
			<Graph />
			<NameIndicator
				name="Users Table"
				position="top-10 -left-10"
				variant="bottom"
			/>
			<NameIndicator name="Orders Table" position="top-0 -right-20" />
			<div className="absolute -right-10 -bottom-4 -left-10 flex items-center justify-between gap-4 rounded-full border border-neutral-200 bg-white p-1">
				<div />
				<button className="cursor-pointer rounded-[37px] bg-[linear-gradient(181deg,#5E5E5E_18.12%,#000_99.57%)] px-6 py-2 text-right text-white shadow-[0px_1px_1px_2px_rgba(255,255,255,0.40)_inset,0px_-1px_5px_2px_rgba(255,255,255,0.40)_inset,0px_10px_20px_0px_rgba(0,0,0,0.10),0px_3px_6px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(3,7,18,0.06),0px_2px_4px_0px_rgba(3,7,18,0.06),0px_0px_0px_1px_rgba(3,7,18,0.08)]">
					Export
				</button>
			</div>
		</Terminal>
	);
}

export function NameIndicator({
	position,
	name,
	variant = "top",
}: {
	name: string;
	position: string;
	variant?: "top" | "bottom";
}) {
	return (
		<div className={cn("absolute transform-none opacity-100", position)}>
			<div className="flex items-center gap-2">
				<div className="flex cursor-none items-center gap-2 rounded-lg border border-white/40 bg-[#103685] px-4 py-1.5 text-sm text-white mix-blend-luminosity shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] backdrop-blur-[6px] transition-opacity hover:opacity-90">
					{name}
					<ArrowIcon
						className={cn(
							variant == "top"
								? "-top-4 -left-4 scale-x-[-1]"
								: "-top-4 -right-4",
						)}
					/>
				</div>
			</div>
		</div>
	);
}

export function ArrowIcon({ className }: { className?: React.ReactNode }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="21"
			viewBox="0 0 22 21"
			fill="none"
			className={cn("absolute", className)}
		>
			<path
				d="M16.9492 2.29758C17.135 2.22487 17.3235 2.15109 17.4831 2.10476C17.6345 2.06081 17.9271 1.98678 18.246 2.08721C18.6115 2.20235 18.904 2.4788 19.0396 2.83725C19.1578 3.14991 19.1004 3.44625 19.0651 3.59991C19.0278 3.76189 19.9648 3.95425 18.9027 4.14384L14.5057 17.5726C14.4285 17.8084 14.3545 18.0346 14.2801 18.2093C14.2172 18.3569 14.0739 18.68 13.7478 18.8696C13.3912 19.0769 12.9553 19.0949 12.5828 18.9178C12.2421 18.7558 12.0726 18.4456 11.9977 18.3037C11.9091 18.1357 11.8167 17.9164 11.7203 17.6878L9.41629 12.2247L3.83184 10.2325C3.59818 10.1491 3.37405 10.0692 3.20135 9.99022C3.05543 9.9235 2.73621 9.77174 2.55526 9.44076C2.3574 9.07885 2.35082 8.64263 2.53766 8.27491C2.70853 7.93862 3.02303 7.77729 3.16687 7.7062C3.33713 7.62204 3.55874 7.53539 3.78982 7.44503L16.9492 2.29758Z"
				fill="#121212"
				stroke="#F8F8F8"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			></path>
		</svg>
	);
}

export function Graph() {
	return (
		<div className="absolute top-0 right-0 bottom-16 left-0 flex h-47.5 items-end justify-between gap-4">
			<GraphBar className="h-[30%]" />
			<GraphBar className="h-[70%]" />
			<GraphBar className="h-[40%]" />
			<GraphBar className="h-[80%]" />
			<GraphBar className="h-[50%]" />
			<GraphBar className="h-full" variant="primary" />
		</div>
	);
}

export function GraphBar({
	className,
	variant = "secondary",
}: {
	className?: string;
	variant?: "primary" | "secondary";
}) {
	return (
		<div
			className={cn(
				"relative w-full cursor-pointer rounded-t-[15px] transition-opacity hover:opacity-80",
				className,
				variant == "primary"
					? "bg-[linear-gradient(180deg,var(--color-chart-1)_0%,#FFF_100%),linear-gradient(90deg,#D9D9D9_0%,#737373_100%)]"
					: "bg-[linear-gradient(180deg,#BFBFBF_0%,#FFF_100%),linear-gradient(90deg,#D9D9D9_0%,#737373_100%)]",
			)}
		/>
	);
}

export function Terminal({ children }: { children: React.ReactNode }) {
	return (
		<div className="m-4 mx-auto w-full max-w-72.5 rounded-[18px_18px_0px_0px] border border-[#E1E1E1] bg-white p-2 shadow-[0px_37px_10px_0px_rgba(0,0,0,0.00),0px_24px_10px_0px_rgba(0,0,0,0.01),0px_13px_8px_0px_rgba(0,0,0,0.02),0px_6px_6px_0px_rgba(0,0,0,0.03),0px_1px_3px_0px_rgba(0,0,0,0.04)]">
			<div className="mb-8 flex gap-2">
				<Circle variant="red" />
				<Circle variant="orange" />
				<Circle variant="green" />
			</div>
			<div className="relative mx-auto h-50 w-65">{children}</div>
		</div>
	);
}

export function Circle({ variant }: { variant: "red" | "green" | "orange" }) {
	return (
		<div
			className={cn(
				"size-3 cursor-pointer rounded-full hover:opacity-80",
				variant == "red" && "bg-[#FF5F57]",
				variant == "orange" && "bg-[#FEBC2E]",
				variant == "green" && "bg-[#28C840]",
			)}
		></div>
	);
}
