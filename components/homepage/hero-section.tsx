import Link from "next/link"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { MobilePhone } from "@/components/ui/mobile-phone"

export const HeroSection = () => {
    return (
        <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-20  mx-auto flex-col items-center justify-center pt-32 overflow-hidden px-4 md:px-8 bg-linear-to-t from-[rgba(247,135,67,1)]  via-[rgba(255,244,239,1)] to-[rgba(255,255,255,1)]">
            <div className="text-balance relative z-20 mx-auto mb-4 max-w-6xl text-center text-4xl font-semibold tracking-tight text-gray-700  md:text-7xl">
                <span className="inline-block align-top decoration-inherit text-balance">
                    <HeroHeading title="Build " cta_title="Personalized AI" />
                    <HeroHeading title="with your own " cta_title="Data" className="-mt-2" />
                </span>
            </div>
            <SubHeading>
                Create AI that understands your data, your schema, and your workflows.<br />
                Run locally or in the cloud with full control.
            </SubHeading>
            <div className="mb-8 mt-6 z-10 sm:mb-10 sm:mt-8 flex w-full flex-col items-center justify-center gap-4 px-4 sm:px-8 sm:flex-row md:mb-20">
                <Button size="lg" asChild>
                    <Link href="/login">Get Started</Link>
                </Button>
            </div>
            <div className="pt-8 w-full min-h-84 relative">
                <div className="absolute top-0 left-0 right-0 z-10">
                    <MobilePhone />
                </div>
            </div>
        </section>
    )
}

export const SubHeading = ({ children }: { children: React.ReactNode }) => {
    return (
        <p className="relative z-20 mx-auto mt-4 max-w-2xl px-4 text-center text-base/6 text-gray-600  sm:text-base opacity-100 transform-none">
            {children}
        </p>
    )
}

export const HeroHeading = ({ title, cta_title, className, as = "h1", }: {
    title: string;
    cta_title?: string;
    className?: string;
    as?: "h1" | "h2"
}) => {
    const Tag = as;
    const baseClass = "inline-block bg-linear-to-b bg-clip-text text-transparent opacity-100 py-2";
    return (
        <Tag className={cn("from-[rgba(94,94,94,1)] to-[rgba(0,0,0,1)]", baseClass, className)}>
            {title}
            <span className={cn("from-[rgba(255,167,86,1)] to-[rgba(238,96,44,1)]", baseClass, className)}>
                {cta_title}
            </span>
        </Tag>
    )
}