'use server';

import { generateAIGraphicsLayouts } from '@/ai/gemini-service';

export interface GenerateDesignLayoutInput {
  prompt: string;
}

export async function generateDesignLayout(input: GenerateDesignLayoutInput) {
  return generateAIGraphicsLayouts({ prompt: input.prompt });
}
