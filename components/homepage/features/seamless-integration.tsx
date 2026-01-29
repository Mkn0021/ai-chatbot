"use client"

import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeamMultipleOutput } from "./beam-multiple-output";

export function SeamlessIntegratiion() {
    return (
        <DotBackground>
            <AnimatedBeamMultipleOutput className="transform -translate-y-10" />
        </DotBackground>
    )
}

export function DotBackground({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="relative flex h-full w-full items-center justify-center bg-white dark:bg-black">
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-size-[20px_20px]",
                    "bg-[radial-gradient(#d4d4d4_1px,transparent_1px)]",
                    "dark:bg-[radial-gradient(#404040_1px,transparent_1px)]",
                    "mask-l-from-90% mask-t-from-90%"
                )}
            />
            {children}
        </div>
    );
}

