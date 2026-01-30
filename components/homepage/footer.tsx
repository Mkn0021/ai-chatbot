import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Heart } from "lucide-react"

export const Footer = () => {
    return (
        <footer className="w-full max-w-7xl rounded-xl m-10 bg-gray-50 mx-auto px-8 pt-20 pb-8">
            <div className="flex flex-col md:flex-row justify-between gap-12">
                <div className="flex items-start flex-col">
                    <Logo />
                    <h2 className="text-2xl font-medium mt-8 max-w-md">
                        Transform education with AI. Automate academic workflows intelligently.
                    </h2>
                </div>
                <div className="grid justify-self-end grid-cols-1 md:grid-cols-4 gap-8">
                    <FooterColumn
                        title="Platform"
                        items={["Features", "Pricing", "API Docs", "Status"]}
                    />
                    <FooterColumn
                        title="University"
                        items={["For Teachers", "For Students", "For Admins", "Case Studies"]}
                    />
                    <FooterColumn
                        title="Company"
                        items={["About", "Blog", "Careers", "Contact"]}
                    />
                </div>
            </div>
            <MadeWithLove />
        </footer>
    )
}

const FooterColumn = ({ title, items }: {
    title: string
    items: string[]
}) => {
    return (
        <div className="space-y-6">
            <h3 className="font-semibold">{title}</h3>
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li key={index} className="text-muted-foreground hover:text-foreground cursor-pointer">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}

const MadeWithLove = () => {
    return (
        <div className="w-full flex items-center justify-center gap-2 text-sm mx-auto pt-20">
            <span>Made with</span>
            <Heart className="size-4 text-primary fill-current" />
            <span>by</span>
            <Link
                href="https://github.com/MKN0021"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 font-medium hover:text-black"
            >
                @Mkn0021
            </Link>
        </div>
    )
}