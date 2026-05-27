import type { Metadata } from 'next';

// SEO Metadata export
export async function generateMetadata(): Promise<Metadata> {
  const seoTitle = 'Ghost Work Receipt Generator | eevolvv';
  const seoDescription = 'Calculate the annual cost of ghost work for your business and discover potential savings.';
  const canonicalUrl = 'https://eevolvv.com/ghost-work-receipt'; // Public URL

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    // Add other metadata as needed
  };
}

// Default layout export
export default function GhostWorkReceiptLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
