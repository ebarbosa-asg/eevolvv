export const SKILLS_BY_DOMAIN: Record<string, string[]> = {
  "AI & Automation": [
    "Workflow Automation", "AI Agent Design", "Prompt Engineering",
    "CRM Automation", "Make / Zapier / n8n", "WhatsApp Automation",
    "Data Pipeline", "RAG Systems", "Multi-Agent Systems",
  ],
  "Operations & Process": [
    "Process Mapping", "SOP Writing", "Project Management",
    "Fractional COO", "Business Diagnostics", "Lean / Six Sigma",
    "Supply Chain", "Inventory Management", "Quality Assurance",
  ],
  "Technology": [
    "Python", "TypeScript", "React", "Next.js", "Node.js",
    "AWS", "Supabase", "AI / ML", "RAG Systems", "REST APIs",
  ],
  "Finance & Accounting": [
    "Bookkeeping", "Tax Preparation", "Financial Modeling",
    "CFO Advisory", "Audit Support", "Cash Flow Management",
  ],
  "Marketing & Growth": [
    "SEO / Content", "Paid Ads", "Email Marketing",
    "Social Media Strategy", "Copywriting", "Brand Strategy",
    "CRM Strategy", "Lead Generation",
  ],
  "Creative & Media": [
    "UX / UI Design", "Graphic Design", "Video Production",
    "Photography", "Illustration", "Animation", "Copywriting",
  ],
  "Legal & Compliance": [
    "Contract Review", "Regulatory Analysis", "Paralegal Support",
    "Compliance Auditing", "Business Formation", "IP / Trademark",
  ],
  "Trades & Construction": [
    "Welding", "Plumbing", "Electrical", "HVAC", "Carpentry",
    "Masonry", "Steel Fabrication", "Concrete", "Roofing",
  ],
};

export const DOMAINS = Object.keys(SKILLS_BY_DOMAIN);

export type Domain = (typeof DOMAINS)[number];
