import React from "react";
import { cn } from "@/lib/utils";
import { Circle } from "./data_visualization";
import { Icons } from "@/components/ui/icons";
import { AnimatedList } from "@/components/ui/animated-list";
import {
	Database,
	CheckCircle,
	Server,
	BarChart3,
	type LucideIcon,
} from "lucide-react";

interface Notification {
	name: string;
	description: string;
	icon: LucideIcon;
	color: string;
}

const notifications: Notification[] = Array.from({ length: 10 }, () => [
	{
		name: "Query Executed",
		description: "Users table: 1,247 rows",
		icon: Database,
		color: "#00C9A7",
	},
	{
		name: "Email Sent",
		description: "5 recipients notified",
		icon: CheckCircle,
		color: "#FFB800",
	},
	{
		name: "Database Connected",
		description: "Production MySQL",
		icon: Server,
		color: "#FF3D71",
	},
	{
		name: "Report Generated",
		description: "Monthly analytics ready",
		icon: BarChart3,
		color: "#1E86FF",
	},
]).flat();

export function RealtimeUpdates() {
	return (
		<div className="mt-6 h-full w-full rounded-lg p-4 px-2 md:px-10">
			<div className="h-full w-full rounded-xl border border-gray-200 bg-white p-4">
				<div className="mb-6 flex items-center gap-2">
					<Circle variant="red" />
					<Circle variant="orange" />
					<Circle variant="green" />
				</div>
				<div className="flex h-full flex-col gap-4 md:flex-row">
					<SectionSkeleton>
						<ProfileSection />
					</SectionSkeleton>
					<SectionSkeleton className="flex-1">
						<NotificationList notifications={notifications} />
					</SectionSkeleton>
				</div>
			</div>
		</div>
	);
}

export function SectionSkeleton({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"shrink-0 rounded-xl bg-[#F9FAFB] p-6 shadow-sm transition-shadow hover:shadow-md",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function ProfileSection() {
	return (
		<div className="flex items-center gap-4">
			<div className="flex size-12 items-center justify-center rounded-full border-2 bg-white p-3">
				<Icons.user />
			</div>
			<div className="space-y-1">
				<p className="bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-xs font-semibold text-transparent md:text-lg">
					ProductionDB
				</p>
				<p className="text-[10px] font-medium tracking-wider text-gray-400 md:text-xs">
					POSTGRESQL
					<span className="font-semibold text-green-500"> • ACTIVE</span>
				</p>
			</div>
		</div>
	);
}

const Notification = ({
	name,
	description,
	icon: Icon,
	color,
}: Notification) => {
	return (
		<figure
			className={cn(
				"relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-2xl p-4",
				"transition-all duration-200 ease-in-out hover:scale-[103%]",
				"bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
				"transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]",
			)}
		>
			<div className="flex flex-row items-center gap-3">
				<div
					className="flex size-8 items-center justify-center rounded-2xl"
					style={{
						backgroundColor: color,
					}}
				>
					<Icon className="h-4 w-4 text-white" />
				</div>
				<div className="flex flex-col overflow-hidden">
					<figcaption className="flex flex-row items-center font-medium whitespace-pre dark:text-white">
						<span className="text-sm sm:text-lg">{name}</span>
					</figcaption>
					<p className="text-xs dark:text-white/60">{description}</p>
				</div>
			</div>
		</figure>
	);
};

export function NotificationList({
	className,
	notifications,
}: {
	className?: string;
	notifications: Notification[];
}) {
	return (
		<div
			className={cn(
				"relative flex w-full flex-col overflow-hidden p-2",
				className,
			)}
		>
			<AnimatedList>
				{notifications.map((item, idx) => (
					<Notification {...item} key={idx} />
				))}
			</AnimatedList>

			<div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t"></div>
		</div>
	);
}
