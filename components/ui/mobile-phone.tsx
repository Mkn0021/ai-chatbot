import React from "react";
import { cn } from "@/lib/utils";

export const MobilePhone = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div className="relative mx-auto h-150 w-75 md:h-170 md:w-85">
			<div className="absolute inset-0 rounded-[50px] border-14 border-black bg-neutral-100 shadow-xl">
				<PunchHoleCamera />
				{children}
			</div>
			<SideButton className="top-42.5 -right-0.5" />
			<SideButton className="top-30 -left-0.5" />
			<SideButton className="top-42.5 -left-0.5" />
		</div>
	);
};

const SideButton = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn("absolute h-12 w-0.75 rounded-l-lg bg-black", className)}
		/>
	);
};

const PunchHoleCamera = () => {
	return (
		<div className="absolute top-2 left-1/2 z-10 h-[1.8rem] w-24 -translate-x-1/2 rounded-full bg-black">
			<div
				className={cn(
					"absolute top-1/2 right-3 h-[0.6rem] w-[0.6rem] -translate-y-1/2 rounded-full",
					"bg-[#0f0f0f] shadow-[inset_0_0_0_1.5px_#1a1a1a,inset_0_0_0_3px_#0f0f0f] ring-[1.5px] ring-[#2a2a2a]",
				)}
			/>
		</div>
	);
};
