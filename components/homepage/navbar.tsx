"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navbar() {
    return (
        <div className="w-full fixed top-2 inset-x-0 z-50 opacity-100">
            <DesktopNavbar />
        </div>
    )
}

export function DesktopNavbar() {
    const { scrollY } = useScroll()

    const navbarStyle = {
        width: useTransform(scrollY, [0, 100], ["80%", "50%"]),
        opacity: useTransform(scrollY, [0, 100], [1, 1]),
        translateY: useTransform(scrollY, [0, 100], [0, 4]),
        backgroundColor: useTransform(scrollY, [0, 100], [
            "rgba(255, 255, 255, 0.5)",
            "rgba(255, 255, 255, 0.95)"
        ]),
        backdropFilter: useTransform(scrollY, [0, 100], ["blur(5px)", "blur(10px)"]),
        boxShadow: useTransform(scrollY, [0, 100], [
            "transparent 0px 0px 0px",
            "rgba(0, 0, 0, 0.1) 0px 10px 30px -10px"
        ])
    }

    const contentStyle = {
        buttonsOpacity: useTransform(scrollY, [0, 100], [1, 0]),
        buttonsDisplay: useTransform(scrollY, [0, 100], ["flex", "none"])
    }

    //TODO: after implementing mobile navbar:  hidden lg:flex
    return (
        <motion.div
            className="flex flex-row self-center items-center justify-between py-3 mx-auto px-8 rounded-full relative z-100"
            style={navbarStyle}
        >
            <Logo />

            <div
                className="flex flex-row flex-1 items-center justify-end space-x-2 text-sm"
            >
                <div className="relative">
                    <Link className="text-black/90 relative px-3 py-1.5 transition-colors" href="/#home">
                        <span className="relative z-10">Home</span>
                    </Link>
                </div>
                <div className="relative">
                    <Link className="text-black/90 relative px-3 py-1.5 transition-colors" href="/#product">
                        <span className="relative z-10">Product</span>
                    </Link>
                </div>
            </div>

            <motion.div
                className="flex items-center gap-2 ml-6"
                style={{
                    opacity: contentStyle.buttonsOpacity,
                    display: contentStyle.buttonsDisplay
                }}
            >
                <Button variant="outline" asChild>
                    <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                    <Link href="/login?tab=sign-up">Signup</Link>
                </Button>
            </motion.div>
        </motion.div>
    )
}