'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PREDEFINED_TEMPLATES } from '@/components/tools/TemplateLibrary';
import { ScaledCanvasPreview } from '@/components/canvas/ScaledCanvasPreview';
import { PlayableCanvasWorkspace } from '@/components/landing/PlayableCanvasWorkspace';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  Play,
} from 'lucide-react';

export function TemplateShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'social' | 'marketing' | 'business' | 'infographic' | 'carousel'
  >('all');
  const [previewTemplateIdx, setPreviewTemplateIdx] = useState<number | null>(null);

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
            Pre-engineered layouts designed to architectural standards. Click any template to play with it right here, then open directly in Blueprint Studio with your edits preserved.
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
          const previewElements =
            template.pages && template.pages.length > 0
              ? template.pages[0].elements
              : template.elements;
          const previewBg =
            template.pages && template.pages.length > 0
              ? template.pages[0].canvasBackgroundColor || template.canvasBackgroundColor
              : template.canvasBackgroundColor;

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

              {/* Real 1:1 Scaled Visual Preview Box */}
              <div
                onClick={() => setPreviewTemplateIdx(template.index)}
                className="relative p-4 flex items-center justify-center bg-[#F1F5F9]/60 overflow-hidden cursor-pointer"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md border border-[#CBD5E1] transition-transform group-hover:scale-[1.02] duration-300">
                  <ScaledCanvasPreview
                    elements={previewElements}
                    canvasBackgroundColor={previewBg || '#FFFFFF'}
                  />
                </div>

                {/* Hover Overlay with Play Preview & Open in Studio */}
                <div className="absolute inset-0 bg-[#0F172A]/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 backdrop-blur-2xs z-20">
                  <div className="text-center text-white mb-1">
                    <p className="font-headline font-bold text-sm mb-0.5">{template.description}</p>
                    <p className="text-[11px] font-mono text-slate-300">
                      {template.category} · {previewElements.length} Elements
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplateIdx(template.index);
                      }}
                      className="h-8 px-3.5 text-xs font-semibold bg-white hover:bg-slate-100 text-[#0F172A] shadow-md gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Play & Edit</span>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="h-8 px-3.5 text-xs font-semibold bg-[#5B8DEF] hover:bg-[#4377DE] text-white shadow-md gap-1.5"
                    >
                      <Link href={`/blueprint?template=${template.index}`} onClick={(e) => e.stopPropagation()}>
                        <span>Open in Studio</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer Meta Description & Quick Actions */}
              <div className="p-3.5 bg-white border-t border-[#E2E8F0] flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <h4 className="font-bold text-[#1E293B] text-xs font-headline truncate">
                    {template.description}
                  </h4>
                  <p className="text-[11px] text-[#64748B] font-mono truncate">{template.category}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplateIdx(template.index)}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#5B8DEF] font-mono text-[11px] font-bold text-[#1E293B] cursor-pointer transition-colors"
                    title="Play with interactive preview"
                  >
                    <SlidersHorizontal className="w-3 h-3 text-[#5B8DEF]" />
                    <span>Play</span>
                  </button>
                  <Link
                    href={`/blueprint?template=${template.index}`}
                    className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline"
                  >
                    <span>Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Playable Template Sandbox Modal */}
      <Dialog open={previewTemplateIdx !== null} onOpenChange={(open) => !open && setPreviewTemplateIdx(null)}>
        <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto p-3 sm:p-5 bg-[#F8FAFC] border-2 border-[#CBD5E1]">
          <DialogHeader className="px-1">
            <DialogTitle className="font-headline text-base sm:text-lg font-bold text-[#1E293B] flex items-center gap-2">
              <span>Interactive Template Sandbox</span>
              {previewTemplateIdx !== null && (
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#5B8DEF]/15 text-[#2563EB]">
                  DWG: BP-{String(previewTemplateIdx + 1).padStart(3, '0')}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#64748B] font-mono">
              Drag elements, resize with 8 handles, edit text/colors, group layers, or shift palettes — then click Open in Studio to continue editing with all changes intact.
            </DialogDescription>
          </DialogHeader>

          {previewTemplateIdx !== null && (
            <PlayableCanvasWorkspace
              initialTemplateIndex={previewTemplateIdx}
              figureLabel={`SANDBOX // ${PREDEFINED_TEMPLATES[previewTemplateIdx]?.description?.toUpperCase() || 'TEMPLATE'}`}
              compact={true}
              onOpenStudio={() => setPreviewTemplateIdx(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
