import { SKILLS } from "@/data/talent/skills";
import type { ExtractedSkills } from "./types";

const ADJACENCY: Record<string, string[]> = {
  "React": ["TypeScript", "Next.js", "UX / UI Design"],
  "Python": ["AI / ML", "Data Visualization", "MLOps"],
  "Nursing": ["Medical Coding", "Healthcare Consulting", "Medical Writing"],
  "Carpentry": ["General Contracting", "Flooring", "Painting"],
  "Contract Law": ["Contract Review", "Regulatory Analysis", "Compliance Auditing"],
  "Financial Modeling": ["CFO Advisory", "Audit Support", "Cost Estimating"],
  "Video Production": ["Photography", "Animation", "Copywriting"],
  "Project Management": ["Program Management", "Risk Assessment", "Strategic Planning"],
  "Federal Proposal Writing": ["ACAT Program Support", "Cost Estimating", "DCAA Compliance"],
};

export function extractWithKeywords(text: string): ExtractedSkills {
  const lower = text.toLowerCase();
  const confirmed: string[] = [];
  const suggestedSet = new Set<string>();

  for (const skill of SKILLS) {
    if (lower.includes(skill.toLowerCase())) {
      confirmed.push(skill);
      const adjacent = ADJACENCY[skill] ?? [];
      for (const adj of adjacent) {
        if (!confirmed.includes(adj)) {
          suggestedSet.add(adj);
        }
      }
    }
  }

  const suggested = Array.from(suggestedSet).filter((s) => !confirmed.includes(s));
  return { confirmed, suggested: suggested.slice(0, 6), raw: text };
}
