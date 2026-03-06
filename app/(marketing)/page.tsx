import { Navbar } from "@/components/homepage/navbar";
import { HeroSection } from "@/components/homepage/hero-section";
import { BrandSection } from "@/components/homepage/brand-section";
import { StatSection } from "@/components/homepage/stat-section";
import { FeatureSection } from "@/components/homepage/feature-section";
import { Footer } from "@/components/homepage/footer";

export default function Home() {
	return (
		<div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center gap-30 p-4 font-sans md:gap-40 md:px-8">
			<Navbar />
			<HeroSection />
			<BrandSection />
			<StatSection />
			<FeatureSection />
			<Footer />
		</div>
	);
}
