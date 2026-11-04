'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateBlueprintLayout, type GenerateDesignLayoutOutput } from '@/lib/actions';
import type { DesignLayout as ClientDesignLayout } from '@/types/blueprint';
import { Wand2, Loader2, Eye, FilePlus2, Sparkles, Shuffle, Palette, Map, LayoutGrid, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addIdsToLayout } from '@/components/canvas/Canvas';

interface AiDesignToolProps {
  onLayoutSelect: (layout: ClientDesignLayout | null) => void;
}

const INSPIRATION_PROMPTS = [
  '4-Slide Tech Carousel: Scaling Architecture to 1M Users',
  'Educational Infographic for a Cloud Computing Roadmap',
  '5-Slide Carousel: Clean Code & Refactoring Rules',
  'DevOps CI/CD Pipeline Architecture Diagram',
  'Artisan Bakery & Café Grand Opening with 20% off all pastries',
  'Next-Gen AI Tech Conference 2026 Keynote & Workshops',
  'Cyberpunk Synthwave Neon Music Festival Poster',
];

const STYLE_PRESETS = [
  { id: 'Modern Professional', label: 'Modern Pro', color: 'bg-blue-500' },
  { id: 'Dark Luxury', label: 'Dark Luxury', color: 'bg-amber-500' },
  { id: 'Cyberpunk Neon', label: 'Cyberpunk', color: 'bg-fuchsia-500' },
  { id: 'Warm Editorial', label: 'Warm Editorial', color: 'bg-orange-400' },
  { id: 'Clean Minimalist', label: 'Clean Minimal', color: 'bg-slate-400' },
];

const FORMAT_PRESETS: { id: 'auto' | 'carousel' | 'infographic' | 'poster'; label: string; icon: any }[] = [
  { id: 'auto', label: 'Auto Detect', icon: Sparkles },
  { id: 'carousel', label: 'Carousel Deck', icon: Layers },
  { id: 'infographic', label: 'Roadmap / Guide', icon: Map },
  { id: 'poster', label: 'Poster / Flyer', icon: LayoutGrid },
];

