import React from "react"
import { cn } from "@/lib/utils"

export const MobilePhone = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="relative mx-auto h-150 w-75 md:h-170 md:w-85">
            <div className="absolute inset-0 rounded-[50px] border-14 border-black bg-neutral-100 shadow-xl">
                <PunchHoleCamera />
                {children}
            </div>
            <SideButton className="-right-0.5 top-42.5" />
            <SideButton className="-left-0.5 top-30" />
            <SideButton className="-left-0.5 top-42.5" />
        </div>
    )
}

const SideButton = ({ className }: {
    className?: string
}) => {
    return (
        <div className={cn("absolute h-12 w-0.75 rounded-l-lg bg-black", className)} />
    )
}

const PunchHoleCamera = () => {
    return (
        <div className="absolute left-1/2 top-2 h-[1.8rem] w-24 -translate-x-1/2 rounded-full bg-black z-10">
            <div className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 w-[0.6rem] h-[0.6rem] rounded-full",
                "bg-[#0f0f0f] ring-[1.5px] ring-[#2a2a2a] shadow-[inset_0_0_0_1.5px_#1a1a1a,inset_0_0_0_3px_#0f0f0f]"
            )} />
        </div>
    )
}