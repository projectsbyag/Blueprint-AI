'use client';

import { Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { DesignLayout as ClientDesignLayout, DesignElement } from '@/types/blueprint';
import { addIdsToLayout } from '@/components/canvas/Canvas';
import { useToast } from '@/hooks/use-toast';

interface TemplateLibraryProps {
  onLayoutSelect: (layout: ClientDesignLayout) => void;
}

const predefinedTemplates: Array<{
  description: string;
  category?: string;
  canvasBackgroundColor?: string;
  elements: Omit<DesignElement, 'id'>[];
  pages?: Array<{
    id?: string;
    title?: string;
    canvasBackgroundColor?: string;
    elements: Omit<DesignElement, 'id'>[];
  }>;
  activePageIndex?: number;
}> = [
  {
    description: 'Product Launch Carousel (3 Slides)',
    category: 'Carousel Deck',
    canvasBackgroundColor: '#0A0E1A',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.4)', zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 90 },
        size: { width: 200, height: 40 },
        style: { backgroundColor: '#2563EB', borderRadius: '9999px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 90, y: 98 },
        size: { width: 200, height: 32 },
        content: 'SLIDE 1 OF 3',
        style: { color: '#FFFFFF', fontSize: '13px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 90, y: 190 },
        size: { width: 820, height: 160 },
        content: 'INTRODUCING THE NEXT GENERATION',
        style: { color: '#60A5FA', fontSize: '54px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.05', letterSpacing: '-1px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 90, y: 380 },
        size: { width: 800, height: 90 },
        content: 'Built from first principles for unprecedented performance, instant responsiveness, and seamless multi-device collaboration.',
        style: { color: '#94A3B8', fontSize: '22px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 520 },
        size: { width: 820, height: 260 },
        style: { backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid #334155', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 130, y: 550 },
        size: { width: 740, height: 200 },
        content: '⚡ Sub-10ms Global Latency Across 28 Edge Regions\n\n🔒 Zero-Trust End-to-End Cryptographic Security\n\n📈 99.999% SLA High-Availability Distributed Core',
        style: { color: '#F1F5F9', fontSize: '19px', lineHeight: '1.8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '700', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 820 },
        size: { width: 280, height: 50 },
        style: { backgroundColor: '#3B82F6', borderRadius: '12px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 90, y: 832 },
        size: { width: 280, height: 35 },
        content: 'SWIPE FOR DETAILS →',
        style: { color: '#FFFFFF', fontSize: '15px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', zIndex: 3 },
      },
    ],
    pages: [
      {
        title: 'Slide 1: Overview',
        canvasBackgroundColor: '#0A0E1A',
        elements: [
          {
            type: 'shape',
            position: { x: 50, y: 50 },
            size: { width: 900, height: 900 },
            style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.4)', zIndex: 1 },
          },
          {
            type: 'shape',
            position: { x: 90, y: 90 },
            size: { width: 200, height: 40 },
            style: { backgroundColor: '#2563EB', borderRadius: '9999px', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 90, y: 98 },
            size: { width: 200, height: 32 },
            content: 'SLIDE 1 OF 3',
            style: { color: '#FFFFFF', fontSize: '13px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 90, y: 190 },
            size: { width: 820, height: 160 },
            content: 'INTRODUCING THE NEXT GENERATION',
            style: { color: '#60A5FA', fontSize: '54px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.05', letterSpacing: '-1px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 90, y: 380 },
            size: { width: 800, height: 90 },
            content: 'Built from first principles for unprecedented performance, instant responsiveness, and seamless multi-device collaboration.',
            style: { color: '#94A3B8', fontSize: '22px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 90, y: 520 },
            size: { width: 820, height: 260 },
            style: { backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid #334155', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 130, y: 550 },
            size: { width: 740, height: 200 },
            content: '⚡ Sub-10ms Global Latency Across 28 Edge Regions\n\n🔒 Zero-Trust End-to-End Cryptographic Security\n\n📈 99.999% SLA High-Availability Distributed Core',
            style: { color: '#F1F5F9', fontSize: '19px', lineHeight: '1.8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '700', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 90, y: 820 },
            size: { width: 280, height: 50 },
            style: { backgroundColor: '#3B82F6', borderRadius: '12px', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 90, y: 832 },
            size: { width: 280, height: 35 },
            content: 'SWIPE FOR DETAILS →',
            style: { color: '#FFFFFF', fontSize: '15px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', zIndex: 3 },
          },
        ],
      },
      {
        title: 'Slide 2: Benchmarks',
        canvasBackgroundColor: '#0A0E1A',
        elements: [
          {
            type: 'shape',
            position: { x: 50, y: 50 },
            size: { width: 900, height: 900 },
            style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.4)', zIndex: 1 },
          },
          {
            type: 'text',
            position: { x: 80, y: 90 },
            size: { width: 300, height: 30 },
            content: 'SLIDE 2 OF 3 • ARCHITECTURE',
            style: { color: '#34D399', fontSize: '14px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 80, y: 130 },
            size: { width: 840, height: 70 },
            content: 'ENGINEERED FOR PEAK SPEED',
            style: { color: '#FFFFFF', fontSize: '46px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 230 },
            size: { width: 840, height: 160 },
            style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #10B981', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 120, y: 255 },
            size: { width: 760, height: 35 },
            content: '10X LOWER MEMORY FOOTPRINT',
            style: { color: '#6EE7B7', fontSize: '22px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 120, y: 295 },
            size: { width: 760, height: 60 },
            content: 'Native compiled binaries eliminate runtime overhead, reducing cold starts to under 15 milliseconds globally.',
            style: { color: '#CBD5E1', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 420 },
            size: { width: 840, height: 160 },
            style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #3B82F6', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 120, y: 445 },
            size: { width: 760, height: 35 },
            content: 'ZERO CONFIGURATION AUTOMATION',
            style: { color: '#93C5FD', fontSize: '22px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 120, y: 485 },
            size: { width: 760, height: 60 },
            content: 'Continuous deployment pipelines synchronize state without manual provisioning or server restarts.',
            style: { color: '#CBD5E1', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 610 },
            size: { width: 840, height: 160 },
            style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #F59E0B', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 120, y: 635 },
            size: { width: 760, height: 35 },
            content: 'ENTERPRISE COMPLIANCE EMBEDDED',
            style: { color: '#FCD34D', fontSize: '22px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 120, y: 675 },
            size: { width: 760, height: 60 },
            content: 'SOC2 Type II, HIPAA & GDPR compliance out of the box with automated audit trails.',
            style: { color: '#CBD5E1', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
          },
        ],
      },
      {
        title: 'Slide 3: Getting Started',
        canvasBackgroundColor: '#0A0E1A',
        elements: [
          {
            type: 'shape',
            position: { x: 50, y: 50 },
            size: { width: 900, height: 900 },
            style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.4)', zIndex: 1 },
          },
          {
            type: 'text',
            position: { x: 80, y: 90 },
            size: { width: 300, height: 30 },
            content: 'SLIDE 3 OF 3 • GET STARTED',
            style: { color: '#FBBF24', fontSize: '14px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 80, y: 130 },
            size: { width: 840, height: 70 },
            content: 'DEPLOY IN UNDER 60 SECONDS',
            style: { color: '#FFFFFF', fontSize: '46px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 240 },
            size: { width: 840, height: 420 },
            style: { backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid #334155', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 120, y: 280 },
            size: { width: 760, height: 340 },
            content: '1. Connect your GitHub or GitLab repository\n\n2. Automatic framework detection & build optimization\n\n3. Instant preview environment with unique shareable URL\n\n4. Global production deployment with 1-click domain mapping\n\n5. Real-time telemetry, error monitoring, and traffic analytics',
            style: { color: '#F8FAFC', fontSize: '20px', lineHeight: '2.0', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 700 },
            size: { width: 840, height: 90 },
            style: { backgroundColor: '#2563EB', borderRadius: '16px', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 100, y: 730 },
            size: { width: 800, height: 35 },
            content: 'START YOUR FREE DEVELOPER TIER TODAY →',
            style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
        ],
      },
    ],
  },
  {
    description: 'AI & Tech Keynote Summit 2026',
    category: 'Technology',
    canvasBackgroundColor: '#090D16',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.3)', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 100, y: 110 },
        size: { width: 300, height: 36 },
        content: 'ANNUAL GLOBAL SUMMIT',
        style: { color: '#60A5FA', fontSize: '14px', fontWeight: '800', letterSpacing: '3px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 160 },
        size: { width: 800, height: 130 },
        content: 'THE FUTURE OF ARTIFICIAL INTELLIGENCE',
        style: { color: '#FFFFFF', fontSize: '52px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.1', zIndex: 3 },
      },
      {
        type: 'image',
        position: { x: 100, y: 320 },
        size: { width: 800, height: 420 },
        source: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
        content: 'Tech Summit Stage',
        style: { borderRadius: '16px', zIndex: 2 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 790 },
        size: { width: 260, height: 60 },
        style: { backgroundColor: '#2563EB', borderRadius: '12px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 800 },
        size: { width: 260, height: 40 },
        content: 'REGISTER NOW',
        style: { color: '#FFFFFF', fontSize: '18px', fontWeight: '700', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
      {
        type: 'text',
        position: { x: 400, y: 805 },
        size: { width: 500, height: 40 },
        content: 'OCTOBER 24-26 • METROPOLIS CENTER',
        style: { color: '#94A3B8', fontSize: '16px', fontWeight: '600', textAlign: 'right', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
    ],
  },
  {
    description: 'Artisan Bakery & Café Opening',
    category: 'Food & Beverage',
    canvasBackgroundColor: '#FBF8F3',
    elements: [
      {
        type: 'image',
        position: { x: 80, y: 80 },
        size: { width: 840, height: 460 },
        source: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
        content: 'Fresh Sourdough Bread',
        style: { borderRadius: '24px', zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 140, y: 500 },
        size: { width: 720, height: 380 },
        style: { backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E5E7EB', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 170, y: 540 },
        size: { width: 660, height: 30 },
        content: 'ORGANIC • STONE-MILLED • HOMEMADE',
        style: { color: '#D97706', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 170, y: 580 },
        size: { width: 660, height: 80 },
        content: 'Artisan Bakehouse Grand Opening',
        style: { color: '#1C1917', fontSize: '42px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 190, y: 670 },
        size: { width: 620, height: 60 },
        content: 'Join us this Saturday for complimentary espresso with any fresh sourdough pastry.',
        style: { color: '#78716C', fontSize: '18px', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 350, y: 760 },
        size: { width: 300, height: 50 },
        style: { backgroundColor: '#B45309', borderRadius: '9999px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 350, y: 770 },
        size: { width: 300, height: 30 },
        content: 'CLAIM 20% DISCOUNT',
        style: { color: '#FFFFFF', fontSize: '14px', fontWeight: '700', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 4 },
      },
    ],
  },
  {
    description: 'Cyberpunk Neon Music Festival',
    category: 'Entertainment',
    canvasBackgroundColor: '#120224',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#21094E', borderRadius: '32px', border: '2px solid #E056FD', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 80, y: 120 },
        size: { width: 840, height: 110 },
        content: 'SYNTHWAVE 2099',
        style: { color: '#F368E0', fontSize: '68px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '4px', zIndex: 3 },
      },
      {
        type: 'image',
        position: { x: 120, y: 250 },
        size: { width: 760, height: 420 },
        source: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
        content: 'Music festival lights',
        style: { borderRadius: '20px', border: '2px solid #FF9FF3', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 100, y: 710 },
        size: { width: 800, height: 40 },
        content: 'LIVE ELECTRONIC • RETRO FUTURE • VISUALS',
        style: { color: '#FECA57', fontSize: '20px', fontWeight: '800', textAlign: 'center', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 280, y: 780 },
        size: { width: 440, height: 60 },
        style: { backgroundColor: '#FF4757', borderRadius: '9999px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 280, y: 792 },
        size: { width: 440, height: 36 },
        content: 'GET TICKETS NOW',
        style: { color: '#FFFFFF', fontSize: '18px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
    ],
  },
  {
    description: 'Flash Mega Weekend Sale - 50% Off',
    category: 'Retail & Sale',
    canvasBackgroundColor: '#991B1B',
    elements: [
      {
        type: 'shape',
        position: { x: 60, y: 60 },
        size: { width: 880, height: 880 },
        style: { backgroundColor: '#DC2626', borderRadius: '24px', border: '3px solid #FEF08A', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 100, y: 130 },
        size: { width: 800, height: 60 },
        content: 'THIS WEEKEND ONLY',
        style: { color: '#FEF08A', fontSize: '24px', fontWeight: '900', textAlign: 'center', letterSpacing: '4px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 200 },
        size: { width: 800, height: 160 },
        content: 'MEGA SALE 50% OFF',
        style: { color: '#FFFFFF', fontSize: '72px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.05', zIndex: 3 },
      },
      {
        type: 'image',
        position: { x: 140, y: 390 },
        size: { width: 720, height: 350 },
        source: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80',
        content: 'Fashion sale items',
        style: { borderRadius: '16px', zIndex: 2 },
      },
      {
        type: 'shape',
        position: { x: 260, y: 770 },
        size: { width: 480, height: 64 },
        style: { backgroundColor: '#FEF08A', borderRadius: '9999px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 260, y: 785 },
        size: { width: 480, height: 34 },
        content: 'SHOP ONLINE & IN STORE',
        style: { color: '#991B1B', fontSize: '20px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
    ],
  },
];

export function TemplateLibrary({ onLayoutSelect }: TemplateLibraryProps) {
  const { toast } = useToast();

  const handleSelectTemplate = (templateSchema: any) => {
    const layoutWithIds = addIdsToLayout(templateSchema);
    onLayoutSelect(layoutWithIds);
    const count = layoutWithIds.pages?.length || 1;
    toast({
      title: count > 1 ? `${count}-Slide Carousel Applied` : 'Template Applied',
      description: `"${layoutWithIds.description}" is ready to edit on canvas.`,
    });
  };

  return (
    <div className="p-4 space-y-4 flex flex-col min-h-full overflow-y-auto">
      <div>
        <h2 className="text-sm font-bold font-headline">Featured Templates</h2>
        <p className="text-xs text-muted-foreground">Select a high-converting baseline layout</p>
      </div>

      <div className="grid grid-cols-1 gap-3 overflow-y-auto flex-grow pr-1">
        {predefinedTemplates.map((template, index) => (
          <Card
            key={index}
            className="overflow-hidden border border-border/70 hover:border-primary transition-all shadow-sm group"
          >
            {/* Color banner */}
            <div
              className="h-12 w-full flex items-center justify-between px-3 text-white relative overflow-hidden"
              style={{ backgroundColor: template.canvasBackgroundColor || '#1E293B' }}
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <span className="relative z-10 text-[11px] font-bold uppercase tracking-wider">
                {template.category}
              </span>
              <Sparkles className="relative z-10 h-3.5 w-3.5 text-white/80" />
            </div>

            <CardContent className="p-3 text-xs">
              <h3 className="font-semibold text-foreground line-clamp-1">{template.description}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {template.pages && template.pages.length > 1
                  ? `${template.pages.length} Slides Carousel • Canvas: ${template.canvasBackgroundColor}`
                  : `${template.elements.length} components • Canvas: ${template.canvasBackgroundColor}`}
              </p>
            </CardContent>

            <CardFooter className="p-3 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectTemplate(template)}
                className="w-full text-xs h-8"
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Apply Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
