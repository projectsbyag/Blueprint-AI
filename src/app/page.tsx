'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  LayoutTemplate,
  Download,
  MousePointer2,
  CheckCircle2,
} from 'lucide-react';
import { ArchitecturalGrid } from '@/components/landing/ArchitecturalGrid';
import { LandingNav } from '@/components/landing/LandingNav';
import { HeroCanvasPreview } from '@/components/landing/HeroCanvasPreview';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { TemplateShowcase } from '@/components/landing/TemplateShowcase';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { BlueprintFooter } from '@/components/landing/BlueprintFooter';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <ArchitecturalGrid className="min-h-screen flex flex-col font-body">
      {/* 1. Grid-Aligned Technical Navigation */}
      <LandingNav />

      {/* 2. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Technical Annotations Kicker */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 font-mono text-[11px] text-[#64748B]">
          <span className="font-bold text-[#5B8DEF] px-2 py-0.5 rounded-xs bg-[#5B8DEF]/10 border border-[#5B8DEF]/20">
            FIG. 001
          </span>
          <span>·</span>
          <span>CREATIVE WORKSPACE</span>
          <span>·</span>
          <span className="hidden sm:inline">1080 × 1350 PX</span>
          <span className="hidden sm:inline">·</span>
          <span className="text-[#1E293B] font-bold">DESIGN SYSTEM / V1.0</span>
        </div>

        {/* Primary Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-headline tracking-tight text-[#1E293B] max-w-4xl leading-[1.06] mb-6 text-balance">
          Ideas into designs. <span className="text-[#5B8DEF]">Instantly.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-[#64748B] max-w-2xl font-body leading-relaxed mb-8">
          Your AI-powered graphics and carousel studio. Generate complete, publication-ready designs and make them yours.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <Button
            size="lg"
            asChild
            className="h-13 px-8 text-sm sm:text-base font-bold bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl shadow-lg shadow-slate-900/10 gap-2 group cursor-pointer"
          >
            <Link href="/blueprint">
              <Compass className="w-4 h-4 text-[#5B8DEF] group-hover:rotate-45 transition-transform" />
              <span>{user ? 'Open Studio Editor' : 'Open Studio'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="h-13 px-7 text-sm sm:text-base font-semibold border-2 border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#1E293B] rounded-xl cursor-pointer"
          >
            <Link href="#templates">
              <span>Explore Templates</span>
            </Link>
          </Button>
        </div>

        {/* Architectural Trust Signals */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-xs text-[#64748B] mb-12">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5B8DEF]" />
            <span>16 Curated Presets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5B8DEF]" />
            <span>8-Point Vector Transform</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5B8DEF]" />
            <span>Multi-Slide PDF & 4K PNG</span>
          </div>
        </div>

        {/* 3. Hero Realistic Design Workspace Composition */}
        <div className="w-full">
          <HeroCanvasPreview />
        </div>
      </section>

      {/* 4. Feature Showcase */}
      <FeatureShowcase />

      {/* 5. Template Showcase */}
      <TemplateShowcase />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. Final CTA */}
      <FinalCTA />

      {/* 8. Technical Footer */}
      <BlueprintFooter />
    </ArchitecturalGrid>
  );
}
