import React from "react";
import { cn } from "@/lib/utils";
import { Circle } from "./data_visualization";
import { Icons } from "@/components/ui/icons";
import { AnimatedList } from "@/components/ui/animated-list"
import { Database, CheckCircle, Server, BarChart3, type LucideIcon } from "lucide-react"

interface Notification {
    name: string
    description: string
    icon: LucideIcon
    color: string
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
]).flat()

export function RealtimeUpdates() {
    return (
        <div className="w-full h-full p-4 rounded-lg px-2 md:px-10 mt-6">
            <div className="w-full h-full p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2 mb-6">
                    <Circle variant="red" />
                    <Circle variant="orange" />
                    <Circle variant="green" />
                </div>
                <div className="flex flex-col md:flex-row h-full gap-4">
                    <SectionSkeleton>
                        <ProfileSection />
                    </SectionSkeleton>
                    <SectionSkeleton className="flex-1">
                        <NotificationList notifications={notifications} />
                    </SectionSkeleton>
                </div>
            </div>
        </div>
    )
}

export function SectionSkeleton({ children, className }: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("shrink-0 bg-[#F9FAFB] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow", className)}>
            {children}
        </div>
    )
}

export function ProfileSection() {
    return (
        <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full border-2 bg-white p-3">
                <Icons.user />
            </div>
            <div className="space-y-1">
                <p className="text-xs md:text-lg font-semibold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    ProductionDB
                </p>
                <p className="text-[10px] md:text-xs font-medium text-gray-400 tracking-wider">
                    POSTGRESQL<span className="text-green-500 font-semibold"> • ACTIVE</span>
                </p>
            </div>
        </div>
    )
}

const Notification = ({ name, description, icon: Icon, color }: Notification) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-2xl p-4",
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div
                    className="flex size-8 items-center justify-center rounded-2xl"
                    style={{
                        backgroundColor: color,
                    }}
                >
                    <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center font-medium whitespace-pre dark:text-white">
                        <span className="text-sm sm:text-lg">{name}</span>
                    </figcaption>
                    <p className="text-xs dark:text-white/60">
                        {description}
                    </p>
                </div>
            </div>
        </figure>
    )
}

export function NotificationList({
    className,
    notifications,
}: {
    className?: string
    notifications: Notification[]
}) {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col overflow-hidden p-2",
                className
            )}
        >
            <AnimatedList>
                {notifications.map((item, idx) => (
                    <Notification {...item} key={idx} />
                ))}
            </AnimatedList>

            <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t"></div>
        </div>
    )
}