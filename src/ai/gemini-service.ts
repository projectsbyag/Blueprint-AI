import { GoogleGenAI, Type } from '@google/genai';

const getAiClient = (customApiKey?: string) => {
  // Trim and validate customApiKey to prevent passing whitespace or empty strings
  const cleanCustomKey = customApiKey?.trim() ? customApiKey.trim() : undefined;
  const apiKey = cleanCustomKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey || !apiKey.trim()) return null;
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

export interface GenerateDesignLayoutOptions {
  prompt: string;
  style?: string;
  category?: string;
  format?: 'infographic' | 'poster' | 'diagram' | 'carousel' | 'auto';
  apiKey?: string;
  model?: string;
  mcpContext?: string;
  generateImagesWithNanoBanana?: boolean;
}

export interface GeneratedLayoutResult {
  description: string;
  canvasBackgroundColor: string;
  elements: Array<{
    type: 'text' | 'image' | 'shape';
    position: { x: number; y: number };
    size: { width: number; height: number };
    content?: string;
    source?: string;
    style?: Record<string, any>;
  }>;
  pages?: Array<{
    id?: string;
    title?: string;
    canvasBackgroundColor?: string;
    elements: Array<{
      type: 'text' | 'image' | 'shape';
      position: { x: number; y: number };
      size: { width: number; height: number };
      content?: string;
      source?: string;
      style?: Record<string, any>;
    }>;
  }>;
  activePageIndex?: number;
}

// Curated stock photo mappings by topic for high quality visuals
const CURATED_IMAGE_TOPICS: Record<string, string[]> = {
  python: [
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80',
  ],
  code: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
  ],
  cloud: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80',
  ],
  coffee: [
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
  ],
  bakery: [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
  ],
  tech: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
  ],
  nature: [
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1000&q=80',
  ],
  music: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
  ],
  business: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
  ],
};

function getMatchingCuratedImage(prompt: string, index: number = 0): string {
  const lower = prompt.toLowerCase();
  for (const [key, urls] of Object.entries(CURATED_IMAGE_TOPICS)) {
    if (lower.includes(key)) {
      return urls[index % urls.length];
    }
  }
  return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80';
}

/**
 * Generates an actual AI image using Nano Banana (gemini-3.1-flash-lite-image)
 * and returns a base64 data URL that can be placed directly onto the Canvas!
 */
export async function generateNanoBananaImage(
  imagePrompt: string,
  customApiKey?: string
): Promise<string | null> {
  const ai = getAiClient(customApiKey);
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: `Create a clean, high-resolution, modern graphic illustration or visual asset for: "${imagePrompt}". Minimalist, vibrant, professional aesthetic suitable for a design studio canvas.`,
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (err) {
    console.warn('Nano Banana image generation fell back to stock photo:', err);
    return null;
  }
}

/**
 * Visual Palette helper based on user's selected style
 */
