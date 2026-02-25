import { Icons } from "@/components/ui/icons";

const AI_BRANDS = [
	Icons.gemini,
	Icons.chatgpt,
	Icons.claude,
	Icons.huggingface,
];

export const BrandSection = () => {
	return (
		<section className="w-full overflow-hidden px-4 py-12 md:my-20 md:px-8 md:py-4">
			<div className="mb-6 text-center">
				<h2 className="font-inter text-xl font-semibold text-[#3D3D3D] sm:text-[22px]">
					Connect with Your Favorite AI Model
				</h2>
			</div>

			<div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-6 px-6 sm:grid-cols-4 md:grid-cols-4 md:gap-10">
				{AI_BRANDS.map((Brand, idx) => (
					<div
						key={idx}
						className="mx-auto flex aspect-3/1 w-full max-w-32 items-center justify-center"
					>
						<Brand className="h-auto w-full object-contain" />
					</div>
				))}
			</div>
		</section>
	);
};
