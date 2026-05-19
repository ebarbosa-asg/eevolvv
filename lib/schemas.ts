export function serviceSchema(opts: {
  name: string
  description: string
  providerName: string
  areaServed: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    provider: {
      '@type': 'LocalBusiness',
      name: opts.providerName,
    },
    areaServed: {
      '@type': 'City',
      name: opts.areaServed,
    },
  }
}

export function faqSchema(questions: { name: string; text: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.name,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.text,
      },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://eevolvv.com${item.url}`,
    })),
  }
}