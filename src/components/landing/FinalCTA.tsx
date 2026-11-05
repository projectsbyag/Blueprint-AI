'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#CBD5E1]">
      {/* Completed Architectural Drawing Sheet Container */}
      <div className="relative rounded-3xl border-3 border-[#CBD5E1] bg-white p-6 sm:p-12 shadow-2xl overflow-hidden">
        {/* Subtle Drafting Grid Watermark inside CTA */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, #DCE5F0 1px, transparent 1px),
              linear-gradient(to bottom, #DCE5F0 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Corner Drawing Sheet Brackets */}
        <span className="absolute top-3 left-3 text-sm font-mono text-[#5B8DEF] font-bold select-none">┌</span>
        <span className="absolute top-3 right-3 text-sm font-mono text-[#5B8DEF] font-bold select-none">┐</span>
        <span className="absolute bottom-3 left-3 text-sm font-mono text-[#5B8DEF] font-bold select-none">└</span>
        <span className="absolute bottom-3 right-3 text-sm font-mono text-[#5B8DEF] font-bold select-none">┘</span>

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Engineering Stamp / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 font-mono text-xs font-bold text-[#2563EB]">
            <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>SHEET SPEC: FINAL PRODUCTION DRAFT</span>
            <span>·</span>
            <span>REV. 04</span>
          </div>

          {/* Headline from Prompt */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-headline tracking-tight text-[#1E293B] leading-[1.08]">
            Your next great design starts here.
          </h2>

          {/* Supporting Copy from Prompt */}
          <p className="text-base sm:text-xl text-[#64748B] font-body leading-relaxed max-w-2xl">
            Stop starting from scratch. Start designing with Blueprint.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Button
              size="lg"
              asChild
              className="h-13 px-8 text-sm sm:text-base font-bold bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-xl shadow-lg shadow-slate-900/10 gap-2 group cursor-pointer"
            >
              <Link href="/blueprint">
                <Compass className="w-4 h-4 text-[#5B8DEF] group-hover:rotate-45 transition-transform" />
                <span>Open Studio</span>
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
                <span>Explore 16 Templates</span>
              </Link>
            </Button>
          </div>

          {/* Architectural Drawing Sheet Verification Title Block */}
          <div className="w-full mt-10 pt-6 border-t border-[#CBD5E1] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left font-mono text-[11px] text-[#64748B]">
            <div>
              <span className="block text-slate-400 text-[9px] uppercase">Project</span>
              <span className="font-bold text-[#1E293B]">Blueprint Studio</span>
            </div>
            <div>
              <span className="block text-slate-400 text-[9px] uppercase">Engine</span>
              <span className="font-bold text-[#2563EB]">Vector / 1000×1000</span>
            </div>
            <div>
              <span className="block text-slate-400 text-[9px] uppercase">Approved Status</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                APPROVED
              </span>
            </div>
            <div>
              <span className="block text-slate-400 text-[9px] uppercase">Revision Code</span>
              <span className="font-bold text-[#1E293B]">REV 04.2 / FINAL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
