'use client';

import React from 'react';
import Link from 'next/link';
import {
  Lightbulb,
  Sliders,
  Share2,
  ArrowRight,
  Sparkles,
  MousePointer2,
  FileDown,
  CheckCircle2,
} from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Describe your idea',
      subtitle: 'Input Specification',
      description:
        'Choose from 16 curated architectural frameworks or enter a custom prompt. Blueprint calculates optimal visual hierarchy, layout proportions, and background tones.',
      icon: Lightbulb,
      annotation: 'LATENCY: < 1.2S',
      actionBadge: 'STAGE 1: GENERATE',
    },
    {
      step: '02',
      title: 'Generate & customize',
      subtitle: 'Vector Synthesis',
      description:
        'Manipulate shapes with 8-point handles, cycle harmonic palettes with 1-click Palette Shift, group multi-elements with Ctrl+G, and rewrite punchy hooks with AI.',
      icon: Sliders,
      annotation: 'CANVAS: 1000×1000',
      actionBadge: 'STAGE 2: PRECISION DRAFT',
    },
    {
      step: '03',
      title: 'Export & publish',
      subtitle: 'Artifact Deployment',
      description:
        'Download lossless social-ready PNGs or crisp vector multi-slide PDFs. Publish directly to LinkedIn, Twitter, newsletters, or print production.',
      icon: FileDown,
      annotation: 'FORMAT: PDF / PNG',
      actionBadge: 'STAGE 3: PUBLISH',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#CBD5E1]">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 font-mono text-xs font-bold text-[#2563EB]">
          <span>WORKFLOW // 3-PHASE SPECIFICATION</span>
          <span>·</span>
          <span>PIPELINE ARCHITECTURE</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-[#1E293B] max-w-2xl leading-tight">
          From concept to publish in three precise steps.
        </h2>

        <p className="text-base sm:text-lg text-[#64748B] max-w-xl font-body leading-relaxed">
          No blank canvas paralysis. No manual pixel nudging. Just pure creative momentum.
        </p>
      </div>

      {/* Steps with Architectural Dimension Path */}
      <div className="relative">
        {/* Subtle Horizontal Architectural Dimension Line across steps (Desktop) */}
        <div className="hidden lg:block absolute top-12 left-12 right-12 h-[1px] border-t-2 border-dashed border-[#CBD5E1] z-0">
          {/* Dimension Measurement Callout in Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5F7FA] px-3 font-mono text-[10px] text-[#5B8DEF] font-bold border border-[#CBD5E1] rounded-xs">
            DIM: TOTAL WORKFLOW TIME &lt; 2 MINUTES
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-2xl border-2 border-[#CBD5E1] bg-white p-6 shadow-sm hover:border-[#5B8DEF] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Step Header Block */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-headline text-3xl font-black text-[#5B8DEF]">
                      {item.step}
                    </span>
                    <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B]">
                      {item.actionBadge}
                    </span>
                  </div>

                  <div className="font-mono text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                    {item.subtitle}
                  </div>

                  <h3 className="text-xl font-black font-headline text-[#1E293B] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#64748B] font-body leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Step Technical Footer Annotation */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-mono text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] font-bold text-[#1E293B]">{item.annotation}</span>
                  </div>
                  <span className="text-[10px] text-[#5B8DEF] font-bold">STAGE {index + 1} // 03</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
