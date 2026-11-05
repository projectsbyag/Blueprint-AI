'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Compass,
  ArrowRight,
  Menu,
  X,
  Layers,
  Sparkles,
  LayoutTemplate,
  Workflow,
  LogIn,
} from 'lucide-react';

export function LandingNav() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#CBD5E1] bg-[#F5F7FA]/90 backdrop-blur-md transition-all">
      {/* Top Drafting Micro-Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 border-b border-[#DCE5F0] text-[10px] font-mono text-[#64748B]">
        <div className="flex items-center gap-4">
          <span className="text-[#5B8DEF] font-bold">SPEC: ARCHITECTURAL DESIGN SYSTEM</span>
          <span>·</span>
          <span>GRID: 24/120PX</span>
          <span>·</span>
          <span>SCALE: 1:1 METRIC</span>
        </div>
        <div className="flex items-center gap-4">
          <span>LATENCY: 0.14S</span>
          <span>·</span>
          <span className="text-emerald-600 font-semibold">● STUDIO READY</span>
          <span>·</span>
          <span>BUILD: v2.4.8</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Brand Lockup */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF]"
        >
          <div className="w-9 h-9 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#5B8DEF] shadow-xs group-hover:border-[#5B8DEF] group-hover:shadow-sm transition-all">
            <Compass className="w-5 h-5 text-[#5B8DEF] group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline text-lg font-black tracking-wider text-[#1E293B]">
                BLUEPRINT
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm bg-[#5B8DEF]/10 text-[#5B8DEF] border border-[#5B8DEF]/20">
                STUDIO // V2.4
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B]">
          <Link
            href="#features"
            className="hover:text-[#1E293B] hover:border-b-2 hover:border-[#5B8DEF] pb-1 transition-all"
          >
            Features
          </Link>
          <Link
            href="#templates"
            className="hover:text-[#1E293B] hover:border-b-2 hover:border-[#5B8DEF] pb-1 transition-all"
          >
            Templates
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-[#1E293B] hover:border-b-2 hover:border-[#5B8DEF] pb-1 transition-all"
          >
            How it works
          </Link>
          <Link
            href="/blueprint"
            className="hover:text-[#1E293B] hover:border-b-2 hover:border-[#5B8DEF] pb-1 transition-all"
          >
            Studio Editor
          </Link>
        </nav>

        {/* Actions Zone */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#64748B] max-w-[150px] truncate hidden lg:inline">
                {user.email}
              </span>
              <Button
                asChild
                className="h-9 px-4 text-xs font-semibold bg-[#5B8DEF] hover:bg-[#4377DE] text-white shadow-xs rounded-lg gap-1.5"
              >
                <Link href="/blueprint">
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                size="sm"
                className="h-9 px-3 text-xs font-medium text-[#1E293B] hover:bg-white border border-transparent hover:border-[#CBD5E1]"
              >
                <Link href="/login">
                  <LogIn className="w-3.5 h-3.5 mr-1 text-[#64748B]" />
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                className="h-9 px-4 text-xs font-semibold bg-[#1E293B] hover:bg-[#0F172A] text-white rounded-lg shadow-xs gap-1.5 group"
              >
                <Link href="/blueprint">
                  <span>Start Designing</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 border-[#CBD5E1] bg-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#CBD5E1] bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="flex flex-col gap-1 text-sm font-medium text-[#1E293B]">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#F5F7FA]"
            >
              <Sparkles className="w-4 h-4 text-[#5B8DEF]" />
              <span>Features</span>
            </Link>
            <Link
              href="#templates"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#F5F7FA]"
            >
              <LayoutTemplate className="w-4 h-4 text-[#5B8DEF]" />
              <span>Templates</span>
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#F5F7FA]"
            >
              <Workflow className="w-4 h-4 text-[#5B8DEF]" />
              <span>How it works</span>
            </Link>
            <Link
              href="/blueprint"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#F5F7FA]"
            >
              <Layers className="w-4 h-4 text-[#5B8DEF]" />
              <span>Studio Editor</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex flex-col gap-2">
            {!user ? (
              <>
                <Button variant="outline" asChild className="w-full text-xs h-9 justify-center">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full text-xs h-9 justify-center bg-[#5B8DEF] hover:bg-[#4377DE] text-white">
                  <Link href="/blueprint" onClick={() => setMobileMenuOpen(false)}>
                    Start Designing
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild className="w-full text-xs h-9 justify-center bg-[#5B8DEF] text-white">
                <Link href="/blueprint" onClick={() => setMobileMenuOpen(false)}>
                  Open Studio ({user.email})
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
