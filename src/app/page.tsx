import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedSection from "@/components/FeaturedSection";
import SplitShowcase from "@/components/SplitShowcase";
import CultureSection from "@/components/CultureSection";
import StatsBar from "@/components/StatsBar";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedSection />
      <SplitShowcase />
      <StatsBar />
      <CultureSection />
      <CTASection />
    </>
  );
}
