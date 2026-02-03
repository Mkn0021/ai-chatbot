import { Navbar } from "@/components/homepage/navbar";
import { HeroSection } from "@/components/homepage/hero-section";
import { BrandSection } from "@/components/homepage/brand-section";
import { StatSection } from "@/components/homepage/stat-section";
import { FeatureSection } from "@/components/homepage/feature-section";
import { Footer } from "@/components/homepage/footer";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 font-sans">
			<Navbar />
			<HeroSection />
			<BrandSection />
			<StatSection />
			<FeatureSection />
			<Footer />
		</div>
	);
}
