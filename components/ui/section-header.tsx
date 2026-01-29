import { cn } from "@/lib/utils";

export const SectionHeaderBlock = ({ className, children }: {
    children: React.ReactNode
    className?: string
}) => {
    return (
        <div className={cn("text-center mb-12", className)}>
            {children}
        </div>
    )
}

export const SectionHeader = ({ children, className, as = "h2" }: {
    children: React.ReactNode
    className?: string
    as?: "h1" | "h2" | "h3"
}) => {
    const Tag = as;
    return (
        <Tag className={cn("text-4xl font-bold mb-4", className)}>
            {children}
        </Tag>
    )
}

export const SectionSubHeader = ({ children, className }: {
    children: React.ReactNode
    className?: string
}) => {
    return (
        <p className={cn("text-muted-foreground", className)}>
            {children}
        </p>
    )
}