import { HeroSection } from "@/components/sections/HeroSection";
import { WorkTypesSection } from "@/components/sections/WorkTypesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { PoolSection } from "@/components/sections/PoolSection";
import { TrueTodaySection } from "@/components/sections/TrueTodaySection";
import { First100Section } from "@/components/sections/First100Section";
import { PrinciplesSection } from "@/components/sections/PrinciplesSection";
import { NotSection } from "@/components/sections/NotSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { CtaCloseSection } from "@/components/sections/CtaCloseSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WorkTypesSection />
      <HowItWorksSection />
      <PoolSection />
      <TrueTodaySection />
      <First100Section />
      <PrinciplesSection />
      <NotSection />
      <FounderSection />
      <CtaCloseSection />
    </>
  );
}
