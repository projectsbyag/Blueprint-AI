'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  LayoutTemplate,
  MousePointer2,
  Type,
  Layers,
  Download,
  ArrowRight,
  Check,
  RotateCw,
  FolderPlus,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Maximize2,
} from 'lucide-react';

export function FeatureShowcase() {
  // Interactive Copy Rewriter Mockup State
  const [copyTone, setCopyTone] = useState<'punchy' | 'executive' | 'minimal'>('punchy');
  const copySamples = {
    punchy: {
      draft: 'We make software for designing graphics easily.',
      result: 'IDEAS INTO DESIGNS. INSTANTLY.',
      metric: '3.4x higher headline click-through rate',
    },
    executive: {
      draft: 'We make software for designing graphics easily.',
      result: 'ENTERPRISE CREATIVE ARCHITECTURE FOR HIGH-IMPACT VISUAL STORYTELLING.',
      metric: 'Engineered for founders & executive communications',
    },
    minimal: {
      draft: 'We make software for designing graphics easily.',
      result: 'PRECISION GRAPHICS. ZERO FRICTION.',
      metric: 'Clean, unencumbered visual clarity',
    },
  };

  // Interactive AI Generation Prompt Simulator State
  const [activePromptCategory, setActivePromptCategory] = useState<'carousel' | 'launch' | 'pricing'>('carousel');
  const promptScenarios = {
    carousel: {
      prompt: '3-slide developer roadmap explaining our new vector engine architecture',
      slides: 3,
      palette: 'Dark Cobalt & Neon Cyan',
      structure: 'Title Slide + Step Infographic + Call to Action',
    },
    launch: {
      prompt: 'Bold announcement flyer for Series A funding and global expansion',
      slides: 1,
      palette: 'Obsidian Black & Marigold Accent',
      structure: 'Hero Banner + Key Numbers Grid + Executive Quote',
    },
    pricing: {
      prompt: '2-tier pricing comparison card highlighting Pro Plan with badge',
      slides: 1,
      palette: 'Clean Blueprint Paper & Slate',
      structure: 'Dual Column Matrix + Feature Checkmarks + Sign Up CTA',
    },
  };

  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header with Engineering Annotations */}
      <div className="flex flex-col items-center text-center mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 font-mono text-xs font-bold text-[#2563EB]">
          <span>SPECIFICATION // CORE CAPABILITIES</span>
          <span>·</span>
          <span>SYSTEM V2.4</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-[#1E293B] max-w-3xl leading-tight">
          Everything you need to bring ideas to life.
        </h2>

        <p className="text-base sm:text-lg text-[#64748B] max-w-2xl font-body leading-relaxed">
          From algorithmic structure synthesis to pixel-precise vector manipulation and multi-slide carousel publishing.
        </p>
      </div>

      {/* Bento-Grid with 6 Distinct Visual Treatments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. AI-Powered Design Generation */}
        <div className="rounded-2xl border-2 border-[#CBD5E1] bg-white p-6 shadow-sm hover:border-[#5B8DEF] transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold text-[#5B8DEF] tracking-wider uppercase">
                CAPABILITY // 01
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#5B8DEF]/10 flex items-center justify-center text-[#2563EB]">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-black font-headline text-[#1E293B] mb-2">
              AI-Powered Layout Generation
            </h3>
            <p className="text-sm text-[#64748B] mb-5 leading-relaxed">
              Describe your topic or announcement. Blueprint synthesizes balanced spatial hierarchy, typography scales, and cohesive accents in seconds.
            </p>
          </div>

          {/* Interactive Prompt Simulation Mockup */}
          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-[#64748B] pb-1.5 border-b border-[#E2E8F0]">
              <span>PROMPT SYNTHESIZER</span>
              <span className="text-[#2563EB] font-bold">READY</span>
            </div>

            {/* Prompt Selector Pills */}
            <div className="flex gap-1">
              {(['carousel', 'launch', 'pricing'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePromptCategory(key)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    activePromptCategory === key
                      ? 'bg-[#1E293B] text-white shadow-2xs'
                      : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Simulated Prompt Box */}
            <div className="p-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[#1E293B] text-[11px] leading-snug">
              &ldquo;{promptScenarios[activePromptCategory].prompt}&rdquo;
            </div>

            {/* Generated Tokens Telemetry */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-[#64748B] pt-1 border-t border-[#E2E8F0]">
              <div>
                <span className="text-slate-400">Pages: </span>
                <span className="font-bold text-[#1E293B]">{promptScenarios[activePromptCategory].slides} Slides</span>
              </div>
              <div>
                <span className="text-slate-400">Palette: </span>
                <span className="font-bold text-[#2563EB] truncate block">{promptScenarios[activePromptCategory].palette}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 16 Curated Design Templates */}
        <div className="rounded-2xl border-2 border-[#CBD5E1] bg-white p-6 shadow-sm hover:border-[#5B8DEF] transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold text-[#5B8DEF] tracking-wider uppercase">
                CAPABILITY // 02
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#5B8DEF]/10 flex items-center justify-center text-[#2563EB]">
                <LayoutTemplate className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-black font-headline text-[#1E293B] mb-2">
              16 Curated Design Templates
            </h3>
            <p className="text-sm text-[#64748B] mb-5 leading-relaxed">
              Never stare at an empty canvas. Choose from 16 production-tested templates across carousels, infographics, flyers, and announcements.
            </p>
          </div>

          {/* Blueprint Drawing Sheet Cards Mockup */}
          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-[#64748B] pb-1 border-b border-[#E2E8F0]">
              <span>DRAWING ARCHIVE // 16 PRESETS</span>
              <span className="text-emerald-600 font-bold">VERIFIED</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-white border border-[#CBD5E1] shadow-2xs space-y-1">
                <div className="w-full h-10 rounded bg-[#0A0E1A] p-1 flex flex-col justify-center text-[7px] text-white">
                  <span className="text-[#38BDF8] font-bold">SLIDE 01</span>
                  <span className="truncate">Product Launch</span>
                </div>
                <div className="text-[9px] font-bold text-[#1E293B] truncate">Product Launch Deck</div>
                <div className="text-[8px] text-[#64748B]">3 Slides · 1000px</div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-[#CBD5E1] shadow-2xs space-y-1">
                <div className="w-full h-10 rounded bg-[#FAF8F5] border border-amber-800/30 p-1 flex flex-col justify-center text-[7px] text-amber-900">
                  <span className="font-bold">CERTIFICATE</span>
                  <span className="truncate">Design Excellence</span>
                </div>
                <div className="text-[9px] font-bold text-[#1E293B] truncate">Certificate of Award</div>
                <div className="text-[8px] text-[#64748B]">Double Border · Gold</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] text-center">
              <Link
                href="#templates"
                className="text-[11px] font-sans font-bold text-[#2563EB] hover:underline flex items-center justify-center gap-1"
              >
                <span>Browse Full 16-Template Gallery</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Canva-Style Canvas Editing */}
        <div className="rounded-2xl border-2 border-[#CBD5E1] bg-white p-6 shadow-sm hover:border-[#5B8DEF] transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold text-[#5B8DEF] tracking-wider uppercase">
                CAPABILITY // 03
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#5B8DEF]/10 flex items-center justify-center text-[#2563EB]">
                <MousePointer2 className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-black font-headline text-[#1E293B] mb-2">
              8-Point Vector Precision Editing
            </h3>
            <p className="text-sm text-[#64748B] mb-5 leading-relaxed">
              Drag, align, and scale elements using 8 transform handles (corners + mid-sides). Group elements with Ctrl+G, re-order layers, and snap to grid.
            </p>
          </div>

          {/* Interactive Transform Widget Diagram */}
          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
              <span>8-HANDLE BOUNDING BOX</span>
              <span className="text-[#2563EB] font-bold">ACTIVE HOVER</span>
            </div>

            {/* Visual Transform Box */}
            <div className="relative h-20 rounded-lg bg-white border-2 border-[#2563EB] p-2 flex items-center justify-center shadow-xs">
              {/* 8 Handles */}
              <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 border-[#2563EB] rounded-2xs" />
              <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 border-[#2563EB] rounded-2xs" />
              <span className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 border-[#2563EB] rounded-2xs" />
              <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 border-[#2563EB] rounded-2xs" />
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-white border-2 border-[#2563EB] rounded-2xs" />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-white border-2 border-[#2563EB] rounded-2xs" />
              <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2.5 bg-white border-2 border-[#2563EB] rounded-2xs" />
              <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2.5 bg-white border-2 border-[#2563EB] rounded-2xs" />

              <div className="text-center font-bold text-[#1E293B] text-xs">
                CARD CONTAINER // 760 × 540 PX
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1">
              <span>SHORTCUT: CTRL+G (GROUP)</span>
              <span className="text-[#2563EB] font-bold">SNAP: 120PX</span>
            </div>
          </div>
        </div>

        {/* 4. Smart Typography & AI Copy Rewriting */}
        <div className="rounded-2xl border-2 border-[#CBD5E1] bg-white p-6 shadow-sm hover:border-[#5B8DEF] transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold text-[#5B8DEF] tracking-wider uppercase">
                CAPABILITY // 04
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#5B8DEF]/10 flex items-center justify-center text-[#2563EB]">
                <Type className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-black font-headline text-[#1E293B] mb-2">
              Smart Copy & Headline Rewriter
            </h3>
            <p className="text-sm text-[#64748B] mb-5 leading-relaxed">
              Stuck on words? Highlight any text layer to generate punchy, high-converting hooks, executive titles, and concise captions tailored to your audience.
            </p>
          </div>

          {/* Interactive Before & After Transformer */}
          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
              <span>TONE SELECTOR</span>
              <span className="text-[#2563EB] font-bold">GEMINI ENGINE</span>
            </div>

            {/* Tone Toggle */}
            <div className="flex gap-1">
              {(['punchy', 'executive', 'minimal'] as const).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setCopyTone(tone)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    copyTone === tone
                      ? 'bg-[#2563EB] text-white shadow-2xs'
                      : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  {tone.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Before / After Blocks */}
            <div className="space-y-1.5">
              <div className="p-2 rounded bg-white border border-[#E2E8F0] text-[10px] text-[#64748B]">
                <span className="text-red-500 font-bold block mb-0.5">ORIGINAL DRAFT:</span>
                &ldquo;{copySamples[copyTone].draft}&rdquo;
              </div>

              <div className="p-2 rounded bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 text-[11px] text-[#1E293B] font-bold">
                <span className="text-[#2563EB] font-bold block mb-0.5">AI REWRITE:</span>
                &ldquo;{copySamples[copyTone].result}&rdquo;
              </div>
            </div>

            <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>{copySamples[copyTone].metric}</span>
            </div>
          </div>
        </div>

        {/* 5. Multi-Slide Carousel Creation */}
        <div className="rounded-2xl border-2 border-[#CBD5E1] bg-white p-6 shadow-sm hover:border-[#5B8DEF] transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold text-[#5B8DEF] tracking-wider uppercase">
                CAPABILITY // 05
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#5B8DEF]/10 flex items-center justify-center text-[#2563EB]">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-black font-headline text-[#1E293B] mb-2">
              Multi-Slide Carousel Studio
            </h3>
            <p className="text-sm text-[#64748B] mb-5 leading-relaxed">
              Create swipe-worthy LinkedIn and Instagram carousel decks. Manage slide sequences, reorder pages, duplicate slides, and maintain cohesive brand tokens.
            </p>
          </div>

          {/* Visual Carousel Sequence Mockup */}
          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-[#64748B] pb-1 border-b border-[#E2E8F0]">
              <span>DECK PAGINATION</span>
              <span className="text-[#2563EB] font-bold">3 SLIDES SYNCED</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 rounded-lg bg-[#0F172A] text-white border-2 border-[#2563EB] shadow-xs text-center space-y-1">
                <span className="text-[8px] text-[#38BDF8] font-bold block">SLIDE 01</span>
                <span className="text-[9px] font-bold truncate block">HOOK & TITLE</span>
              </div>
              <span className="text-[#CBD5E1] font-bold">→</span>
              <div className="flex-1 p-2 rounded-lg bg-white border border-[#CBD5E1] text-[#1E293B] text-center space-y-1">
                <span className="text-[8px] text-[#64748B] font-bold block">SLIDE 02</span>
                <span className="text-[9px] font-bold truncate block">3-STEP BODY</span>
              </div>
              <span className="text-[#CBD5E1] font-bold">→</span>
              <div className="flex-1 p-2 rounded-lg bg-white border border-[#CBD5E1] text-[#1E293B] text-center space-y-1">
                <span className="text-[8px] text-[#64748B] font-bold block">SLIDE 03</span>
                <span className="text-[9px] font-bold truncate block">TAKEAWAYS</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1">
              <span>UNIFIED BRAND PALETTE</span>
              <span className="text-emerald-600 font-bold">1-CLICK DUPLICATE</span>
            </div>
          </div>
        </div>

        {/* 6. High-Resolution PNG and PDF Exports */}
        <div className="rounded-2xl border-2 border-[#CBD5E1] bg-white p-6 shadow-sm hover:border-[#5B8DEF] transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] font-bold text-[#5B8DEF] tracking-wider uppercase">
                CAPABILITY // 06
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#5B8DEF]/10 flex items-center justify-center text-[#2563EB]">
                <Download className="w-4 h-4" />
              </div>
            </div>

            <h3 className="text-xl font-black font-headline text-[#1E293B] mb-2">
              High-Res PDF & PNG Exports
            </h3>
            <p className="text-sm text-[#64748B] mb-5 leading-relaxed">
              Export multi-page document PDFs with vector sharpness or high-resolution PNG images ready for immediate publishing or commercial printing.
            </p>
          </div>

          {/* Export Formats Blueprint Block */}
          <div className="rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] p-3.5 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-[#64748B] pb-1 border-b border-[#E2E8F0]">
              <span>EXPORT PIPELINE</span>
              <span className="text-emerald-600 font-bold">300 DPI READY</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-white border border-[#CBD5E1] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B]">
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                  <span>Multi-Page PDF</span>
                </div>
                <div className="text-[9px] text-[#64748B]">Vector slides, print crop ready</div>
              </div>

              <div className="p-2 rounded bg-white border border-[#CBD5E1] space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E293B]">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Lossless PNG</span>
                </div>
                <div className="text-[9px] text-[#64748B]">Pixel-perfect social media scale</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-1">
              <span>BACKUP: DESIGN JSON SPEC</span>
              <span className="text-[#2563EB] font-bold">100% CLIENT-SIDE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
