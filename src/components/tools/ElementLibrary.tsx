'use client';

import { useState } from 'react';
import {
  Type,
  Square,
  Image as ImageIcon,
  Circle,
  Minus,
  Tag,
  MousePointerClick,
  ArrowRight,
  ArrowLeft,
  MoveHorizontal,
  Triangle,
  Star,
  Award,
  MessageSquare,
  Sparkles,
  Layers,
  Code,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DesignElement } from '@/types/blueprint';
import { useToast } from '@/hooks/use-toast';

interface ElementLibraryProps {
  onAddElement: (elementSchema: Omit<DesignElement, 'id'>) => void;
}

export function ElementLibrary({ onAddElement }: ElementLibraryProps) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Text Elements
  const addHeroHeadline = () => {
    onAddElement({
      type: 'text',
      position: { x: 100, y: 320 },
      size: { width: 800, height: 110 },
      content: 'TRANSFORM YOUR IDEAS',
      style: {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '60px',
        fontWeight: '900',
        color: '#0F172A',
        textAlign: 'center',
        lineHeight: '1.05',
        letterSpacing: '-1px',
        zIndex: 5,
      },
    });
    toast({ title: 'Headline Added' });
  };

  const addSubtitle = () => {
    onAddElement({
      type: 'text',
      position: { x: 150, y: 450 },
      size: { width: 700, height: 60 },
      content: 'A comprehensive, modern solution built for high-performance creative workflows.',
      style: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '20px',
        fontWeight: '400',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: '1.5',
        zIndex: 5,
      },
    });
    toast({ title: 'Subtitle Added' });
  };

  const addCodeSnippet = () => {
    onAddElement({
      type: 'text',
      position: { x: 200, y: 400 },
      size: { width: 600, height: 70 },
      content: 'npm install @blueprint/design-system',
      style: {
        fontFamily: 'Courier New, monospace',
        fontSize: '18px',
        fontWeight: '700',
        color: '#38BDF8',
        backgroundColor: '#0F172A',
        borderRadius: '12px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#1E293B',
        textAlign: 'center',
        padding: '16px',
        zIndex: 4,
      },
    });
    toast({ title: 'Code Block Added' });
  };

  // 2. Shapes
  const addCardContainer = () => {
    onAddElement({
      type: 'shape',
      position: { x: 120, y: 180 },
      size: { width: 760, height: 640 },
      style: {
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#E2E8F0',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08)',
        zIndex: 1,
      },
    });
    toast({ title: 'Card Container Added' });
  };

  const addGlassmorphicCard = () => {
    onAddElement({
      type: 'shape',
      position: { x: 150, y: 220 },
      size: { width: 700, height: 560 },
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        borderRadius: '28px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(255, 255, 255, 0.6)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        zIndex: 2,
      },
    });
    toast({ title: 'Glassmorphic Card Added' });
  };

  const addCircle = () => {
    onAddElement({
      type: 'shape',
      position: { x: 400, y: 400 },
      size: { width: 200, height: 200 },
      style: {
        backgroundColor: '#3B82F6',
        borderRadius: '9999px',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
        zIndex: 3,
      },
    });
    toast({ title: 'Circle Added' });
  };

  const addPillBadge = () => {
    onAddElement({
      type: 'shape',
      position: { x: 380, y: 260 },
      size: { width: 240, height: 46 },
      style: {
        backgroundColor: '#2563EB',
        borderRadius: '9999px',
        zIndex: 4,
      },
    });
    toast({ title: 'Pill Shape Added' });
  };

  const addTriangle = () => {
    onAddElement({
      type: 'shape',
      position: { x: 420, y: 380 },
      size: { width: 160, height: 160 },
      style: {
        backgroundColor: '#F59E0B',
        shapeType: 'triangle',
        zIndex: 3,
      },
    });
    toast({ title: 'Triangle Shape Added' });
  };

  const addStar = () => {
    onAddElement({
      type: 'shape',
      position: { x: 420, y: 380 },
      size: { width: 160, height: 160 },
      style: {
        backgroundColor: '#FBBF24',
        shapeType: 'star',
        boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
        zIndex: 4,
      },
    });
    toast({ title: 'Star Badge Added' });
  };

  const addBadgeRibbon = () => {
    onAddElement({
      type: 'shape',
      position: { x: 400, y: 360 },
      size: { width: 200, height: 200 },
      style: {
        backgroundColor: '#EC4899',
        shapeType: 'badge-ribbon',
        zIndex: 4,
      },
    });
    toast({ title: 'Starburst Ribbon Added' });
  };

  const addQuoteBubble = () => {
    onAddElement({
      type: 'shape',
      position: { x: 250, y: 320 },
      size: { width: 500, height: 320 },
      style: {
        backgroundColor: '#0F172A',
        shapeType: 'quote-bubble',
        zIndex: 2,
      },
    });
    toast({ title: 'Speech Bubble Added' });
  };

  // 3. Arrows & Pointers
  const addArrowRight = () => {
    onAddElement({
      type: 'shape',
      position: { x: 350, y: 460 },
      size: { width: 300, height: 90 },
      style: {
        backgroundColor: '#3B82F6',
        shapeType: 'arrow-right',
        zIndex: 4,
      },
    });
    toast({ title: 'Right Arrow Added' });
  };

  const addArrowLeft = () => {
    onAddElement({
      type: 'shape',
      position: { x: 350, y: 460 },
      size: { width: 300, height: 90 },
      style: {
        backgroundColor: '#3B82F6',
        shapeType: 'arrow-left',
        zIndex: 4,
      },
    });
    toast({ title: 'Left Arrow Added' });
  };

  const addDoubleArrow = () => {
    onAddElement({
      type: 'shape',
      position: { x: 320, y: 460 },
      size: { width: 360, height: 80 },
      style: {
        backgroundColor: '#10B981',
        shapeType: 'double-arrow',
        zIndex: 4,
      },
    });
    toast({ title: 'Bidirectional Arrow Added' });
  };

  // 4. Lines & Dividers
  const addSolidDivider = () => {
    onAddElement({
      type: 'shape',
      position: { x: 300, y: 500 },
      size: { width: 400, height: 4 },
      style: {
        backgroundColor: '#CBD5E1',
        borderRadius: '2px',
        zIndex: 3,
      },
    });
    toast({ title: 'Solid Line Added' });
  };

  const addDashedDivider = () => {
    onAddElement({
      type: 'shape',
      position: { x: 250, y: 500 },
      size: { width: 500, height: 4 },
      style: {
        backgroundColor: 'transparent',
        borderWidth: '2px',
        borderStyle: 'dashed',
        borderColor: '#94A3B8',
        zIndex: 3,
      },
    });
    toast({ title: 'Dashed Separator Added' });
  };

  const addGradientAccentBar = () => {
    onAddElement({
      type: 'shape',
      position: { x: 350, y: 500 },
      size: { width: 300, height: 8 },
      style: {
        backgroundColor: '#3B82F6',
        borderRadius: '9999px',
        boxShadow: '0 0 16px rgba(59, 130, 246, 0.6)',
        zIndex: 3,
      },
    });
    toast({ title: 'Accent Bar Added' });
  };

  // 5. Badges & Tags
  const addStepNumberBadge = () => {
    onAddElement({
      type: 'shape',
      position: { x: 460, y: 300 },
      size: { width: 80, height: 80 },
      style: {
        backgroundColor: '#0F172A',
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: '#38BDF8',
        borderRadius: '9999px',
        zIndex: 5,
      },
    });
    onAddElement({
      type: 'text',
      position: { x: 460, y: 318 },
      size: { width: 80, height: 44 },
      content: '01',
      style: {
        color: '#38BDF8',
        fontSize: '28px',
        fontWeight: '900',
        textAlign: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
        zIndex: 6,
      },
    });
    toast({ title: 'Step Badge Added' });
  };

  const addVerifiedCheckPill = () => {
    onAddElement({
      type: 'shape',
      position: { x: 370, y: 350 },
      size: { width: 260, height: 44 },
      style: {
        backgroundColor: '#ECFDF5',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#10B981',
        borderRadius: '9999px',
        zIndex: 4,
      },
    });
    onAddElement({
      type: 'text',
      position: { x: 370, y: 360 },
      size: { width: 260, height: 30 },
      content: '✓ VERIFIED PARTNER',
      style: {
        color: '#059669',
        fontSize: '13px',
        fontWeight: '800',
        textAlign: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
        letterSpacing: '1px',
        zIndex: 5,
      },
    });
    toast({ title: 'Verified Badge Added' });
  };

  const addLiveStatusDot = () => {
    onAddElement({
      type: 'shape',
      position: { x: 420, y: 350 },
      size: { width: 160, height: 38 },
      style: {
        backgroundColor: '#0F172A',
        borderRadius: '9999px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#334155',
        zIndex: 4,
      },
    });
    onAddElement({
      type: 'text',
      position: { x: 420, y: 358 },
      size: { width: 160, height: 26 },
      content: '🟢 SYSTEM LIVE',
      style: {
        color: '#4ADE80',
        fontSize: '12px',
        fontWeight: '800',
        textAlign: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
        letterSpacing: '1px',
        zIndex: 5,
      },
    });
    toast({ title: 'Live Status Dot Added' });
  };

  // 6. CTAs & Buttons
  const addPrimaryCTAButton = () => {
    onAddElement({
      type: 'shape',
      position: { x: 350, y: 560 },
      size: { width: 300, height: 60 },
      style: {
        backgroundColor: '#2563EB',
        borderRadius: '14px',
        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
        zIndex: 4,
      },
    });
    onAddElement({
      type: 'text',
      position: { x: 350, y: 576 },
      size: { width: 300, height: 32 },
      content: 'GET STARTED TODAY →',
      style: {
        color: '#FFFFFF',
        fontSize: '16px',
        fontWeight: '800',
        textAlign: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
        letterSpacing: '0.5px',
        zIndex: 5,
      },
    });
    toast({ title: 'CTA Button Added' });
  };

  const addOutlineButton = () => {
    onAddElement({
      type: 'shape',
      position: { x: 360, y: 560 },
      size: { width: 280, height: 56 },
      style: {
        backgroundColor: 'transparent',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#0F172A',
        borderRadius: '9999px',
        zIndex: 4,
      },
    });
    onAddElement({
      type: 'text',
      position: { x: 360, y: 575 },
      size: { width: 280, height: 30 },
      content: 'LEARN MORE',
      style: {
        color: '#0F172A',
        fontSize: '14px',
        fontWeight: '800',
        textAlign: 'center',
        fontFamily: 'Space Grotesk, sans-serif',
        letterSpacing: '1px',
        zIndex: 5,
      },
    });
    toast({ title: 'Outline Button Added' });
  };

  // 7. Imagery
  const addStockPhoto = () => {
    onAddElement({
      type: 'image',
      position: { x: 150, y: 250 },
      size: { width: 700, height: 440 },
      source: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      content: 'Tech Stage',
      style: {
        borderRadius: '20px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
        zIndex: 2,
      },
    });
    toast({ title: 'Stock Image Added' });
  };

  const allElements = [
    // Shapes
    { id: 'card-container', category: 'shapes', name: 'Card Container', desc: 'Rounded background', icon: Square, action: addCardContainer },
    { id: 'glass-card', category: 'shapes', name: 'Glass Card', desc: 'Frosted blur frame', icon: Layers, action: addGlassmorphicCard },
    { id: 'circle-shape', category: 'shapes', name: 'Circle Accent', desc: 'Circular shape', icon: Circle, action: addCircle },
    { id: 'pill-shape', category: 'shapes', name: 'Pill Shape', desc: 'Capsule container', icon: Tag, action: addPillBadge },
    { id: 'triangle-shape', category: 'shapes', name: 'Triangle', desc: 'Sharp vector triangle', icon: Triangle, action: addTriangle },
    { id: 'star-badge', category: 'shapes', name: '5-Point Star', desc: 'Celebration star', icon: Star, action: addStar },
    { id: 'badge-ribbon', category: 'shapes', name: 'Starburst Ribbon', desc: 'Special promo seal', icon: Award, action: addBadgeRibbon },
    { id: 'quote-bubble', category: 'shapes', name: 'Quote Bubble', desc: 'Speech callout', icon: MessageSquare, action: addQuoteBubble },

    // Arrows
    { id: 'arrow-right', category: 'arrows', name: 'Right Arrow', desc: 'Directional pointer', icon: ArrowRight, action: addArrowRight },
    { id: 'arrow-left', category: 'arrows', name: 'Left Arrow', desc: 'Back indicator', icon: ArrowLeft, action: addArrowLeft },
    { id: 'double-arrow', category: 'arrows', name: 'Double Arrow', desc: 'Flow connector', icon: MoveHorizontal, action: addDoubleArrow },

    // Lines & Dividers
    { id: 'solid-divider', category: 'lines', name: 'Solid Divider', desc: 'Clean horizontal rule', icon: Minus, action: addSolidDivider },
    { id: 'dashed-divider', category: 'lines', name: 'Dashed Line', desc: 'Blueprint dash', icon: Minus, action: addDashedDivider },
    { id: 'accent-bar', category: 'lines', name: 'Accent Bar', desc: 'Glowing separator', icon: Sparkles, action: addGradientAccentBar },

    // Badges & Tags
    { id: 'step-badge', category: 'badges', name: 'Step Number (01)', desc: 'Roadmap step marker', icon: CheckCircle, action: addStepNumberBadge },
    { id: 'verified-badge', category: 'badges', name: 'Verified Pill', desc: 'Trust badge', icon: Award, action: addVerifiedCheckPill },
    { id: 'live-dot', category: 'badges', name: 'Live Status Dot', desc: 'Activity indicator', icon: Circle, action: addLiveStatusDot },

    // Text & CTAs
    { id: 'hero-headline', category: 'text', name: 'Hero Headline', desc: 'Large title (60px)', icon: Type, action: addHeroHeadline },
    { id: 'subtitle-text', category: 'text', name: 'Subtitle / Body', desc: 'Paragraph text (20px)', icon: Type, action: addSubtitle },
    { id: 'code-snippet', category: 'text', name: 'Code Snippet', desc: 'Monospace terminal block', icon: Code, action: addCodeSnippet },
    { id: 'primary-cta', category: 'text', name: 'Primary CTA Button', desc: 'High-contrast trigger', icon: MousePointerClick, action: addPrimaryCTAButton },
    { id: 'outline-cta', category: 'text', name: 'Outline Button', desc: 'Ghost pill button', icon: MousePointerClick, action: addOutlineButton },

    // Images
    { id: 'stock-photo', category: 'images', name: 'Stock Photo', desc: 'Unsplash visual card', icon: ImageIcon, action: addStockPhoto },
  ];

  const categories = [
    { id: 'all', label: 'All Elements' },
    { id: 'shapes', label: 'Shapes' },
    { id: 'arrows', label: 'Arrows' },
    { id: 'lines', label: 'Lines' },
    { id: 'badges', label: 'Badges' },
    { id: 'text', label: 'Typography' },
  ];

  const filteredElements = allElements.filter((el) => {
    const matchesCategory = selectedCategory === 'all' || el.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 space-y-3.5 flex flex-col min-h-full overflow-y-auto">
      <div className="space-y-0.5">
        <h2 className="text-sm font-bold font-headline text-foreground leading-tight">Element Library</h2>
        <p className="text-xs text-muted-foreground leading-normal break-words">
          Shapes, vector arrows, badges, and typography
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search elements & shapes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 text-xs bg-muted/40"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 text-[11px] rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Elements Grid - No clipping, generous vertical padding, natural line-height */}
      <div className="grid grid-cols-2 gap-2.5 overflow-y-auto flex-grow pr-1 pb-4">
        {filteredElements.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.action}
            className="flex flex-col items-center justify-center min-h-[96px] h-auto p-2.5 text-center rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 active:scale-[0.98] transition-all group cursor-pointer shadow-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shrink-0">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground leading-normal block w-full px-0.5 text-center">
              {item.name}
            </span>
            <span className="text-[10px] text-muted-foreground leading-snug block mt-0.5 w-full px-0.5 text-center">
              {item.desc}
            </span>
          </button>
        ))}

        {filteredElements.length === 0 && (
          <div className="col-span-2 py-8 text-center text-xs text-muted-foreground">
            No elements found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
