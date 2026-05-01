import { SiteFooter } from "@/components/talent/SiteFooter";
import { SiteHeader } from "@/components/talent/SiteHeader";

export function LegalShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
