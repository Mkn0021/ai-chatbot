"use client";

import React, { forwardRef, useRef, useMemo } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import {
	CalenderIcon,
	ChatgptIcon,
	EmailIcon,
	MongodbIcon,
	NotionIcon,
	PostgresqlIcon,
	UserIcon,
} from "@/components/ui/icons";

const Circle = forwardRef<
	HTMLDivElement,
	{ className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				"z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
				className,
			)}
		>
			{children}
		</div>
	);
});

Circle.displayName = "Circle";

// Integrations config
const INTEGRATIONS = [
	{ icon: PostgresqlIcon, label: "PostgreSQL" },
	{ icon: MongodbIcon, label: "MongoDB" },
	{ icon: EmailIcon, label: "Email" },
	{ icon: CalenderIcon, label: "Google Calendar" },
	{ icon: NotionIcon, label: "Notion" },
];

export function AnimatedBeamMultipleOutput({
	className,
}: {
	className?: string;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const userRef = useRef<HTMLDivElement>(null);
	const aiRef = useRef<HTMLDivElement>(null);

	// Create array of refs using useMemo
	const integrationRefs = useMemo(
		() => INTEGRATIONS.map(() => React.createRef<HTMLDivElement>()),
		[],
	);

	return (
		<div
			className={cn(
				"relative flex h-125 w-full items-center justify-center overflow-hidden p-10",
				className,
			)}
			ref={containerRef}
		>
			<div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
				<div className="flex flex-col justify-center">
					<Circle ref={userRef}>
						<UserIcon />
					</Circle>
				</div>
				<div className="flex flex-col items-center justify-center">
					<Circle ref={aiRef} className="size-16">
						<ChatgptIcon />
					</Circle>
				</div>
				<div className="flex flex-col justify-center gap-2">
					{INTEGRATIONS.map((integration, index) => {
						return (
							<Circle key={integration.label} ref={integrationRefs[index]}>
								<integration.icon />
							</Circle>
						);
					})}
				</div>
			</div>

			{/* AnimatedBeams from integrations to AI */}
			{integrationRefs.map((ref, index) => (
				<AnimatedBeam
					key={`integration-to-ai-${index}`}
					containerRef={containerRef}
					fromRef={ref}
					toRef={aiRef}
					duration={3}
				/>
			))}

			{/* AnimatedBeam from AI to User */}
			<AnimatedBeam
				containerRef={containerRef}
				fromRef={aiRef}
				toRef={userRef}
				duration={3}
			/>
		</div>
	);
}
