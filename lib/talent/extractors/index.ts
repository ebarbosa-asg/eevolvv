import type { ExtractedSkills } from "./types";

export async function extractSkills(resumeText: string): Promise<ExtractedSkills> {
  if (process.env.ANTHROPIC_API_KEY) {
    const { extractWithAI } = await import("./ai");
    try {
      return await extractWithAI(resumeText);
    } catch (err) {
      console.warn("[extractor] AI extraction failed, falling back to keywords:", err);
    }
  }
  const { extractWithKeywords } = await import("./keyword");
  return extractWithKeywords(resumeText);
}

export type { ExtractedSkills };
