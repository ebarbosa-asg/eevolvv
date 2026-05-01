import { HeroSection } from "@/components/talent/sections/HeroSection";
import { WorkTypesSection } from "@/components/talent/sections/WorkTypesSection";
import { HowItWorksSection } from "@/components/talent/sections/HowItWorksSection";
import { PoolSection } from "@/components/talent/sections/PoolSection";
import { TrueTodaySection } from "@/components/talent/sections/TrueTodaySection";
import { First100Section } from "@/components/talent/sections/First100Section";
import { PrinciplesSection } from "@/components/talent/sections/PrinciplesSection";
import { NotSection } from "@/components/talent/sections/NotSection";
import { CtaCloseSection } from "@/components/talent/sections/CtaCloseSection";

/** Human talent network (eevolvv/talent). New talent-focused hero / graphics belong in this app.
 *  Main marketing site §05 is **Agents** (`app/page.tsx` → `AgentsSection`, `#agents`) — not Talent. */

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
      <CtaCloseSection />
    </>
  );
}
