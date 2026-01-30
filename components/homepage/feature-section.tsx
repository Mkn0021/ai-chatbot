import { cn } from "@/lib/utils"
import { SeamlessIntegratiion } from "./features/seamless-integration"
import { DataVisualization } from "./features/data_visualization"
import { QueryProcessor } from "./features/query-processor"
import { RealtimeUpdates } from "./features/realtime-update"

export const FeatureSection = () => {
    return (
        <section className="w-full max-w-7xl mx-auto py-4 px-4 md:px-8 md:my-20 md:py-20" id="product">
            <Header />
            <div className="mt-20 grid cols-1 lg:grid-cols-5 gap-4 auto-rows-[25rem] max-w-3xl mx-auto lg:max-w-none">
                <BentoCard col="3"
                    title="Universal Integrations"
                    subtitle="Connect databases, send emails, schedule tasks, and trigger actions using natural language commands"
                >
                    <SeamlessIntegratiion />
                </BentoCard>
                <BentoCard
                    title="Visual Data Insights"
                    subtitle="Transform complex queries into beautiful charts and visualizations for better data understanding"
                >
                    <DataVisualization />
                </BentoCard>
                <BentoCard
                    title="Intelligent Query Processing"
                    subtitle="AI-powered natural language understanding that converts your questions into optimized database queries"
                >
                    <QueryProcessor />
                </BentoCard>
                <BentoCard col="3"
                    title="Real-time Query Updates"
                    subtitle="Live notifications and instant responses as your AI agent processes and analyzes your data"
                >
                    <RealtimeUpdates />
                </BentoCard>
            </div>
        </section>
    )
}

export const Header = () => {
    return (
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
                Database Intelligence
                <span className="text-[#FF7757]"> Reimagined</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
                Chat naturally with your data using AI that understands your entire database context
            </p>
        </div>
    )
}

export const BentoCard = ({ children, col = "2", title, subtitle }: {
    title: string,
    subtitle: string,
    col?: "2" | "3"
    children?: React.ReactNode
}) => {
    return (
        <div className={cn("group isolate rounded-2xl bg-[#F9FAFB]! overflow-hidden flex relative flex-col justify-between",
            "shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]",
            col === "2" ? "lg:col-span-2" : "lg:col-span-3"
        )}>
            <div className="absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-300">
                {children}
            </div>
            <div className="absolute z-10 inset-x-0 bottom-0 h-[40%] bg-linear-to-t from-white via-white to-transparent" />
            <div className="p-6 absolute z-10 bottom-0">
                <h3 className="inline-block text-[22px] font-medium leading-7.75 font-rubik text-black">
                    {title}
                </h3>
                <p className="font-sans max-w-sm text-sm font-normal tracking-tight mt-2 text-neutral-400">
                    {subtitle}
                </p>
            </div>
        </div>
    )
}