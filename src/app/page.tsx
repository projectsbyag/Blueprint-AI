'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, Sparkles, Layers, Image as ImageIcon, Download, ArrowRight } from 'lucide-react';
import { AppHeader } from '@/components/shared/AppHeader';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-5xl mx-auto">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Professional Design & Carousel Studio</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight text-foreground mb-6 max-w-3xl leading-tight">
          Create Knock-Out Graphics at the Speed of Thought
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Blueprint generates complete, publication-ready design layouts with typography, curated imagery, and balanced visual hierarchy in seconds.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Button size="lg" asChild className="h-12 px-8 text-base shadow-lg shadow-primary/20">
            <Link href="/blueprint">
              {user ? 'Open Studio Editor' : 'Launch Design Studio'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          {!user && (
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
              <Link href="/login">Log In / Guest Access</Link>
            </Button>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl border bg-card/60 shadow-sm hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-headline mb-2">Curated Templates</h3>
            <p className="text-sm text-muted-foreground">
              Select from curated multi-slide carousels, educational roadmaps, and marketing flyers ready to edit.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card/60 shadow-sm hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-headline mb-2">Interactive Canvas</h3>
            <p className="text-sm text-muted-foreground">
              Drag, resize across 8 handles, style, and re-order elements freely on a pixel-precise 1000×1000 canvas.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card/60 shadow-sm hover:border-primary/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-headline mb-2">Multi-Format Export</h3>
            <p className="text-sm text-muted-foreground">
              Export your creations as print-ready PDFs, multi-page slide decks, or high-res PNG images.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-muted-foreground text-xs border-t">
        <p>&copy; {new Date().getFullYear()} Blueprint Design Studio. Built with Next.js & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
