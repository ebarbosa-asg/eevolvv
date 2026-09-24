import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Case studies",
  description: "Case studies are coming soon. eevolvv will not publish invented logos, testimonials, or view counts.",
  path: "/case-studies",
});

const slots = [
  { title: "Business podcast", note: "Metric placeholders only after real delivery." },
  { title: "SaaS founder", note: "No fake pipeline or vanity charts." },
  { title: "Coach / course", note: "Screenshots go here only with permission." },
];

export default function CaseStudiesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Case studies</span>
          </nav>
          <p className="eyebrow">Proof · in progress</p>
          <h1>Case studies</h1>
          <p className="lead">
            We will not invent logos, testimonials, or view counts. These frames stay empty until real client results exist.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap soon-grid">
          {slots.map((slot) => (
            <article className="soon" key={slot.title}>
              <p className="todo">Coming soon</p>
              <div>
                <h2 style={{ fontSize: 28, letterSpacing: "-0.03em" }}>{slot.title}</h2>
                <p className="muted">{slot.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
