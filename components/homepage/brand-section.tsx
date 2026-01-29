import { Icons } from "@/components/ui/icons"

const AI_BRANDS = [
    Icons.gemini,
    Icons.chatgpt,
    Icons.claude,
    Icons.huggingface,
]

export const BrandSection = () => {
    return (
        <section className="w-full py-12 md:py-4 overflow-hidden">
            <div className="text-center mb-6">
                <h2 className="text-[#3D3D3D] font-inter text-[22px] font-semibold">
                    Connect with Your Favorite AI Model
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-3xl mx-auto px-6">
                {AI_BRANDS.map((Logo, idx) => (
                    <div key={idx} className="flex items-center justify-center w-full aspect-3/1 max-w-32 mx-auto">
                        <Logo className="w-full h-auto object-contain" />
                    </div>
                ))}
            </div>
        </section>
    )
}