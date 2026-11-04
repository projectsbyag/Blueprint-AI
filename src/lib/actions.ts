'use server';

import { generateAIGraphicsLayouts, type GeneratedLayoutResult } from '@/ai/gemini-service';
import { GoogleGenAI } from '@google/genai';

export interface GenerateDesignLayoutInput {
  prompt: string;
  style?: string;
  category?: string;
  format?: 'infographic' | 'poster' | 'diagram' | 'carousel' | 'auto';
}

export interface GenerateDesignLayoutOutput {
  layouts: GeneratedLayoutResult[];
}

export async function generateBlueprintLayout(input: GenerateDesignLayoutInput): Promise<GenerateDesignLayoutOutput> {
  try {
    if (!input.prompt || !input.prompt.trim()) {
      throw new Error('Please enter a description or prompt for your design.');
    }
    const result = await generateAIGraphicsLayouts({
      prompt: input.prompt.trim(),
      style: input.style,
      category: input.category,
      format: input.format,
    });
    if (!result || !result.layouts || result.layouts.length === 0) {
      throw new Error('AI could not generate layouts. Please try another prompt.');
    }
    return result;
  } catch (error) {
    console.error('Error generating blueprint layout:', error);
    if (error instanceof Error) {
      throw new Error(`Design Generation: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while generating the design.');
  }
}

export async function generateAICopyAlternative(currentText: string, goal: string = 'more catchy'): Promise<string[]> {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return [
        `Unlock ${currentText}`,
        `The Ultimate ${currentText}`,
        `Redefining ${currentText}`,
      ];
    }
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide 4 short, punchy, high-converting alternative copy options for this graphic design text:
Current: "${currentText}"
Goal: "${goal}"
Keep each under 8 words. Return ONLY the 4 options separated by newlines, no numbers, no quotes.`,
    });
    const lines = (res.text || '')
      .split('\n')
      .map((l) => l.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(Boolean);
    return lines.slice(0, 4);
  } catch (err) {
    console.warn('AI Copy failed:', err);
    return [
      `Elevate ${currentText}`,
      `Discover ${currentText}`,
      `Next-Gen ${currentText}`,
    ];
  }
}
