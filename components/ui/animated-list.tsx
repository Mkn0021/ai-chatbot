"use client"

import React, {
    useEffect,
    useMemo,
    useState,
} from "react"
import { AnimatePresence, motion, MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
    const animations: MotionProps = {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1, originY: 0 },
        exit: { scale: 0, opacity: 0 },
        transition: { type: "spring", stiffness: 350, damping: 40 },
    }

    return (
        <motion.div {...animations} layout className="mx-auto w-full">
            {children}
        </motion.div>
    )
}

export interface AnimatedListProps {
    children: React.ReactNode
    delay?: number
    className?: string
}

export const AnimatedList = React.memo(
    ({ children, className, delay = 1000 }: AnimatedListProps) => {
        const [index, setIndex] = useState(0)
        const [isInView, setIsInView] = useState(false)

        const childrenArray = useMemo(
            () => React.Children.toArray(children),
            [children]
        )

        useEffect(() => {
            if (isInView && index < childrenArray.length - 1) {
                const timeout = setTimeout(() => {
                    setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length)
                }, delay)

                return () => clearTimeout(timeout)
            }
        }, [index, delay, childrenArray.length, isInView])

        const itemsToShow = useMemo(() => {
            const result = childrenArray.slice(0, index + 1).reverse()
            return result
        }, [index, childrenArray])

        return (
            <motion.div
                className={cn(`flex flex-col items-center gap-4`, className)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                onViewportEnter={() => setIsInView(true)}
                viewport={{ once: true, margin: "-100px" }}
            >
                <AnimatePresence>
                    {itemsToShow.map((item) => (
                        <AnimatedListItem key={(item as React.ReactElement).key}>
                            {item}
                        </AnimatedListItem>
                    ))}
                </AnimatePresence>
            </motion.div>
        )
    }
)

AnimatedList.displayName = "AnimatedList"