export const SKILLS = [
  // ─── Technology ──────────────────────────────────────────────────────────
  "Python", "TypeScript", "JavaScript", "React", "Next.js", "Node.js",
  "SQL", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST APIs",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD",
  "DevSecOps", "Linux / Unix", "Embedded Systems", "C / C++", "Rust",
  "Go", "Java", "Swift", "Kotlin",
  "AI / ML", "Computer Vision", "Fine-tuning / RLHF", "RAG Systems",
  "Multi-Agent Systems", "MLOps", "Data Visualization",

  // ─── Trades & Physical ────────────────────────────────────────────────────
  "Plumbing", "Electrical", "HVAC", "Carpentry", "Masonry", "Welding",
  "Painting", "Landscaping", "General Contracting", "Roofing",
  "Flooring", "Concrete", "Steel Fabrication",

  // ─── Healthcare & Life Sciences ───────────────────────────────────────────
  "Nursing", "Medical Coding", "Clinical Research", "Healthcare Consulting",
  "Physical Therapy", "Pharmacy", "Medical Writing", "Public Health",
  "Biotech Research", "Lab Operations",

  // ─── Education & Coaching ─────────────────────────────────────────────────
  "Tutoring", "Curriculum Design", "Corporate Training", "Coaching",
  "Instructional Design", "Language Instruction", "Academic Research",

  // ─── Creative & Media ─────────────────────────────────────────────────────
  "UX / UI Design", "Graphic Design", "Video Production", "Photography",
  "Illustration", "Animation", "Music Production", "Voiceover",
  "Copywriting", "Content Writing", "Editing / Proofreading",
  "Social Media Strategy", "Communications Strategy",

  // ─── Food & Hospitality ───────────────────────────────────────────────────
  "Catering", "Event Planning", "Bartending", "Private Chef",
  "Menu Development", "Food Safety",

  // ─── Legal & Compliance ───────────────────────────────────────────────────
  "Contract Law", "Contract Review", "Regulatory Analysis",
  "Paralegal Support", "Compliance Auditing", "Grant Writing",
  "Business Formation", "IP / Trademark",

  // ─── Finance & Accounting ─────────────────────────────────────────────────
  "Bookkeeping", "Tax Preparation", "Financial Modeling", "Audit Support",
  "CFO Advisory", "Grants Management", "Procurement", "Cost Estimating",

  // ─── Business & Operations ────────────────────────────────────────────────
  "Project Management", "Program Management", "Process Improvement",
  "Recruiting", "Executive Assistance", "Research", "Transcription",
  "Risk Assessment", "Strategic Planning",

  // ─── AI & Automation ─────────────────────────────────────────────────────
  "Workflow Automation", "AI Agent Design", "Prompt Engineering",
  "CRM Automation", "Make / Zapier / n8n", "WhatsApp Automation",
  "Data Pipeline Automation", "Process Mapping", "SOP Writing",
  "Fractional COO", "Business Diagnostics",

  // ─── Marketing & Growth ───────────────────────────────────────────────────
  "SEO / Content", "Paid Ads", "Email Marketing",
  "Social Media Strategy", "Brand Strategy", "Lead Generation",
  "CRM Strategy", "Customer Retention",

  // ─── Transportation & Logistics ───────────────────────────────────────────
  "Freight Coordination", "Fleet Management", "Route Planning",
  "Import / Export", "Supply Chain",
] as const;

export type Skill = typeof SKILLS[number];