export function AiDesignTool({ onLayoutSelect }: AiDesignToolProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Modern Professional');
  const [selectedFormat, setSelectedFormat] = useState<'auto' | 'carousel' | 'infographic' | 'poster'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLayouts, setGeneratedLayouts] = useState<ClientDesignLayout[]>([]);
  const { toast } = useToast();

  const handleGenerate = async (targetPrompt?: string, styleParam?: string, formatParam?: any) => {
    const textPrompt = targetPrompt || prompt;
    const styleChoice = styleParam || selectedStyle;
    const formatChoice = formatParam || selectedFormat;

    if (!textPrompt.trim()) {
      toast({
        title: 'Prompt is empty',
        description: 'Please describe the design you want to create.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedLayouts([]);

    try {
      const result: GenerateDesignLayoutOutput = await generateBlueprintLayout({
        prompt: textPrompt,
        style: styleChoice,
        format: formatChoice,
      });

      if (result && result.layouts && result.layouts.length > 0) {
        const layoutsWithIds = result.layouts.map((layout) =>
          addIdsToLayout(
            layout as Omit<ClientDesignLayout, 'id' | 'elements'> & {
              elements: Omit<ClientDesignLayout['elements'][0], 'id'>[];
            }
          )
        );
        setGeneratedLayouts(layoutsWithIds);
        toast({
          title: 'Custom Graphics Generated!',
          description: `Created ${layoutsWithIds.length} tailored layouts with smart intent awareness.`,
        });
      } else {
        toast({
          title: 'Generation Failed',
          description: 'No layouts returned. Please try tweaking your prompt.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating layout:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during generation.';
      toast({ title: 'Generation Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurpriseMe = () => {
    const random = INSPIRATION_PROMPTS[Math.floor(Math.random() * INSPIRATION_PROMPTS.length)];
    setPrompt(random);
    if (random.toLowerCase().includes('carousel')) {
      setSelectedFormat('carousel');
    } else if (random.toLowerCase().includes('roadmap') || random.toLowerCase().includes('diagram')) {
      setSelectedFormat('infographic');
    }
  };

  const handleBlankCanvas = () => {
    const blankLayout = addIdsToLayout({
      description: 'Blank Canvas',
      elements: [],
      canvasBackgroundColor: '#FFFFFF',
    });
    onLayoutSelect(blankLayout);
    setGeneratedLayouts([]);
    setPrompt('');
    toast({ title: 'Blank Canvas', description: 'Started a fresh new design canvas.' });
  };

  return (
    <div className="p-4 space-y-4 flex flex-col min-h-full overflow-y-auto select-none">
      <div className="space-y-3">
        <Button onClick={handleBlankCanvas} variant="outline" size="sm" className="w-full">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Blank Canvas
        </Button>

        <div className="relative flex items-center py-0.5">
          <div className="flex-grow border-t border-muted"></div>
          <span className="flex-shrink mx-3 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
            AI Designer
          </span>
          <div className="flex-grow border-t border-muted"></div>
        </div>

        {/* Graphic Format Mode (Infographic vs Carousel vs Poster) */}
        <div>
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" /> Format & Layout
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {FORMAT_PRESETS.map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                className={`text-[11px] py-1.5 px-2 rounded-lg border transition-all flex items-center justify-center gap-1.5 text-center ${
                  selectedFormat === fmt.id
                    ? 'bg-primary/10 text-primary border-primary font-semibold shadow-xs'
                    : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground'
                }`}
              >
                <fmt.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate leading-tight">{fmt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style Chips */}
        <div>
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <Palette className="h-3.5 w-3.5 text-primary" /> Visual Theme
          </label>
          <div className="flex flex-wrap gap-1.5">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyle(style.id)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 ${
                  selectedStyle === style.id
                    ? 'bg-primary text-primary-foreground border-primary font-medium shadow-sm'
                    : 'bg-muted/50 text-foreground border-border hover:bg-muted'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${style.color}`}></span>
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Form */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">Describe your graphic</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSurpriseMe}
              className="h-6 px-2 text-xs text-primary hover:text-primary"
            >
              <Shuffle className="mr-1 h-3 w-3" /> Surprise me
            </Button>
          </div>

          <Textarea
            placeholder="e.g. Educational infographic for a cloud computing roadmap with 5 learning stages"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="resize-none text-sm"
          />

          <Button
            type="button"
            disabled={isLoading}
            onClick={() => handleGenerate()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Designing Custom Graphic...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Custom Graphic
              </>
            )}
          </Button>
        </div>

        {/* Inspiration Chips */}
        {!prompt && (
          <div className="pt-1">
            <span className="text-[11px] font-medium text-muted-foreground block mb-1.5">Custom Graphic Ideas:</span>
            <div className="flex flex-col gap-1">
              {INSPIRATION_PROMPTS.slice(0, 4).map((insp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(insp);
                    if (insp.toLowerCase().includes('roadmap') || insp.toLowerCase().includes('diagram')) {
                      setSelectedFormat('infographic');
                      handleGenerate(insp, selectedStyle, 'infographic');
                    } else {
                      handleGenerate(insp);
                    }
                  }}
                  className="text-left text-xs p-1.5 rounded bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors truncate"
                  title={insp}
                >
                  <Sparkles className="inline-block mr-1.5 h-3 w-3 text-amber-500" />
                  {insp}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground py-8">
          <div className="relative mb-3">
            <Wand2 className="h-10 w-10 text-primary animate-pulse" />
            <Loader2 className="h-14 w-14 text-primary/40 animate-spin absolute -top-2 -left-2" />
          </div>
          <p className="text-sm font-semibold text-foreground">Generating Custom Architecture & Structure</p>
          <p className="text-xs text-muted-foreground mt-1">Balancing milestones, hierarchy & visual depth...</p>
        </div>
      )}

      {!isLoading && generatedLayouts.length > 0 && (
        <div className="flex-grow mt-2">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Generated Layouts ({generatedLayouts.length})
              </h3>
            </div>
            {generatedLayouts.map((layout, index) => (
              <Card
                key={layout.id || index}
                className="overflow-hidden border border-border/70 hover:border-primary transition-all shadow-sm group"
              >
                <div
                  className="h-16 w-full relative flex items-center justify-center border-b p-2 overflow-hidden"
                  style={{ backgroundColor: layout.canvasBackgroundColor || '#1E293B' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <span className="text-xs font-bold text-white drop-shadow truncate max-w-[260px]">
                      {layout.elements.find((e) => e.type === 'text')?.content || 'Custom Graphic'}
                    </span>
                    <span className="text-[10px] text-white/80">
                      {layout.pages && layout.pages.length > 1
                        ? `${layout.pages.length} Carousel Slides • ${layout.elements.length} items on cover`
                        : `${layout.elements.length} components • ${layout.canvasBackgroundColor || 'Default BG'}`}
                    </span>
                  </div>
                </div>

                <CardContent className="p-3 text-xs">
                  <p className="font-medium text-foreground line-clamp-2 leading-relaxed">{layout.description}</p>
                </CardContent>

                <CardFooter className="p-3 pt-0">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      onLayoutSelect(layout);
                      const slideCount = layout.pages?.length || 1;
                      toast({
                        title: slideCount > 1 ? `${slideCount}-Slide Carousel Loaded` : 'Custom Graphic Loaded',
                        description:
                          slideCount > 1
                            ? 'Use the bottom carousel dock to navigate, edit, duplicate, or add slides.'
                            : 'Editable on your canvas. Click any step, card or text to modify.',
                      });
                    }}
                    className="w-full text-xs"
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Load to Canvas
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
