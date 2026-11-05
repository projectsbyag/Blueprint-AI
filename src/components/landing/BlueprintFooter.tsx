'use client';

import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';

export function BlueprintFooter() {
  return (
    <footer className="border-t border-[#CBD5E1] bg-[#F1F5F9]/80 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs text-[#64748B]">
        {/* Brand info */}
        <div className="flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1E293B] flex items-center justify-center text-[#5B8DEF]">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-headline font-black text-sm text-[#1E293B] tracking-wider">
              BLUEPRINT
            </span>
          </Link>
          <p className="text-[11px] text-[#64748B] font-sans">
            AI-powered graphic design and carousel studio built to architectural standards.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
          <Link href="#features" className="hover:text-[#1E293B] transition-colors">
            Features
          </Link>
          <Link href="#templates" className="hover:text-[#1E293B] transition-colors">
            Templates (16)
          </Link>
          <Link href="#how-it-works" className="hover:text-[#1E293B] transition-colors">
            Workflow
          </Link>
          <Link href="/blueprint" className="hover:text-[#1E293B] transition-colors font-bold text-[#2563EB]">
            Studio Editor
          </Link>
          <Link href="/login" className="hover:text-[#1E293B] transition-colors">
            Sign In
          </Link>
        </div>

        {/* Legal & Spec */}
        <div className="text-[11px] text-[#64748B]">
          &copy; {new Date().getFullYear()} Blueprint Studio. Built with Next.js 15 & SVG Vector Architecture.
        </div>
      </div>
    </footer>
  );
}