function getThemePalette(style: string = 'Modern Professional') {
  const s = style.toLowerCase();
  if (s.includes('cyberpunk') || s.includes('neon')) {
    return {
      canvasBg: '#090A10',
      cardBg: '#121324',
      textPrimary: '#FFFFFF',
      textSecondary: '#94A3B8',
      accents: ['#F43F5E', '#06B6D4', '#A855F7', '#10B981', '#F59E0B'],
    };
  }
  if (s.includes('warm') || s.includes('editorial')) {
    return {
      canvasBg: '#FAF8F5',
      cardBg: '#FFFFFF',
      textPrimary: '#1C1917',
      textSecondary: '#57534E',
      accents: ['#EA580C', '#D97706', '#059669', '#2563EB', '#7C3AED'],
    };
  }
  if (s.includes('clean') || s.includes('minimal')) {
    return {
      canvasBg: '#F8FAFC',
      cardBg: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      accents: ['#2563EB', '#0D9488', '#4F46E5', '#E11D48', '#D97706'],
    };
  }
  if (s.includes('luxury') || s.includes('dark')) {
    return {
      canvasBg: '#090D16',
      cardBg: '#111827',
      textPrimary: '#F9FAFB',
      textSecondary: '#9CA3AF',
      accents: ['#F59E0B', '#EAB308', '#38BDF8', '#A855F7', '#10B981'],
    };
  }
  // Default Modern Professional (Dark Slate)
  return {
    canvasBg: '#0B0F19',
    cardBg: '#1E293B',
    textPrimary: '#FFFFFF',
    textSecondary: '#CBD5E1',
    accents: ['#38BDF8', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
  };
}

/**
 * Compiler that turns bespoke AI semantic content into pixel-perfect 1000x1000 canvas elements
 * for ANY topic (e.g. "Python Setup Guide", "Rust Ownership Rules", "Matcha Cafe Launch").
 */
interface BespokeStructuredPlan {
  mainTitle: string;
  subtitle: string;
  badgeText: string;
  footerNote: string;
  ctaText: string;
  steps: Array<{
    stepNumber: string;
    heading: string;
    details: string;
  }>;
  carouselSlides?: Array<{
    slideBadge: string;
    slideTitle: string;
    slideSubtitle: string;
    bulletPoints: string[];
  }>;
}

function compileBespokePlanToLayouts(
  plan: BespokeStructuredPlan,
  prompt: string,
  style: string,
  format: string,
  generatedImageUrl: string | null
): GeneratedLayoutResult[] {
  const palette = getThemePalette(style);
  const p = prompt.toLowerCase();

  const isCarousel =
    format === 'carousel' ||
    p.includes('carousel') ||
    p.includes('slide') ||
    p.includes('deck') ||
    p.includes('linkedin');

  const isPoster =
    format === 'poster' ||
    p.includes('poster') ||
    p.includes('flyer') ||
    p.includes('promo') ||
    p.includes('event') ||
    p.includes('launch');

  const visualImg = generatedImageUrl || getMatchingCuratedImage(prompt, 0);
  const steps = plan.steps && plan.steps.length > 0 ? plan.steps.slice(0, 5) : [
    { stepNumber: '01', heading: `Step 1: ${plan.mainTitle}`, details: plan.subtitle },
    { stepNumber: '02', heading: 'Core Configuration', details: 'Configure essential parameters and environment.' },
    { stepNumber: '03', heading: 'Verification & Testing', details: 'Run diagnostics to verify setup.' },
    { stepNumber: '04', heading: 'Production Ready', details: 'Deploy and monitor your workflow.' },
  ];

  // 1. IF CAROUSEL MODE: Build a genuine multi-slide carousel specifically for this topic!
  if (isCarousel) {
    const slidesData = plan.carouselSlides && plan.carouselSlides.length >= 3
      ? plan.carouselSlides
      : [
          {
            slideBadge: `SLIDE 1 OF ${steps.length + 1} • OVERVIEW`,
            slideTitle: plan.mainTitle.toUpperCase(),
            slideSubtitle: plan.subtitle,
            bulletPoints: steps.map((s) => `${s.stepNumber}. ${s.heading}`),
          },
          ...steps.map((s, idx) => ({
            slideBadge: `SLIDE ${idx + 2} OF ${steps.length + 1} • STEP ${s.stepNumber}`,
            slideTitle: s.heading.toUpperCase(),
            slideSubtitle: s.details,
            bulletPoints: s.details.split(/[•.\n]/).map((b) => b.trim()).filter(Boolean),
          })),
        ];

    const pages = slidesData.map((slide, sIdx) => {
      const accent = palette.accents[sIdx % palette.accents.length];
      const slideElements: any[] = [
        {
          type: 'shape',
          position: { x: 50, y: 50 },
          size: { width: 900, height: 900 },
          style: { backgroundColor: palette.cardBg, borderRadius: '24px', borderWidth: '2px', borderStyle: 'solid', borderColor: accent, zIndex: 1 },
        },
        {
          type: 'shape',
          position: { x: 90, y: 90 },
          size: { width: 280, height: 42 },
          style: { backgroundColor: accent, borderRadius: '9999px', zIndex: 2 },
        },
        {
          type: 'text',
          position: { x: 90, y: 99 },
          size: { width: 280, height: 30 },
          content: slide.slideBadge || `SLIDE ${sIdx + 1}`,
          style: { color: '#FFFFFF', fontSize: '13px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1.5px', zIndex: 3 },
        },
        {
          type: 'text',
          position: { x: 90, y: 170 },
          size: { width: 820, height: 130 },
          content: slide.slideTitle,
          style: { color: palette.textPrimary, fontSize: '46px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.1', zIndex: 3 },
        },
        {
          type: 'text',
          position: { x: 90, y: 315 },
          size: { width: 820, height: 90 },
          content: slide.slideSubtitle,
          style: { color: palette.textSecondary, fontSize: '20px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
        },
        {
          type: 'shape',
          position: { x: 90, y: 430 },
          size: { width: 820, height: 380 },
          style: { backgroundColor: palette.canvasBg, borderRadius: '20px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(148,163,184,0.2)', zIndex: 2 },
        },
        {
          type: 'text',
          position: { x: 130, y: 465 },
          size: { width: 740, height: 310 },
          content: (slide.bulletPoints || []).map((b) => `• ${b}`).join('\n\n'),
          style: { color: palette.textPrimary, fontSize: '19px', lineHeight: '1.7', fontFamily: 'Inter, sans-serif', zIndex: 3 },
        },
        {
          type: 'text',
          position: { x: 90, y: 860 },
          size: { width: 820, height: 35 },
          content: plan.footerNote || `${plan.mainTitle} • Swipe for more →`,
          style: { color: accent, fontSize: '15px', fontWeight: '700', textAlign: 'right', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
        },
      ];

      return {
        id: `slide_${sIdx + 1}`,
        title: `Slide ${sIdx + 1}: ${slide.slideTitle.substring(0, 24)}`,
        elements: slideElements,
        canvasBackgroundColor: palette.canvasBg,
      };
    });

    return [
      {
        description: `${plan.mainTitle} (${pages.length}-Slide Custom Carousel)`,
        canvasBackgroundColor: palette.canvasBg,
        elements: pages[0].elements,
        pages,
        activePageIndex: 0,
      },
    ];
  }

  // 2. Build Layout Variation A: Vertical Step-by-Step Guide / Roadmap Infographic
  const roadmapElements: any[] = [
    // Header Container
    {
      type: 'shape',
      position: { x: 50, y: 35 },
      size: { width: 900, height: 115 },
      style: { backgroundColor: palette.cardBg, borderRadius: '18px', borderWidth: '2px', borderStyle: 'solid', borderColor: palette.accents[0], zIndex: 1 },
    },
    {
      type: 'text',
      position: { x: 80, y: 50 },
      size: { width: 840, height: 46 },
      content: plan.mainTitle.toUpperCase(),
      style: { color: palette.accents[0], fontSize: '34px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.5px', zIndex: 3 },
    },
    {
      type: 'text',
      position: { x: 80, y: 100 },
      size: { width: 840, height: 34 },
      content: plan.subtitle,
      style: { color: palette.textSecondary, fontSize: '15px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
    },
  ];

  const cardHeight = steps.length === 5 ? 132 : 165;
  const cardGap = steps.length === 5 ? 146 : 182;

  steps.forEach((step, idx) => {
    const yPos = 172 + idx * cardGap;
    const accent = palette.accents[idx % palette.accents.length];

    roadmapElements.push(
      {
        type: 'shape',
        position: { x: 50, y: yPos },
        size: { width: 900, height: cardHeight },
        style: { backgroundColor: palette.cardBg, borderRadius: '16px', borderWidth: '1.5px', borderStyle: 'solid', borderColor: accent, zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 75, y: yPos + 20 },
        size: { width: 52, height: 52 },
        style: { backgroundColor: accent, borderRadius: '12px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 75, y: yPos + 31 },
        size: { width: 52, height: 30 },
        content: step.stepNumber || `0${idx + 1}`,
        style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 145, y: yPos + 16 },
        size: { width: 780, height: 32 },
        content: step.heading.toUpperCase(),
        style: { color: accent, fontSize: '18px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 145, y: yPos + 52 },
        size: { width: 780, height: cardHeight - 62 },
        content: step.details,
        style: { color: palette.textPrimary, fontSize: '14px', lineHeight: '1.45', fontFamily: 'Inter, sans-serif', zIndex: 2 },
      }
    );
  });

  // Footer
  roadmapElements.push({
    type: 'text',
    position: { x: 50, y: 920 },
    size: { width: 900, height: 30 },
    content: plan.footerNote,
    style: { color: palette.textSecondary, fontSize: '13px', fontWeight: '600', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
  });

  // 3. Build Layout Variation B: 4-Quadrant Bento Grid OR Visual Hero Poster (with Nano Banana image!)
  const secondLayoutElements: any[] = [];

  if (isPoster || generatedImageUrl) {
    // Visual Hero Layout featuring the AI-generated Nano Banana Image + Key Steps
    secondLayoutElements.push(
      {
        type: 'shape',
        position: { x: 45, y: 45 },
        size: { width: 910, height: 910 },
        style: { backgroundColor: palette.cardBg, borderRadius: '24px', borderWidth: '2px', borderStyle: 'solid', borderColor: palette.accents[0], zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 85, y: 80 },
        size: { width: 240, height: 40 },
        style: { backgroundColor: palette.accents[0], borderRadius: '9999px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 85, y: 88 },
        size: { width: 240, height: 28 },
        content: (plan.badgeText || 'CUSTOM AI GRAPHIC').toUpperCase(),
        style: { color: '#FFFFFF', fontSize: '13px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1.5px', zIndex: 4 },
      },
      {
        type: 'text',
        position: { x: 85, y: 140 },
        size: { width: 830, height: 95 },
        content: plan.mainTitle.toUpperCase(),
        style: { color: palette.textPrimary, fontSize: '44px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.08', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 85, y: 240 },
        size: { width: 830, height: 55 },
        content: plan.subtitle,
        style: { color: palette.textSecondary, fontSize: '17px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'image',
        position: { x: 85, y: 310 },
        size: { width: 830, height: 390 },
        source: visualImg,
        content: plan.mainTitle,
        style: { borderRadius: '18px', zIndex: 2 },
      },
      // Two bottom summary cards
      {
        type: 'shape',
        position: { x: 85, y: 725 },
        size: { width: 400, height: 185 },
        style: { backgroundColor: palette.canvasBg, borderRadius: '16px', borderWidth: '1px', borderStyle: 'solid', borderColor: palette.accents[1], zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 110, y: 745 },
        size: { width: 350, height: 30 },
        content: steps[0]?.heading || 'Key Highlight 1',
        style: { color: palette.accents[1], fontSize: '16px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 110, y: 780 },
        size: { width: 350, height: 110 },
        content: steps[0]?.details || '',
        style: { color: palette.textPrimary, fontSize: '13px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 515, y: 725 },
        size: { width: 400, height: 185 },
        style: { backgroundColor: palette.canvasBg, borderRadius: '16px', borderWidth: '1px', borderStyle: 'solid', borderColor: palette.accents[2], zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 540, y: 745 },
        size: { width: 350, height: 30 },
        content: steps[1]?.heading || 'Key Highlight 2',
        style: { color: palette.accents[2], fontSize: '16px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 540, y: 780 },
        size: { width: 350, height: 110 },
        content: steps[1]?.details || '',
        style: { color: palette.textPrimary, fontSize: '13px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      }
    );
  } else {
    // 4-Quadrant Bento Grid Infographic
    secondLayoutElements.push(
      {
        type: 'text',
        position: { x: 60, y: 50 },
        size: { width: 880, height: 50 },
        content: plan.mainTitle.toUpperCase(),
        style: { color: palette.textPrimary, fontSize: '36px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 60, y: 108 },
        size: { width: 880, height: 35 },
        content: plan.subtitle,
        style: { color: palette.textSecondary, fontSize: '16px', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      }
    );

    const quadPositions = [
      { x: 60, y: 170 },
      { x: 515, y: 170 },
      { x: 60, y: 540 },
      { x: 515, y: 540 },
    ];

    steps.slice(0, 4).forEach((step, idx) => {
      const pos = quadPositions[idx];
      const accent = palette.accents[idx % palette.accents.length];
      secondLayoutElements.push(
        {
          type: 'shape',
          position: { x: pos.x, y: pos.y },
          size: { width: 425, height: 340 },
          style: { backgroundColor: palette.cardBg, borderRadius: '20px', borderWidth: '2px', borderStyle: 'solid', borderColor: accent, zIndex: 1 },
        },
        {
          type: 'text',
          position: { x: pos.x + 30, y: pos.y + 30 },
          size: { width: 365, height: 38 },
          content: `${step.stepNumber || `0${idx + 1}`}. ${step.heading.toUpperCase()}`,
          style: { color: accent, fontSize: '19px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
        },
        {
          type: 'text',
          position: { x: pos.x + 30, y: pos.y + 82 },
          size: { width: 365, height: 225 },
          content: step.details,
          style: { color: palette.textPrimary, fontSize: '15px', lineHeight: '1.65', fontFamily: 'Inter, sans-serif', zIndex: 2 },
        }
      );
    });

    secondLayoutElements.push({
      type: 'text',
      position: { x: 60, y: 915 },
      size: { width: 880, height: 30 },
      content: plan.footerNote,
      style: { color: palette.textSecondary, fontSize: '14px', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 2 },
    });
  }

  return [
    {
      description: `${plan.mainTitle} — Step-by-Step Roadmap`,
      canvasBackgroundColor: palette.canvasBg,
      elements: roadmapElements,
    },
    {
      description: isPoster || generatedImageUrl
        ? `${plan.mainTitle} — Visual Poster & AI Illustration`
        : `${plan.mainTitle} — 4-Pillar Bento Grid`,
      canvasBackgroundColor: palette.canvasBg,
      elements: secondLayoutElements,
    },
  ];
}

export async function generateAIGraphicsLayouts(
  options: GenerateDesignLayoutOptions
): Promise<{ layouts: GeneratedLayoutResult[] }> {
  const {
    prompt,
    style = 'Modern Professional',
    format = 'auto',
    apiKey,
    model,
    mcpContext,
    generateImagesWithNanoBanana = false,
  } = options;

  const ai = getAiClient(apiKey);

  if (!ai) {
    console.warn('No Gemini API key available, generating dynamic topic layout.');
    return synthesizeDynamicTopicFallback(prompt, style, format);
  }

  // Ensure we use a valid, supported Gemini model
  const validModels = ['gemini-2.5-flash', 'gemini-2.5-pro'];
  const chosenModel = model && validModels.includes(model) ? model : 'gemini-2.5-flash';

  try {
    // Run content synthesis and optional Nano Banana image generation in parallel!
    const contentPromise = ai.models.generateContent({
      model: chosenModel,
      contents: `You are an expert technical educator, copywriter, and graphic designer.
Create a complete, highly specific, accurate educational & visual plan for the following topic:
Topic / Request: "${prompt}"
Visual Style: "${style}"
${mcpContext ? `Connected Tools Context: ${mcpContext}` : ''}

IMPORTANT:
- Write 100% genuine, domain-accurate, detailed content specifically about "${prompt}".
- Provide 5 concrete stages/steps in "steps", with specific commands, tools, concepts, or actionable bullet points in "details" (use • bullets separated by newlines where helpful).
- Also provide 4 carouselSlides in case the user wants a multi-slide deck.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainTitle: { type: Type.STRING, description: 'Bold headline specifically for this topic (max 45 chars)' },
            subtitle: { type: Type.STRING, description: 'Clear 1-sentence value proposition or subtitle' },
            badgeText: { type: Type.STRING, description: 'Short 2-3 word category tag, e.g. PYTHON GUIDE 2026' },
            footerNote: { type: Type.STRING, description: 'Recommended tools, commands, or summary takeaway' },
            ctaText: { type: Type.STRING, description: 'Short call to action' },
            steps: {
              type: Type.ARRAY,
              description: 'Exactly 5 sequential steps, phases, or pillars specifically tailored to the prompt',
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.STRING, description: '01, 02, 03, 04, 05' },
                  heading: { type: Type.STRING, description: 'Stage title specific to the topic' },
                  details: { type: Type.STRING, description: 'Specific technical details, commands, or actionable points (150-220 chars)' },
                },
                required: ['stepNumber', 'heading', 'details'],
              },
            },
            carouselSlides: {
              type: Type.ARRAY,
              description: '4 slides for a multi-page carousel on this exact topic',
              items: {
                type: Type.OBJECT,
                properties: {
                  slideBadge: { type: Type.STRING },
                  slideTitle: { type: Type.STRING },
                  slideSubtitle: { type: Type.STRING },
                  bulletPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['slideBadge', 'slideTitle', 'slideSubtitle', 'bulletPoints'],
              },
            },
          },
          required: ['mainTitle', 'subtitle', 'badgeText', 'footerNote', 'ctaText', 'steps'],
        },
      },
    });

    const imagePromise =
      generateImagesWithNanoBanana || format === 'poster'
        ? generateNanoBananaImage(prompt, apiKey)
        : Promise.resolve(null);

    const [response, generatedImageUrl] = await Promise.all([contentPromise, imagePromise]);

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const plan: BespokeStructuredPlan = JSON.parse(text);
    const layouts = compileBespokePlanToLayouts(plan, prompt, style, format, generatedImageUrl);
    return { layouts };
  } catch (error: any) {
    // If the error was due to an invalid custom key, retry once using the built-in server environment key
    const isApiKeyError =
      error?.message?.includes('API key not valid') ||
      error?.status === 'INVALID_ARGUMENT' ||
      error?.message?.includes('API_KEY_INVALID');

    if (isApiKeyError && apiKey && (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY)) {
      console.warn('Custom API key was invalid. Retrying with built-in server GEMINI_API_KEY...');
      try {
        const retryResult = await generateAIGraphicsLayouts({
          ...options,
          apiKey: undefined, // use server default
        });
        return retryResult;
      } catch (retryErr) {
        console.error('Retry with server key also failed:', retryErr);
      }
    }

    console.warn('Gemini call encountered an error. Synthesizing bespoke dynamic topic blueprint:', error?.message || error);
    return synthesizeDynamicTopicFallback(prompt, style, format);
  }
}

/**
 * Dynamic Fallback Synthesizer (if offline or API key quota exhausted):
 * Never returns hardcoded "Cloud Computing" unless the user actually asked for cloud!
 * Dynamically constructs a tailored layout using the user's exact topic words.
 */
function synthesizeDynamicTopicFallback(
  prompt: string,
  style: string,
  format: string = 'auto'
): { layouts: GeneratedLayoutResult[] } {
  const cleanTopic = prompt.trim();
  const titleText = cleanTopic.length > 42 ? cleanTopic.substring(0, 40) + '...' : cleanTopic;

  const dynamicPlan: BespokeStructuredPlan = {
    mainTitle: titleText,
    subtitle: `Complete step-by-step practical guide and reference architecture for ${cleanTopic}`,
    badgeText: 'CUSTOM BLUEPRINT',
    footerNote: `PRO TIP: Customize every card, color, and typography block directly on the canvas`,
    ctaText: 'GET STARTED →',
    steps: [
      {
        stepNumber: '01',
        heading: `1. Prerequisites & Environment for ${titleText}`,
        details: `• Install required runtime dependencies and core CLI tools\n• Configure local workspace, environment variables, and paths\n• Verify installation version and system compatibility`,
      },
      {
        stepNumber: '02',
        heading: `2. Project Structure & Core Configuration`,
        details: `• Initialize isolated virtual environment or package manifest\n• Set up linting, formatting, and clean directory hierarchy\n• Configure base settings and modular entrypoints`,
      },
      {
        stepNumber: '03',
        heading: `3. Core Implementation & Best Practices`,
        details: `• Implement primary workflows using idiomatic patterns\n• Add structured error handling, logging, and type safety\n• Keep modules decoupled and reusable`,
      },
      {
        stepNumber: '04',
        heading: `4. Automated Testing & Quality Assurance`,
        details: `• Write unit and integration tests for critical paths\n• Run static analysis and performance benchmarks\n• Validate edge cases before deployment`,
      },
      {
        stepNumber: '05',
        heading: `5. Packaging, Deployment & Maintenance`,
        details: `• Package build artifacts and lock dependency versions\n• Automate CI/CD pipeline and release workflows\n• Monitor runtime metrics and iterate`,
      },
    ],
  };

  return {
    layouts: compileBespokePlanToLayouts(dynamicPlan, prompt, style, format, null),
  };
}
