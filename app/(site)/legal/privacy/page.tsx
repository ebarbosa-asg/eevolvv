/**
 * DRAFT for E's review. Not legal advice.
 * NEXT_PUBLIC_LEGAL_ENTITY, NEXT_PUBLIC_LEGAL_STATE, and NEXT_PUBLIC_LEGAL_ADDRESS
 * stay TODO until a real company is on record. Do not invent an entity type, a state, or an address.
 */
import type { Metadata } from "next";
import { contactEmail, legalAddress, legalEntity, legalParty, legalState, pageMeta } from "@/lib/seo";

const entity = legalEntity();
const state = legalState();

export const metadata: Metadata = pageMeta({
  title: "Privacy",
  description: entity
    ? `Privacy policy for ${entity}${state ? `, organized in ${state}` : ""}, offering short-form clipping and distribution under the service name eevolvv.`
    : "Privacy policy for eevolvv, a short-form clipping and distribution service.",
  path: "/legal/privacy",
});

function sentence(party: string) {
  return party.charAt(0).toUpperCase() + party.slice(1);
}

export default function PrivacyPage() {
  const email = contactEmail();
  const party = legalParty();
  const organized = legalState();
  const address = legalAddress();
  return (
    <section className="page-hero">
      <div className="wrap prose">
        <p className="eyebrow">Legal</p>
        <h1>Privacy</h1>
        <p>
          This page describes the marketing site at eevolvv.com and the clipping work that starts from it. eevolvv is the service name. The offer is made by {party}.
          {organized ? ` ${sentence(party)} is organized in ${organized}.` : null}
          {address ? ` Mailing address: ${address}.` : null}
        </p>

        <h2>What we collect</h2>
        <p>
          If you request a sample cut, we collect the name, email, and episode URL you submit. If you book a call, the scheduler (when connected) collects what you enter there under its own policy. If you become a client, we process the recordings and the account access you give us so we can edit and post.
        </p>
        <p>
          If analytics is enabled, we collect standard site measurements such as pages viewed. We do not sell personal information. We do not buy views or audience data.
        </p>

        <h2>Your content</h2>
        <p>
          You keep the rights in your recordings and accounts. You grant us a license to edit and post, described on the terms page. We use that material to do the work, not to claim it as ours.
        </p>

        <h2>How we use it</h2>
        <p>
          To reply about a fit call or a sample, to edit and post clips you approve, to operate the site, and to meet legal duties. We keep sample requests only as long as needed for that conversation. Client files stay for the engagement and for any records the law requires.
        </p>

        <h2>Who else sees it</h2>
        <p>
          Email about a sample request goes to {email}. When email delivery is configured, a mail provider sends that message. When you pay through a Stripe Payment Link, Stripe processes the payment under its own policy. We do not sell your information.
        </p>

        <h2>Contact</h2>
        <p>
          Questions: <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </div>
    </section>
  );
}
