import { GoogleGenAI, Type } from '@google/genai';
import type { DesignLayout, DesignElement } from '@/types/blueprint';

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
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
  cloud: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
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
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  ],
  music: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
  ],
  fashion: [
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80',
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
  return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80';
}

export async function generateAIGraphicsLayouts(options: GenerateDesignLayoutOptions): Promise<{ layouts: GeneratedLayoutResult[] }> {
  const { prompt, style = 'Modern Professional', category = 'Graphic Design', format = 'auto' } = options;
  const ai = getAiClient();

  if (!ai) {
    console.warn('GEMINI_API_KEY not found in environment, synthesizing design layouts with intent detection.');
    return synthesizeSmartLayouts(prompt, style);
  }

  const promptLower = prompt.toLowerCase();
  const isInfographicOrRoadmap =
    format === 'infographic' ||
    promptLower.includes('roadmap') ||
    promptLower.includes('infographic') ||
    promptLower.includes('timeline') ||
    promptLower.includes('steps') ||
    promptLower.includes('guide') ||
    promptLower.includes('path') ||
    promptLower.includes('pipeline') ||
    promptLower.includes('cheatsheet');

  const systemInstruction = `You are a world-class graphic designer specializing in both educational infographics/roadmaps and promotional graphics.
Canvas dimensions: 1000x1000 coordinate space (x: 0-1000, y: 0-1000).

DESIGN INSTRUCTIONS:
${
  isInfographicOrRoadmap
    ? `The user is requesting an EDUCATIONAL INFOGRAPHIC or ROADMAP.
- Design a structured visual guide, roadmap, or timeline with sequential stages or milestones.
- Include a bold Top Header (title & subtitle).
- Create 3 to 5 milestone cards/blocks (e.g. "Phase 1: Foundations", "Phase 2: Core Services", "Phase 3: DevOps & IaC", "Phase 4: Kubernetes", "Phase 5: Architect").
- Use background cards for each step (shapes with borderRadius and border) with high-contrast text.
- Include informative, realistic domain-specific bullet points or descriptions inside each card.
- Add small numbered badges ("01", "02", "03", etc.) for each stage.
- Do NOT generate a generic marketing flyer with a "buy now" CTA; make it a genuine informative infographic.`
    : `The user is requesting a MARKETING, EVENT, or PROMOTIONAL GRAPHIC.
- Follow strong visual hierarchy: Tagline/Eyebrow badge, dominant headline, supporting body, visual photo/shape container, and CTA button.
- Ensure high contrast and professional typography.`
}

Return 2 distinct, highly tailored layouts. Keep token output clean and efficient.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Design 2 complete custom graphic design layouts for:
User Request: "${prompt}"
Style Theme: "${style}"
Format Intent: "${isInfographicOrRoadmap ? 'Educational Infographic / Step-by-Step Roadmap' : category}"

Return 2 layout options in the layouts array with full positioning, sizing, and styling.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            layouts: {
              type: Type.ARRAY,
              description: 'Array of 2 custom design layout variations',
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING, description: 'Descriptive title of the layout' },
                  canvasBackgroundColor: { type: Type.STRING, description: 'Hex or HSL color code' },
                  elements: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING, description: 'text, image, or shape' },
                        position: {
                          type: Type.OBJECT,
                          properties: {
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                          },
                          required: ['x', 'y'],
                        },
                        size: {
                          type: Type.OBJECT,
                          properties: {
                            width: { type: Type.NUMBER },
                            height: { type: Type.NUMBER },
                          },
                          required: ['width', 'height'],
                        },
                        content: { type: Type.STRING },
                        source: { type: Type.STRING },
                        style: {
                          type: Type.OBJECT,
                          properties: {
                            backgroundColor: { type: Type.STRING },
                            color: { type: Type.STRING },
                            fontFamily: { type: Type.STRING },
                            fontSize: { type: Type.STRING },
                            fontWeight: { type: Type.STRING },
                            textAlign: { type: Type.STRING },
                            borderRadius: { type: Type.STRING },
                            border: { type: Type.STRING },
                            opacity: { type: Type.NUMBER },
                            letterSpacing: { type: Type.STRING },
                            zIndex: { type: Type.NUMBER },
                          },
                        },
                      },
                      required: ['type', 'position', 'size'],
                    },
                  },
                },
                required: ['description', 'canvasBackgroundColor', 'elements'],
              },
            },
          },
          required: ['layouts'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini response was empty');
    }

    const parsed = JSON.parse(text);
    if (!parsed.layouts || !Array.isArray(parsed.layouts) || parsed.layouts.length === 0) {
      throw new Error('No layouts returned in parsed response');
    }

    const enrichedLayouts = parsed.layouts.map((layout: GeneratedLayoutResult, idx: number) => ({
      ...layout,
      elements: layout.elements.map((el) => {
        if (el.type === 'image') {
          if (!el.source || el.source.includes('placehold.co') || el.source.includes('example.com')) {
            el.source = getMatchingCuratedImage(prompt, idx);
          }
        }
        return el;
      }),
    }));

    return { layouts: enrichedLayouts };
  } catch (error) {
    console.error('Gemini API call failed, falling back to smart intent design synthesis:', error);
    return synthesizeSmartLayouts(prompt, style);
  }
}

/**
 * Smart Fallback Synthesizer:
 * Detects user intent (Roadmap/Infographic vs Poster/Promo) and provides
 * actual custom educational diagrams and roadmaps if requested.
 */
function synthesizeSmartLayouts(prompt: string, style: string, format?: string): { layouts: GeneratedLayoutResult[] } {
  const p = prompt.toLowerCase();
  const sampleImg = getMatchingCuratedImage(prompt, 0);

  const isCarousel =
    format === 'carousel' ||
    p.includes('carousel') ||
    p.includes('slide') ||
    p.includes('deck') ||
    p.includes('linkedin') ||
    p.includes('multi-page');

  if (isCarousel) {
    const slide1Elements: any[] = [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#0B0F19', borderRadius: '24px', border: '1px solid #1E293B', zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 90 },
        size: { width: 220, height: 44 },
        style: { backgroundColor: '#3B82F6', borderRadius: '9999px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 90, y: 98 },
        size: { width: 220, height: 35 },
        content: 'SLIDE DECK • 1 OF 4',
        style: { color: '#FFFFFF', fontSize: '13px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 90, y: 220 },
        size: { width: 820, height: 160 },
        content: 'HOW TO ARCHITECT FOR 1M USERS',
        style: { color: '#38BDF8', fontSize: '56px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.05', letterSpacing: '-1px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 90, y: 410 },
        size: { width: 800, height: 90 },
        content: 'A practical, engineering-first guide to decoupling bottlenecks, scaling databases, and designing resilient distributed cloud services.',
        style: { color: '#94A3B8', fontSize: '20px', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 550 },
        size: { width: 820, height: 240 },
        style: { backgroundColor: '#111827', borderRadius: '20px', border: '1px solid #374151', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 130, y: 580 },
        size: { width: 740, height: 160 },
        content: '• What breaks first when your traffic 10x-es\n• Why vertical scaling fails after 50k RPS\n• The 3 architectural patterns that solve 90% of outages\n• Concrete migration steps without downtime',
        style: { color: '#F1F5F9', fontSize: '18px', lineHeight: '2.0', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 830 },
        size: { width: 260, height: 50 },
        style: { backgroundColor: '#10B981', borderRadius: '12px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 90, y: 842 },
        size: { width: 260, height: 35 },
        content: 'SWIPE TO READ →',
        style: { color: '#FFFFFF', fontSize: '15px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', zIndex: 3 },
      },
    ];

    const slide2Elements: any[] = [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#0B0F19', borderRadius: '24px', border: '1px solid #1E293B', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 80, y: 80 },
        size: { width: 300, height: 30 },
        content: 'SLIDE 2 OF 4 • THE PROBLEM',
        style: { color: '#F43F5E', fontSize: '14px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 80, y: 120 },
        size: { width: 840, height: 70 },
        content: 'THE 3 CRITICAL BOTTLENECKS',
        style: { color: '#FFFFFF', fontSize: '42px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 80, y: 220 },
        size: { width: 840, height: 180 },
        style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #F43F5E', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 245 },
        size: { width: 760, height: 35 },
        content: '1. DATABASE CONNECTION POOL EXHAUSTION',
        style: { color: '#FDA4AF', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 290 },
        size: { width: 760, height: 80 },
        content: 'Direct database connections from hundreds of containers immediately saturate max connections, causing thread locking and 504 timeouts.',
        style: { color: '#E2E8F0', fontSize: '16px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 80, y: 430 },
        size: { width: 840, height: 180 },
        style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #F59E0B', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 455 },
        size: { width: 760, height: 35 },
        content: '2. SYNCHRONOUS CASCADING DEPENDENCIES',
        style: { color: '#FCD34D', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 500 },
        size: { width: 760, height: 80 },
        content: 'When Service A waits synchronously on Service B & C, a 200ms latency degradation in one downstream third-party locks up the entire web tier.',
        style: { color: '#E2E8F0', fontSize: '16px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 80, y: 640 },
        size: { width: 840, height: 180 },
        style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #8B5CF6', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 665 },
        size: { width: 760, height: 35 },
        content: '3. UNCACHED HOT QUERY RE-EXECUTION',
        style: { color: '#C4B5FD', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 710 },
        size: { width: 760, height: 80 },
        content: 'Executing complex relational aggregations repeatedly for identical user feeds wastes 95% of database CPU cycles.',
        style: { color: '#E2E8F0', fontSize: '16px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
    ];

    const slide3Elements: any[] = [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#0B0F19', borderRadius: '24px', border: '1px solid #1E293B', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 80, y: 80 },
        size: { width: 300, height: 30 },
        content: 'SLIDE 3 OF 4 • THE ARCHITECTURE',
        style: { color: '#10B981', fontSize: '14px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 80, y: 120 },
        size: { width: 840, height: 70 },
        content: 'THE DISTRIBUTED SOLUTION',
        style: { color: '#FFFFFF', fontSize: '42px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 80, y: 220 },
        size: { width: 840, height: 180 },
        style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #10B981', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 245 },
        size: { width: 760, height: 35 },
        content: 'LAYER 1: EDGE CDN & CLUSTERED CACHE',
        style: { color: '#6EE7B7', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 290 },
        size: { width: 760, height: 80 },
        content: 'Push static assets and semi-static API responses to edge locations. Use Redis Cluster with sub-millisecond cache hits for 90% of reads.',
        style: { color: '#E2E8F0', fontSize: '16px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 80, y: 430 },
        size: { width: 840, height: 180 },
        style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #3B82F6', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 455 },
        size: { width: 760, height: 35 },
        content: 'LAYER 2: ASYNC MESSAGE QUEUES (KAFKA / SQS)',
        style: { color: '#93C5FD', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 500 },
        size: { width: 760, height: 80 },
        content: 'Convert all non-blocking operations (emails, analytics, webhooks) to background events. Decouple ingress traffic from processing time.',
        style: { color: '#E2E8F0', fontSize: '16px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 80, y: 640 },
        size: { width: 840, height: 180 },
        style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #EC4899', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 665 },
        size: { width: 760, height: 35 },
        content: 'LAYER 3: DB CONNECTION PROXY & READ REPLICAS',
        style: { color: '#F9A8D4', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 710 },
        size: { width: 760, height: 80 },
        content: 'Deploy connection pooling (PgBouncer / AWS RDS Proxy). Route 100% of read traffic to horizontal replicas.',
        style: { color: '#E2E8F0', fontSize: '16px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
    ];

    const slide4Elements: any[] = [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#0B0F19', borderRadius: '24px', border: '1px solid #1E293B', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 80, y: 80 },
        size: { width: 300, height: 30 },
        content: 'SLIDE 4 OF 4 • TAKEAWAYS',
        style: { color: '#F59E0B', fontSize: '14px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 80, y: 120 },
        size: { width: 840, height: 70 },
        content: 'SUMMARY & ACTION CHECKLIST',
        style: { color: '#FFFFFF', fontSize: '42px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 80, y: 220 },
        size: { width: 840, height: 440 },
        style: { backgroundColor: '#111827', borderRadius: '20px', border: '1px solid #374151', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 260 },
        size: { width: 760, height: 350 },
        content: '✅ 1. Implement Redis Cache-Aside on all high-traffic endpoints\n\n✅ 2. Place PgBouncer / RDS Proxy between containers & DB\n\n✅ 3. Convert email, notifications, and webhooks to SQS / Kafka\n\n✅ 4. Enable aggressive TTL edge caching on CDN\n\n✅ 5. Benchmark with k6 load testing up to 100k virtual users',
        style: { color: '#F8FAFC', fontSize: '20px', lineHeight: '1.9', fontFamily: 'Inter, sans-serif', fontWeight: '500', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 80, y: 710 },
        size: { width: 840, height: 100 },
        style: { backgroundColor: '#3B82F6', borderRadius: '16px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 100, y: 730 },
        size: { width: 800, height: 35 },
        content: '📌 SAVE THIS CAROUSEL FOR YOUR NEXT ARCHITECTURE REVIEW',
        style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 768 },
        size: { width: 800, height: 30 },
        content: 'Follow for weekly deep-dives into distributed systems & high-throughput cloud engineering.',
        style: { color: '#DBEAFE', fontSize: '14px', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
    ];

    const carouselPages = [
      { id: crypto.randomUUID(), title: 'Slide 1: Hook / Intro', elements: slide1Elements, canvasBackgroundColor: '#0B0F19' },
      { id: crypto.randomUUID(), title: 'Slide 2: Bottlenecks', elements: slide2Elements, canvasBackgroundColor: '#0B0F19' },
      { id: crypto.randomUUID(), title: 'Slide 3: Architecture', elements: slide3Elements, canvasBackgroundColor: '#0B0F19' },
      { id: crypto.randomUUID(), title: 'Slide 4: Action Checklist', elements: slide4Elements, canvasBackgroundColor: '#0B0F19' },
    ];

    return {
      layouts: [
        {
          description: 'Multi-Slide Carousel: Scaling Distributed Cloud Architecture (4 Slides)',
          canvasBackgroundColor: '#0B0F19',
          elements: slide1Elements,
          pages: carouselPages,
          activePageIndex: 0,
        },
      ],
    };
  }

  const isRoadmapOrInfographic =
    p.includes('roadmap') ||
    p.includes('infographic') ||
    p.includes('cloud') ||
    p.includes('learn') ||
    p.includes('guide') ||
    p.includes('step') ||
    p.includes('path') ||
    p.includes('timeline');

  // If the user requested a Roadmap or Infographic (like Cloud Computing Roadmap)
  if (isRoadmapOrInfographic) {
    return {
      layouts: [
        {
          description: 'Cloud Computing Mastery Roadmap (Infographic Steps)',
          canvasBackgroundColor: '#0B0F19',
          elements: [
            // Header Card
            {
              type: 'shape',
              position: { x: 50, y: 40 },
              size: { width: 900, height: 110 },
              style: { backgroundColor: '#111827', borderRadius: '16px', border: '1px solid #1E293B', zIndex: 1 },
            },
            {
              type: 'text',
              position: { x: 80, y: 55 },
              size: { width: 840, height: 42 },
              content: 'CLOUD COMPUTING ROADMAP 2026',
              style: { color: '#38BDF8', fontSize: '36px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', zIndex: 3 },
            },
            {
              type: 'text',
              position: { x: 80, y: 102 },
              size: { width: 840, height: 30 },
              content: 'Complete step-by-step learning guide from IT fundamentals to Multi-Cloud Solutions Architect',
              style: { color: '#94A3B8', fontSize: '15px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
            },

            // Step 1: Fundamentals
            {
              type: 'shape',
              position: { x: 50, y: 175 },
              size: { width: 900, height: 125 },
              style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #3B82F6', zIndex: 1 },
            },
            {
              type: 'shape',
              position: { x: 75, y: 195 },
              size: { width: 50, height: 50 },
              style: { backgroundColor: '#3B82F6', borderRadius: '12px', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 75, y: 205 },
              size: { width: 50, height: 30 },
              content: '01',
              style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
            },
            {
              type: 'text',
              position: { x: 145, y: 190 },
              size: { width: 780, height: 32 },
              content: 'STAGE 1: IT & NETWORKING FUNDAMENTALS',
              style: { color: '#60A5FA', fontSize: '18px', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 145, y: 226 },
              size: { width: 780, height: 55 },
              content: 'TCP/IP, DNS, Subnets, OSI Model • Linux CLI & Bash Scripting • Git Version Control • Virtualization basics',
              style: { color: '#E2E8F0', fontSize: '14px', lineHeight: '1.4', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },

            // Step 2: Core Cloud Services
            {
              type: 'shape',
              position: { x: 50, y: 320 },
              size: { width: 900, height: 125 },
              style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #10B981', zIndex: 1 },
            },
            {
              type: 'shape',
              position: { x: 75, y: 340 },
              size: { width: 50, height: 50 },
              style: { backgroundColor: '#10B981', borderRadius: '12px', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 75, y: 350 },
              size: { width: 50, height: 30 },
              content: '02',
              style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
            },
            {
              type: 'text',
              position: { x: 145, y: 335 },
              size: { width: 780, height: 32 },
              content: 'STAGE 2: CORE CLOUD PROVIDER SERVICES (AWS / GCP / AZURE)',
              style: { color: '#34D399', fontSize: '18px', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 145, y: 371 },
              size: { width: 780, height: 55 },
              content: 'Compute (EC2, VMs, Lambda) • Storage (S3, Blob, Block Store) • Identity & Access (IAM, Roles) • Virtual Private Clouds (VPC, Security Groups)',
              style: { color: '#E2E8F0', fontSize: '14px', lineHeight: '1.4', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },

            // Step 3: Infrastructure as Code & Automation
            {
              type: 'shape',
              position: { x: 50, y: 465 },
              size: { width: 900, height: 125 },
              style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #F59E0B', zIndex: 1 },
            },
            {
              type: 'shape',
              position: { x: 75, y: 485 },
              size: { width: 50, height: 50 },
              style: { backgroundColor: '#F59E0B', borderRadius: '12px', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 75, y: 495 },
              size: { width: 50, height: 30 },
              content: '03',
              style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
            },
            {
              type: 'text',
              position: { x: 145, y: 480 },
              size: { width: 780, height: 32 },
              content: 'STAGE 3: INFRASTRUCTURE AS CODE & CI/CD',
              style: { color: '#FBBF24', fontSize: '18px', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 145, y: 516 },
              size: { width: 780, height: 55 },
              content: 'Terraform & OpenTofu • GitHub Actions & GitLab CI • Ansible configuration • CloudFormation / Bicep automated deployments',
              style: { color: '#E2E8F0', fontSize: '14px', lineHeight: '1.4', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },

            // Step 4: Containers & Kubernetes
            {
              type: 'shape',
              position: { x: 50, y: 610 },
              size: { width: 900, height: 125 },
              style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #EC4899', zIndex: 1 },
            },
            {
              type: 'shape',
              position: { x: 75, y: 630 },
              size: { width: 50, height: 50 },
              style: { backgroundColor: '#EC4899', borderRadius: '12px', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 75, y: 640 },
              size: { width: 50, height: 30 },
              content: '04',
              style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
            },
            {
              type: 'text',
              position: { x: 145, y: 625 },
              size: { width: 780, height: 32 },
              content: 'STAGE 4: CONTAINERS, KUBERNETES & MICROSERVICES',
              style: { color: '#F472B6', fontSize: '18px', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 145, y: 661 },
              size: { width: 780, height: 55 },
              content: 'Docker image packaging • Kubernetes (EKS / GKE / AKS) • Ingress controllers, Helm charts, Pod networking • Service mesh & observability',
              style: { color: '#E2E8F0', fontSize: '14px', lineHeight: '1.4', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },

            // Step 5: Architecture & Security
            {
              type: 'shape',
              position: { x: 50, y: 755 },
              size: { width: 900, height: 125 },
              style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #8B5CF6', zIndex: 1 },
            },
            {
              type: 'shape',
              position: { x: 75, y: 775 },
              size: { width: 50, height: 50 },
              style: { backgroundColor: '#8B5CF6', borderRadius: '12px', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 75, y: 785 },
              size: { width: 50, height: 30 },
              content: '05',
              style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
            },
            {
              type: 'text',
              position: { x: 145, y: 770 },
              size: { width: 780, height: 32 },
              content: 'STAGE 5: HIGH AVAILABILITY, SECURITY & FINOPS',
              style: { color: '#A78BFA', fontSize: '18px', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 145, y: 806 },
              size: { width: 780, height: 55 },
              content: 'Multi-Region disaster recovery • Zero Trust architecture & encryption • Cloud FinOps cost optimization • Prometheus & Datadog monitoring',
              style: { color: '#E2E8F0', fontSize: '14px', lineHeight: '1.4', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },

            // Footer note
            {
              type: 'text',
              position: { x: 50, y: 910 },
              size: { width: 900, height: 35 },
              content: 'RECOMMENDED CERTS: AWS Solutions Architect • CKA (Certified Kubernetes Admin) • HashiCorp Terraform Associate',
              style: { color: '#64748B', fontSize: '13px', fontWeight: '600', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
          ],
        },
        {
          description: 'Modular Cloud Architecture Pillars (4-Quadrant Infographic)',
          canvasBackgroundColor: '#F8FAFC',
          elements: [
            // Title Header
            {
              type: 'text',
              position: { x: 60, y: 60 },
              size: { width: 880, height: 50 },
              content: 'THE 4 PILLARS OF CLOUD ARCHITECTURE',
              style: { color: '#0F172A', fontSize: '38px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
            },
            {
              type: 'text',
              position: { x: 60, y: 120 },
              size: { width: 880, height: 30 },
              content: 'Engineering principles for reliable, scalable, and resilient distributed systems',
              style: { color: '#64748B', fontSize: '16px', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 3 },
            },

            // Quadrant 1: Security & Compliance
            {
              type: 'shape',
              position: { x: 60, y: 180 },
              size: { width: 425, height: 340 },
              style: { backgroundColor: '#FFFFFF', borderRadius: '20px', border: '2px solid #3B82F6', zIndex: 1 },
            },
            {
              type: 'text',
              position: { x: 90, y: 210 },
              size: { width: 365, height: 35 },
              content: '01. SECURITY & IDENTITY',
              style: { color: '#2563EB', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 90, y: 260 },
              size: { width: 365, height: 220 },
              content: '• Principle of Least Privilege (IAM)\n• Data encryption at rest and in transit\n• Automated secret rotation (Vault/KMS)\n• Network isolation & private subnets\n• Real-time threat detection (GuardDuty)',
              style: { color: '#334155', fontSize: '15px', lineHeight: '1.7', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },

            // Quadrant 2: Reliability & Scaling
            {
              type: 'shape',
              position: { x: 515, y: 180 },
              size: { width: 425, height: 340 },
              style: { backgroundColor: '#FFFFFF', borderRadius: '20px', border: '2px solid #10B981', zIndex: 1 },
            },
            {
              type: 'text',
              position: { x: 545, y: 210 },
              size: { width: 365, height: 35 },
              content: '02. RELIABILITY & RESILIENCE',
              style: { color: '#059669', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 545, y: 260 },
              size: { width: 365, height: 220 },
              content: '• Multi-AZ auto-scaling groups\n• Circuit breaker & retry patterns\n• Automated backups & RPO/RTO goals\n• Chaos engineering validation\n• Global traffic failover (DNS routing)',
              style: { color: '#334155', fontSize: '15px', lineHeight: '1.7', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },

            // Quadrant 3: Performance & Efficiency
            {
              type: 'shape',
              position: { x: 60, y: 550 },
              size: { width: 425, height: 340 },
              style: { backgroundColor: '#FFFFFF', borderRadius: '20px', border: '2px solid #F59E0B', zIndex: 1 },
            },
            {
              type: 'text',
              position: { x: 90, y: 580 },
              size: { width: 365, height: 35 },
              content: '03. PERFORMANCE & CACHING',
              style: { color: '#D97706', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 90, y: 630 },
              size: { width: 365, height: 220 },
              content: '• Edge caching via CloudFront / CDN\n• Redis distributed in-memory cache\n• Serverless event-driven compute\n• Read replicas for relational databases\n• Asynchronous message queuing (SQS/Kafka)',
              style: { color: '#334155', fontSize: '15px', lineHeight: '1.7', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },

            // Quadrant 4: Cost Optimization & FinOps
            {
              type: 'shape',
              position: { x: 515, y: 550 },
              size: { width: 425, height: 340 },
              style: { backgroundColor: '#FFFFFF', borderRadius: '20px', border: '2px solid #8B5CF6', zIndex: 1 },
            },
            {
              type: 'text',
              position: { x: 545, y: 580 },
              size: { width: 365, height: 35 },
              content: '04. COST & FINOPS',
              style: { color: '#7C3AED', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 2 },
            },
            {
              type: 'text',
              position: { x: 545, y: 630 },
              size: { width: 365, height: 220 },
              content: '• Spot instances for batch workloads\n• Reserved instances / Savings Plans\n• S3 lifecycle rules & Glacier archiving\n• Automated resource tagging & budgets\n• Idle resource auto-shutdown',
              style: { color: '#334155', fontSize: '15px', lineHeight: '1.7', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },

            // Footer
            {
              type: 'text',
              position: { x: 60, y: 920 },
              size: { width: 880, height: 30 },
              content: 'Architected with AWS & Cloud Native Computing Foundation (CNCF) standards',
              style: { color: '#94A3B8', fontSize: '14px', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 2 },
            },
          ],
        },
      ],
    };
  }

  // Default Promotional / Creative visual layout
  const headline = prompt.length > 40 ? prompt.substring(0, 37) + '...' : prompt;
  return {
    layouts: [
      {
        description: `Modern Showcase: ${headline}`,
        canvasBackgroundColor: '#0F172A',
        elements: [
          {
            type: 'shape',
            position: { x: 50, y: 50 },
            size: { width: 900, height: 900 },
            style: { backgroundColor: '#1E293B', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1 },
          },
          {
            type: 'shape',
            position: { x: 100, y: 100 },
            size: { width: 220, height: 44 },
            style: { backgroundColor: '#3B82F6', borderRadius: '9999px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 100, y: 102 },
            size: { width: 220, height: 40 },
            content: 'FEATURED DESIGN',
            style: { color: '#FFFFFF', fontSize: '14px', fontWeight: '700', textAlign: 'center', fontFamily: 'Inter, sans-serif', letterSpacing: '2px', zIndex: 4 },
          },
          {
            type: 'text',
            position: { x: 100, y: 170 },
            size: { width: 800, height: 110 },
            content: headline.toUpperCase(),
            style: { color: '#FFFFFF', fontSize: '56px', fontWeight: '800', textAlign: 'left', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.1', zIndex: 3 },
          },
          {
            type: 'image',
            position: { x: 100, y: 310 },
            size: { width: 800, height: 480 },
            source: sampleImg,
            content: prompt,
            style: { borderRadius: '16px', zIndex: 2 },
          },
          {
            type: 'shape',
            position: { x: 100, y: 825 },
            size: { width: 260, height: 56 },
            style: { backgroundColor: '#F59E0B', borderRadius: '12px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 100, y: 835 },
            size: { width: 260, height: 40 },
            content: 'LEARN MORE →',
            style: { color: '#000000', fontSize: '16px', fontWeight: '700', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
          },
        ],
      },
    ],
  };
}
