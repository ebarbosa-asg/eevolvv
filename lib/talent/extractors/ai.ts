// AI extractor — dormant until ANTHROPIC_API_KEY is set in .env.local
import Anthropic from "@anthropic-ai/sdk";
import type { ExtractedSkills } from "./types";
import { SKILLS } from "@/data/talent/skills";

export async function extractWithAI(resumeText: string): Promise<ExtractedSkills> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `You are a skill extraction engine. Given a resume or background description, extract skills.

Available skills list:
${SKILLS.join(", ")}

Resume text:
${resumeText.slice(0, 4000)}

Return a JSON object with exactly this shape:
{
  "confirmed": ["skill1", "skill2"],
  "suggested": ["skill3", "skill4"]
}

Only use skills from the available list. Return valid JSON only.`;

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const parsed = JSON.parse(content.text);
  return {
    confirmed: parsed.confirmed ?? [],
    suggested: (parsed.suggested ?? []).slice(0, 6),
    raw: resumeText,
  };
}
