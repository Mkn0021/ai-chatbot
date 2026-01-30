import { Navbar } from "@/components/homepage/navbar";
import { HeroSection } from "@/components/homepage/hero-section";
import { BrandSection } from "@/components/homepage/brand-section";
import { StatSection } from "@/components/homepage/stat-section";
import { FeatureSection } from "@/components/homepage/feature-section";
import { Footer } from "@/components/homepage/footer";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center font-sans">
      <Navbar />
      <HeroSection />
      <BrandSection />
      <StatSection />
      <FeatureSection />
      <Footer />
    </div>
  );
}
