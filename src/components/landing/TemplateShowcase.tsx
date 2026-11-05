'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PREDEFINED_TEMPLATES } from '@/components/tools/TemplateLibrary';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  LayoutTemplate,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export function TemplateShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'social' | 'marketing' | 'business' | 'infographic' | 'carousel'
  >('all');

  const categories = [
    { id: 'all', label: 'All Templates (16)' },
    { id: 'social', label: 'Social Media' },
    { id: 'marketing', label: 'Marketing & Sales' },
    { id: 'business', label: 'Business & Career' },
    { id: 'infographic', label: 'Infographics' },
    { id: 'carousel', label: 'Carousels' },
  ] as const;

  const filteredTemplates = PREDEFINED_TEMPLATES.map((tmpl, idx) => ({ ...tmpl, index: idx })).filter(
    (tmpl) => selectedCategory === 'all' || tmpl.filterCategory === selectedCategory
  );

  return (
    <section id="templates" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#CBD5E1]">
      {/* Section Header with Engineering Annotation */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 font-mono text-xs font-bold text-[#2563EB] mb-3">
            <span>INDEX // PREDEFINED SPECIFICATIONS</span>
            <span>·</span>
            <span>ARCHIVE V2.4</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-headline tracking-tight text-[#1E293B]">
            Curated Blueprint Templates
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#64748B] font-body max-w-2xl">
            Pre-engineered layouts designed to architectural standards. Click any template to immediately open and customize in Blueprint Studio.
          </p>
        </div>

        <Button
          asChild
          className="h-10 px-5 text-xs font-semibold bg-[#1E293B] hover:bg-[#0F172A] text-white shadow-xs rounded-lg gap-1.5"
        >
          <Link href="/blueprint">
            <span>Open Studio Canvas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-[#E2E8F0]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#5B8DEF] text-white shadow-xs'
                : 'bg-white border border-[#CBD5E1] text-[#64748B] hover:text-[#1E293B] hover:border-[#94A3B8]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Grid in Architectural Drawing Sheet Frames */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const slideCount = template.pages?.length || 1;
          const previewEl = template.elements.find((el) => el.type === 'text');
          const title = previewEl?.content || template.description;

          return (
            <div
              key={template.index}
              className="group relative rounded-2xl border-2 border-[#CBD5E1] bg-white shadow-xs hover:shadow-xl hover:border-[#5B8DEF] transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Drawing Sheet Title Block Header */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#F8FAFC] border-b border-[#CBD5E1] font-mono text-[10px] text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#5B8DEF]">
                    DWG: BP-{String(template.index + 1).padStart(3, '0')}
                  </span>
                  <span>·</span>
                  <span className="uppercase">{template.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  {slideCount > 1 && (
                    <span className="px-1.5 py-0.5 rounded-xs bg-[#5B8DEF]/15 text-[#2563EB] font-bold">
                      {slideCount} SLIDES
                    </span>
                  )}
                  <span>1000×1000</span>
                </div>
              </div>

              {/* Live Scaled Preview Box */}
              <div className="relative p-5 flex items-center justify-center bg-[#F1F5F9]/50 overflow-hidden">
                {/* 1:1 Scaled Canvas Container */}
                <div
                  className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md border border-[#CBD5E1] flex flex-col justify-between p-4 transition-transform group-hover:scale-[1.02] duration-300"
                  style={{ backgroundColor: template.canvasBackgroundColor || '#FFFFFF' }}
                >
                  {/* Miniature Grid Watermark */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, rgba(120,120,120,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,120,120,0.2) 1px, transparent 1px)',
                      backgroundSize: '25px 25px',
                    }}
                  />

                  {/* Corner Architectural Crop Marks inside preview */}
                  <span className="absolute top-1 left-1 text-[8px] font-mono text-slate-400">┌</span>
                  <span className="absolute top-1 right-1 text-[8px] font-mono text-slate-400">┐</span>
                  <span className="absolute bottom-1 left-1 text-[8px] font-mono text-slate-400">└</span>
                  <span className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-400">┘</span>

                  {/* Representative Elements Mockup */}
                  <div className="relative z-10 space-y-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-[#5B8DEF] text-white">
                      {template.category.toUpperCase()}
                    </span>
                    <div className="text-xs font-black font-headline line-clamp-3 text-slate-900 leading-snug">
                      {title}
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[8px] font-mono pt-2 border-t border-slate-300/40 text-slate-600">
                    <span>ELEMENTS: {template.elements.length}</span>
                    <span className="font-bold text-[#2563EB]">BLUEPRINT V2</span>
                  </div>
                </div>

                {/* Hover Overlay with Direct CTA */}
                <div className="absolute inset-0 bg-[#0F172A]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-2xs z-20">
                  <div className="text-center text-white">
                    <p className="font-headline font-bold text-sm mb-1">{template.description}</p>
                    <p className="text-[11px] font-mono text-slate-300">{template.category}</p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="h-8 px-4 text-xs font-semibold bg-[#5B8DEF] hover:bg-[#4377DE] text-white shadow-md gap-1.5"
                  >
                    <Link href={`/blueprint?template=${template.index}`}>
                      <span>Customize in Studio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Footer Meta Description & Action */}
              <div className="p-3.5 bg-white border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-[#1E293B] text-xs font-headline truncate max-w-[200px]">
                    {template.description}
                  </h4>
                  <p className="text-[11px] text-[#64748B] font-mono">{template.category}</p>
                </div>

                <Link
                  href={`/blueprint?template=${template.index}`}
                  className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] group-hover:underline"
                >
                  <span>Edit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
