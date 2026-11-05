'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Undo2,
  Redo2,
  Sparkles,
  Maximize2,
  Layers,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Lock,
  Type,
  Grid,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export function HeroCanvasPreview() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedElement, setSelectedElement] = useState<'title' | 'card' | 'badge'>('title');

  // Palette Shift interactive preview state
  const palettes = [
    { name: 'Blueprint Cobalt', primary: '#2563EB', accent: '#38BDF8', bg: '#0A0E1A', card: '#111827' },
    { name: 'Technical Emerald', primary: '#059669', accent: '#34D399', bg: '#061A14', card: '#0B2920' },
    { name: 'Obsidian Amber', primary: '#D97706', accent: '#FBBF24', bg: '#181206', card: '#261C0B' },
  ];
  const [paletteIdx, setPaletteIdx] = useState(0);
  const currentPalette = palettes[paletteIdx];

  const handlePaletteShift = () => {
    setPaletteIdx((prev) => (prev + 1) % palettes.length);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-2xl border-2 border-[#CBD5E1] bg-white shadow-2xl overflow-hidden select-none">
      {/* 1. Technical Drawing Sheet Outer Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#F1F5F9] border-b border-[#CBD5E1] text-[11px] font-mono text-[#475569]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-500/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-500/40 inline-block" />
          </div>
          <span className="text-[#CBD5E1]">|</span>
          <span className="font-bold text-[#1E293B]">FIG. 001 // BLUEPRINT VECTOR WORKSPACE</span>
          <span className="hidden sm:inline text-[#64748B]">· 1080 × 1350 PX (1:1.25 PORTRAIT)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-xs text-[#5B8DEF] font-bold">
            PALETTE: {currentPalette.name.toUpperCase()}
          </span>
          <span className="hidden lg:inline text-[#64748B]">SNAP: 24PX</span>
          <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#5B8DEF]/15 text-[#5B8DEF] border border-[#5B8DEF]/30">
            <span>LIVE PREVIEW</span>
          </div>
        </div>
      </div>

      {/* 2. Top Floating Drafting Control Strip */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#E2E8F0] bg-white text-xs">
        {/* Left: History & Alignment */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[#CBD5E1] rounded-lg p-0.5 bg-[#F8FAFC]">
            <button
              type="button"
              className="p-1.5 hover:bg-white rounded text-[#64748B] hover:text-[#1E293B] transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="p-1.5 hover:bg-white rounded text-[#64748B] hover:text-[#1E293B] transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#E2E8F0]" />

          {/* Interactive Palette Shift Button */}
          <button
            type="button"
            onClick={handlePaletteShift}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#5B8DEF]/30 bg-[#5B8DEF]/10 hover:bg-[#5B8DEF]/20 text-[#2563EB] font-semibold text-xs transition-all shadow-2xs"
            title="Click to cycle live color harmonies"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] animate-pulse" />
            <span>Palette Shift</span>
          </button>
        </div>

        {/* Center: Active Tool Title & Coordinate Flag */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#64748B]">
          <span className="text-[#1E293B] font-bold">TOOL: 8-POINT VECTOR TRANSFORM</span>
          <span>·</span>
          <span>GRID SNAP: ON</span>
        </div>

        {/* Right: Zoom & Fullscreen */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-[#CBD5E1] rounded-lg px-2 py-0.5 bg-[#F8FAFC] font-mono text-[11px]">
            <ZoomOut className="w-3 h-3 text-[#64748B]" />
            <span className="font-semibold text-[#1E293B]">75%</span>
            <ZoomIn className="w-3 h-3 text-[#64748B]" />
          </div>
          <Link
            href="/blueprint"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Open in Studio</span>
            <Maximize2 className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* 3. Main Workspace Area: Drafting Rulers + Central Artboard + Floating Inspector */}
      <div className="relative flex flex-col lg:flex-row bg-[#F1F5F9]/70 overflow-hidden">
        {/* Horizontal Top Metric Ruler */}
        <div className="w-full h-6 bg-[#E2E8F0] border-b border-[#CBD5E1] flex items-end overflow-hidden select-none font-mono text-[9px] text-[#64748B] px-12">
          <div className="flex justify-between w-full">
            <span>0</span>
            <span className="hidden sm:inline">100</span>
            <span>200</span>
            <span className="hidden sm:inline">300</span>
            <span>400</span>
            <span className="text-[#5B8DEF] font-bold">500 [CENTER]</span>
            <span>600</span>
            <span className="hidden sm:inline">700</span>
            <span>800</span>
            <span className="hidden sm:inline">900</span>
            <span>1000 PX</span>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
          {/* Alignment Crosshairs Guide Lines (Cyan/Blue Drafting Guides) */}
          <div
            className="absolute top-0 bottom-0 left-1/2 w-[1px] border-r border-dashed border-[#38BDF8]/60 pointer-events-none z-20"
            title="Vertical Center Guide"
          >
            <span className="absolute top-2 left-1.5 text-[9px] font-mono font-bold bg-[#38BDF8] text-white px-1 rounded-xs">
              X: 500 PX
            </span>
          </div>
          <div
            className="absolute left-0 right-0 top-[38%] h-[1px] border-b border-dashed border-[#38BDF8]/60 pointer-events-none z-20"
            title="Horizontal Baseline Guide"
          >
            <span className="absolute left-4 -top-4 text-[9px] font-mono font-bold bg-[#38BDF8] text-white px-1 rounded-xs">
              Y: 380 PX [CONTENT BASELINE]
            </span>
          </div>

          {/* 4. The 1000x1000 Actual Artboard Preview */}
          <div
            className="relative w-full max-w-[620px] aspect-square rounded-2xl shadow-2xl overflow-hidden transition-colors duration-500 border border-[#CBD5E1]"
            style={{ backgroundColor: currentPalette.bg }}
          >
            {/* Subtle Drafting Watermark Grid Inside Canvas */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Slide Content */}
            <div className="relative w-full h-full p-6 sm:p-10 flex flex-col justify-between z-10 text-white">
              {/* Top Header Row of Canvas */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedElement('badge')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
                    selectedElement === 'badge'
                      ? 'ring-2 ring-[#38BDF8] ring-offset-2 ring-offset-transparent'
                      : ''
                  }`}
                  style={{
                    backgroundColor: currentPalette.primary,
                    color: '#FFFFFF',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>SLIDE 01 // 03 · LAUNCH DECK</span>
                </button>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>DIM: 1080×1080</span>
                  <span>·</span>
                  <span className="text-[#38BDF8]">VECTOR</span>
                </div>
              </div>

              {/* Main Headline Area with Interactive 8-Point Transform Bounding Box */}
              <div
                onClick={() => setSelectedElement('title')}
                className={`relative my-auto p-4 rounded-xl cursor-pointer transition-all ${
                  selectedElement === 'title'
                    ? 'ring-2 ring-[#38BDF8] bg-blue-950/20 shadow-lg'
                    : 'hover:ring-1 hover:ring-white/40'
                }`}
              >
                {/* 8-Point Transform Handles (shown when headline is selected) */}
                {selectedElement === 'title' && (
                  <>
                    {/* Corner Handles */}
                    <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-xs shadow-xs" />
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-xs shadow-xs" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-xs shadow-xs" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-xs shadow-xs" />

                    {/* Mid-Side Handles */}
                    <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-3 bg-white border-2 border-[#2563EB] rounded-xs shadow-xs" />
                    <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-3 bg-white border-2 border-[#2563EB] rounded-xs shadow-xs" />
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-2.5 bg-white border-2 border-[#2563EB] rounded-xs shadow-xs" />
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-2.5 bg-white border-2 border-[#2563EB] rounded-xs shadow-xs" />

                    {/* Floating HUD Coordinate Tooltip */}
                    <div className="absolute -top-7 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#2563EB] text-white font-mono text-[9px] font-bold shadow-md">
                      <MousePointer2 className="w-2.5 h-2.5" />
                      <span>H1: 820 × 140 PX · SPACE GROTESK 900</span>
                    </div>
                  </>
                )}

                <h2
                  className="font-headline text-2xl sm:text-4xl lg:text-5xl font-black leading-[1.08] tracking-tight"
                  style={{ color: currentPalette.accent }}
                >
                  ENGINEERED FOR UNPRECEDENTED VELOCITY
                </h2>
                <p className="mt-3 text-xs sm:text-base text-slate-300 leading-relaxed max-w-lg">
                  Transform raw product concepts into publication-ready LinkedIn carousels, architectural specs, and graphic flyers instantly.
                </p>
              </div>

              {/* Lower Showcase Feature Card with Metric Accent */}
              <div
                onClick={() => setSelectedElement('card')}
                className={`p-4 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                  selectedElement === 'card'
                    ? 'ring-2 ring-[#38BDF8] border-white/60'
                    : 'border-white/10 hover:border-white/30'
                }`}
                style={{ backgroundColor: currentPalette.card }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-slate-200">
                      AUTHENTIC ARCHITECTURAL LAYOUT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    +380% ENGAGEMENT
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-white/10">
                  <div>
                    <div className="font-mono text-xs font-bold text-white">8-POINT</div>
                    <div className="text-[9px] text-slate-400">Vector Handles</div>
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-white">16 PRESETS</div>
                    <div className="text-[9px] text-slate-400">Curated Library</div>
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-white">PDF & PNG</div>
                    <div className="text-[9px] text-slate-400">Lossless Export</div>
                  </div>
                </div>
              </div>

              {/* Bottom Canvas Meta Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/10">
                <span>PROJECT: APEX-LAUNCH-V1</span>
                <span>PAGE 01 / 03</span>
                <span className="text-white font-bold">SWIPE NEXT →</span>
              </div>
            </div>
          </div>

          {/* 5. Floating Slide Pagination Deck Rail */}
          <div className="mt-4 flex items-center gap-2 p-1.5 rounded-xl border border-[#CBD5E1] bg-white shadow-md">
            {[0, 1, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveSlide(s)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  activeSlide === s
                    ? 'bg-[#1E293B] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
                }`}
              >
                <span>SLIDE {s + 1}</span>
                {activeSlide === s && <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />}
              </button>
            ))}
            <div className="w-[1px] h-4 bg-[#E2E8F0] mx-1" />
            <Link
              href="/blueprint"
              className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1 pr-1"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 6. Realistic Floating Inspector Sidebar (Desktop) */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-[#CBD5E1] bg-white p-4 flex flex-col gap-4 font-mono text-xs select-none">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 font-bold text-[#1E293B]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B8DEF]" />
              <span>INSPECTOR // ACTIVE LAYER</span>
            </div>
            <span className="text-[10px] text-[#64748B]">Z: 04</span>
          </div>

          {/* Layer Selection Indicator */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-[#64748B] uppercase">Layer Stack</div>
            <div className="space-y-1">
              <div
                onClick={() => setSelectedElement('title')}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedElement === 'title'
                    ? 'bg-[#5B8DEF]/15 border border-[#5B8DEF]/40 text-[#1E293B] font-bold'
                    : 'hover:bg-[#F8FAFC] text-[#64748B]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#5B8DEF]" />
                  <span>Hero Headline (H1)</span>
                </div>
                <Eye className="w-3 h-3 text-[#64748B]" />
              </div>

              <div
                onClick={() => setSelectedElement('badge')}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedElement === 'badge'
                    ? 'bg-[#5B8DEF]/15 border border-[#5B8DEF]/40 text-[#1E293B] font-bold'
                    : 'hover:bg-[#F8FAFC] text-[#64748B]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#5B8DEF]" />
                  <span>Launch Badge Pill</span>
                </div>
                <Eye className="w-3 h-3 text-[#64748B]" />
              </div>

              <div
                onClick={() => setSelectedElement('card')}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedElement === 'card'
                    ? 'bg-[#5B8DEF]/15 border border-[#5B8DEF]/40 text-[#1E293B] font-bold'
                    : 'hover:bg-[#F8FAFC] text-[#64748B]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Grid className="w-3.5 h-3.5 text-[#5B8DEF]" />
                  <span>Metric Showcase Card</span>
                </div>
                <Eye className="w-3 h-3 text-[#64748B]" />
              </div>
            </div>
          </div>

          {/* Typography Controls */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <div className="text-[10px] text-[#64748B] uppercase">Typography Spec</div>
            <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Font Family</span>
                <span className="font-bold text-[#1E293B]">Space Grotesk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Weight</span>
                <span className="font-bold text-[#1E293B]">900 Black</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Tracking</span>
                <span className="font-bold text-[#1E293B]">-0.025em</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Line Height</span>
                <span className="font-bold text-[#1E293B]">1.08</span>
              </div>
            </div>
          </div>

          {/* Color Harmony Chips */}
          <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#64748B] uppercase">Palette Harmony</span>
              <button
                type="button"
                onClick={handlePaletteShift}
                className="text-[10px] text-[#2563EB] hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
              >
                <span>Shift</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-7 h-7 rounded-md border shadow-xs"
                style={{ backgroundColor: currentPalette.primary }}
                title="Primary Accent"
              />
              <span
                className="w-7 h-7 rounded-md border shadow-xs"
                style={{ backgroundColor: currentPalette.accent }}
                title="Secondary Light"
              />
              <span
                className="w-7 h-7 rounded-md border shadow-xs"
                style={{ backgroundColor: currentPalette.card }}
                title="Surface Card"
              />
              <span
                className="w-7 h-7 rounded-md border shadow-xs"
                style={{ backgroundColor: currentPalette.bg }}
                title="Canvas Background"
              />
            </div>
          </div>

          {/* Quick Action CTA inside Mockup */}
          <div className="mt-auto pt-2">
            <Link
              href="/blueprint"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#5B8DEF] hover:bg-[#4377DE] text-white font-sans text-xs font-bold shadow-sm transition-all"
            >
              <span>Customize In Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 7. Bottom Drawing Sheet Verification Block */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 bg-[#F8FAFC] border-t border-[#CBD5E1] text-[10px] font-mono text-[#64748B]">
        <div className="flex items-center gap-4">
          <span>DWG: BP-PREVIEW-001</span>
          <span>·</span>
          <span>REVISION: 04.2 APPROVED</span>
          <span>·</span>
          <span className="text-[#1E293B] font-bold">100% CLIENT-SIDE VECTOR SVG</span>
        </div>
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <span className="text-emerald-600 font-bold">✓ VERIFIED BY BLUEPRINT ENGINE</span>
        </div>
      </div>
    </div>
  );
}
