'use client';

import { useState } from 'react';
import { Eye, Sparkles, Layers, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { DesignLayout as ClientDesignLayout, DesignElement } from '@/types/blueprint';
import { addIdsToLayout } from '@/components/canvas/Canvas';
import { useToast } from '@/hooks/use-toast';

interface TemplateLibraryProps {
  onLayoutSelect: (layout: ClientDesignLayout) => void;
}

export const PREDEFINED_TEMPLATES: Array<{
  description: string;
  category: string;
  filterCategory: 'carousel' | 'infographic' | 'marketing' | 'social' | 'business' | 'other';
  canvasBackgroundColor: string;
  elements: Omit<DesignElement, 'id'>[];
  pages?: Array<{
    id?: string;
    title?: string;
    canvasBackgroundColor?: string;
    elements: Omit<DesignElement, 'id'>[];
  }>;
  activePageIndex?: number;
}> = [
  // 1. Product Launch Carousel (3 Slides)
  {
    description: 'Product Launch Carousel (3 Slides)',
    category: 'Carousel Deck',
    filterCategory: 'carousel',
    canvasBackgroundColor: '#0A0E1A',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.4)', zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 90 },
        size: { width: 200, height: 40 },
        style: { backgroundColor: '#2563EB', borderRadius: '9999px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 90, y: 98 },
        size: { width: 200, height: 32 },
        content: 'SLIDE 1 OF 3',
        style: { color: '#FFFFFF', fontSize: '13px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 90, y: 190 },
        size: { width: 820, height: 160 },
        content: 'INTRODUCING THE NEXT GENERATION',
        style: { color: '#60A5FA', fontSize: '54px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.05', letterSpacing: '-1px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 90, y: 380 },
        size: { width: 800, height: 90 },
        content: 'Built from first principles for unprecedented performance, instant responsiveness, and seamless multi-device collaboration.',
        style: { color: '#94A3B8', fontSize: '22px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 520 },
        size: { width: 820, height: 260 },
        style: { backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid #334155', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 130, y: 550 },
        size: { width: 740, height: 200 },
        content: '⚡ Sub-10ms Global Latency Across 28 Edge Regions\n\n🔒 Zero-Trust End-to-End Cryptographic Security\n\n📈 99.999% SLA High-Availability Distributed Core',
        style: { color: '#F1F5F9', fontSize: '19px', lineHeight: '1.8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '700', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 820 },
        size: { width: 280, height: 50 },
        style: { backgroundColor: '#3B82F6', borderRadius: '12px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 90, y: 832 },
        size: { width: 280, height: 35 },
        content: 'SWIPE FOR DETAILS →',
        style: { color: '#FFFFFF', fontSize: '15px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', zIndex: 3 },
      },
    ],
    pages: [
      {
        title: 'Slide 1: Overview',
        canvasBackgroundColor: '#0A0E1A',
        elements: [
          {
            type: 'shape',
            position: { x: 50, y: 50 },
            size: { width: 900, height: 900 },
            style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.4)', zIndex: 1 },
          },
          {
            type: 'shape',
            position: { x: 90, y: 90 },
            size: { width: 200, height: 40 },
            style: { backgroundColor: '#2563EB', borderRadius: '9999px', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 90, y: 98 },
            size: { width: 200, height: 32 },
            content: 'SLIDE 1 OF 3',
            style: { color: '#FFFFFF', fontSize: '13px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 90, y: 190 },
            size: { width: 820, height: 160 },
            content: 'INTRODUCING THE NEXT GENERATION',
            style: { color: '#60A5FA', fontSize: '54px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.05', letterSpacing: '-1px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 90, y: 380 },
            size: { width: 800, height: 90 },
            content: 'Built from first principles for unprecedented performance, instant responsiveness, and seamless multi-device collaboration.',
            style: { color: '#94A3B8', fontSize: '22px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 90, y: 520 },
            size: { width: 820, height: 260 },
            style: { backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid #334155', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 130, y: 550 },
            size: { width: 740, height: 200 },
            content: '⚡ Sub-10ms Global Latency Across 28 Edge Regions\n\n🔒 Zero-Trust End-to-End Cryptographic Security\n\n📈 99.999% SLA High-Availability Distributed Core',
            style: { color: '#F1F5F9', fontSize: '19px', lineHeight: '1.8', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '700', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 90, y: 820 },
            size: { width: 280, height: 50 },
            style: { backgroundColor: '#3B82F6', borderRadius: '12px', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 90, y: 832 },
            size: { width: 280, height: 35 },
            content: 'SWIPE FOR DETAILS →',
            style: { color: '#FFFFFF', fontSize: '15px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', zIndex: 3 },
          },
        ],
      },
      {
        title: 'Slide 2: Benchmarks',
        canvasBackgroundColor: '#0A0E1A',
        elements: [
          {
            type: 'shape',
            position: { x: 50, y: 50 },
            size: { width: 900, height: 900 },
            style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.4)', zIndex: 1 },
          },
          {
            type: 'text',
            position: { x: 80, y: 90 },
            size: { width: 300, height: 30 },
            content: 'SLIDE 2 OF 3 • ARCHITECTURE',
            style: { color: '#34D399', fontSize: '14px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 80, y: 130 },
            size: { width: 840, height: 70 },
            content: 'ENGINEERED FOR PEAK SPEED',
            style: { color: '#FFFFFF', fontSize: '46px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 230 },
            size: { width: 840, height: 160 },
            style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #10B981', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 120, y: 255 },
            size: { width: 760, height: 35 },
            content: '10X LOWER MEMORY FOOTPRINT',
            style: { color: '#6EE7B7', fontSize: '22px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 120, y: 295 },
            size: { width: 760, height: 60 },
            content: 'Native compiled binaries eliminate runtime overhead, reducing cold starts to under 15 milliseconds globally.',
            style: { color: '#CBD5E1', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 420 },
            size: { width: 840, height: 160 },
            style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #3B82F6', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 120, y: 445 },
            size: { width: 760, height: 35 },
            content: 'ZERO CONFIGURATION AUTOMATION',
            style: { color: '#93C5FD', fontSize: '22px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 120, y: 485 },
            size: { width: 760, height: 60 },
            content: 'Continuous deployment pipelines synchronize state without manual provisioning or server restarts.',
            style: { color: '#CBD5E1', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 610 },
            size: { width: 840, height: 160 },
            style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #F59E0B', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 120, y: 635 },
            size: { width: 760, height: 35 },
            content: 'ENTERPRISE COMPLIANCE EMBEDDED',
            style: { color: '#FCD34D', fontSize: '22px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 120, y: 675 },
            size: { width: 760, height: 60 },
            content: 'SOC2 Type II, HIPAA & GDPR compliance out of the box with automated audit trails.',
            style: { color: '#CBD5E1', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
          },
        ],
      },
      {
        title: 'Slide 3: Getting Started',
        canvasBackgroundColor: '#0A0E1A',
        elements: [
          {
            type: 'shape',
            position: { x: 50, y: 50 },
            size: { width: 900, height: 900 },
            style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.4)', zIndex: 1 },
          },
          {
            type: 'text',
            position: { x: 80, y: 90 },
            size: { width: 300, height: 30 },
            content: 'SLIDE 3 OF 3 • GET STARTED',
            style: { color: '#FBBF24', fontSize: '14px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 80, y: 130 },
            size: { width: 840, height: 70 },
            content: 'DEPLOY IN UNDER 60 SECONDS',
            style: { color: '#FFFFFF', fontSize: '46px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 240 },
            size: { width: 840, height: 420 },
            style: { backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid #334155', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 120, y: 280 },
            size: { width: 760, height: 340 },
            content: '1. Connect your GitHub or GitLab repository\n\n2. Automatic framework detection & build optimization\n\n3. Instant preview environment with unique shareable URL\n\n4. Global production deployment with 1-click domain mapping\n\n5. Real-time telemetry, error monitoring, and traffic analytics',
            style: { color: '#F8FAFC', fontSize: '20px', lineHeight: '2.0', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 80, y: 700 },
            size: { width: 840, height: 90 },
            style: { backgroundColor: '#2563EB', borderRadius: '16px', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 100, y: 730 },
            size: { width: 800, height: 35 },
            content: 'START YOUR FREE DEVELOPER TIER TODAY →',
            style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
        ],
      },
    ],
  },

  // 2. Startup Pitch Deck: Market Opportunity (3 Slides)
  {
    description: 'Startup Pitch Deck: Market Opportunity (3 Slides)',
    category: 'Investor Deck',
    filterCategory: 'carousel',
    canvasBackgroundColor: '#030712',
    elements: [
      {
        type: 'shape',
        position: { x: 60, y: 60 },
        size: { width: 880, height: 880 },
        style: { backgroundColor: '#111827', borderRadius: '28px', border: '1px solid #1F2937', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 320, height: 30 },
        content: 'SERIES A DECK • SLIDE 1 OF 3',
        style: { color: '#10B981', fontSize: '13px', fontWeight: '800', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 150 },
        size: { width: 800, height: 120 },
        content: 'THE $42B WORKPLACE INEFFICIENCY CRISIS',
        style: { color: '#FFFFFF', fontSize: '50px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.1', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 300 },
        size: { width: 780, height: 70 },
        content: 'Knowledge workers waste 4.2 hours every single day context-switching between fragmented enterprise tools.',
        style: { color: '#9CA3AF', fontSize: '22px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 400 },
        size: { width: 380, height: 200 },
        style: { backgroundColor: '#1F2937', borderRadius: '18px', border: '1px solid #374151', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 130, y: 430 },
        size: { width: 320, height: 60 },
        content: '68%',
        style: { color: '#EF4444', fontSize: '54px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 130, y: 505 },
        size: { width: 320, height: 60 },
        content: 'Of daily work hours lost to manual notification triaging.',
        style: { color: '#D1D5DB', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 500, y: 400 },
        size: { width: 380, height: 200 },
        style: { backgroundColor: '#1F2937', borderRadius: '18px', border: '1px solid #374151', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 530, y: 430 },
        size: { width: 320, height: 60 },
        content: '$1.4M',
        style: { color: '#10B981', fontSize: '54px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 530, y: 505 },
        size: { width: 320, height: 60 },
        content: 'Annual loss per 100 enterprise engineers in lost throughput.',
        style: { color: '#D1D5DB', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 640 },
        size: { width: 780, height: 160 },
        style: { backgroundColor: '#064E3B', borderRadius: '18px', border: '1px solid #059669', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 130, y: 670 },
        size: { width: 720, height: 35 },
        content: 'OUR SOLUTION: UNIFIED AUTONOMOUS WORKSPACE',
        style: { color: '#6EE7B7', fontSize: '20px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 130, y: 715 },
        size: { width: 720, height: 50 },
        content: 'One cognitive intelligence layer that synthesizes tasks, documents, and code commits in real-time.',
        style: { color: '#ECFDF5', fontSize: '17px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 830 },
        size: { width: 780, height: 35 },
        content: 'SWIPE TO VIEW TAM & TRACTION →',
        style: { color: '#9CA3AF', fontSize: '14px', fontWeight: '800', textAlign: 'center', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
    ],
    pages: [
      {
        title: 'Slide 1: Problem Statement',
        canvasBackgroundColor: '#030712',
        elements: [
          {
            type: 'shape',
            position: { x: 60, y: 60 },
            size: { width: 880, height: 880 },
            style: { backgroundColor: '#111827', borderRadius: '28px', border: '1px solid #1F2937', zIndex: 1 },
          },
          {
            type: 'text',
            position: { x: 100, y: 100 },
            size: { width: 320, height: 30 },
            content: 'SERIES A DECK • SLIDE 1 OF 3',
            style: { color: '#10B981', fontSize: '13px', fontWeight: '800', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 100, y: 150 },
            size: { width: 800, height: 120 },
            content: 'THE $42B WORKPLACE INEFFICIENCY CRISIS',
            style: { color: '#FFFFFF', fontSize: '50px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.1', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 100, y: 400 },
            size: { width: 380, height: 200 },
            style: { backgroundColor: '#1F2937', borderRadius: '18px', border: '1px solid #374151', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 130, y: 430 },
            size: { width: 320, height: 60 },
            content: '68%',
            style: { color: '#EF4444', fontSize: '54px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 500, y: 400 },
            size: { width: 380, height: 200 },
            style: { backgroundColor: '#1F2937', borderRadius: '18px', border: '1px solid #374151', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 530, y: 430 },
            size: { width: 320, height: 60 },
            content: '$1.4M',
            style: { color: '#10B981', fontSize: '54px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
        ],
      },
      {
        title: 'Slide 2: Market Opportunity',
        canvasBackgroundColor: '#030712',
        elements: [
          {
            type: 'shape',
            position: { x: 60, y: 60 },
            size: { width: 880, height: 880 },
            style: { backgroundColor: '#111827', borderRadius: '28px', border: '1px solid #1F2937', zIndex: 1 },
          },
          {
            type: 'text',
            position: { x: 100, y: 100 },
            size: { width: 320, height: 30 },
            content: 'SERIES A DECK • SLIDE 2 OF 3',
            style: { color: '#38BDF8', fontSize: '13px', fontWeight: '800', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 100, y: 150 },
            size: { width: 800, height: 110 },
            content: 'RAPIDLY EXPANDING $118B TAM',
            style: { color: '#FFFFFF', fontSize: '50px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 100, y: 280 },
            size: { width: 780, height: 480 },
            style: { backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid #334155', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 140, y: 320 },
            size: { width: 700, height: 380 },
            content: '• TAM: $118 Billion Global Productivity & Collaboration Software\n\n• SAM: $24 Billion Developer & Enterprise Engineering Teams\n\n• SOM: $2.8 Billion High-Growth Tech Scale-ups (Initial Beachhead)\n\n• 340% YoY Net ARR Expansion Rate Across Early Beta Cohorts',
            style: { color: '#F8FAFC', fontSize: '20px', lineHeight: '2.1', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '600', zIndex: 3 },
          },
        ],
      },
      {
        title: 'Slide 3: The Ask',
        canvasBackgroundColor: '#030712',
        elements: [
          {
            type: 'shape',
            position: { x: 60, y: 60 },
            size: { width: 880, height: 880 },
            style: { backgroundColor: '#111827', borderRadius: '28px', border: '1px solid #1F2937', zIndex: 1 },
          },
          {
            type: 'text',
            position: { x: 100, y: 100 },
            size: { width: 320, height: 30 },
            content: 'SERIES A DECK • SLIDE 3 OF 3',
            style: { color: '#F59E0B', fontSize: '13px', fontWeight: '800', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'text',
            position: { x: 100, y: 150 },
            size: { width: 800, height: 110 },
            content: 'RAISING $12M SERIES A',
            style: { color: '#FFFFFF', fontSize: '52px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 100, y: 280 },
            size: { width: 780, height: 360 },
            style: { backgroundColor: '#1F2937', borderRadius: '20px', border: '1px solid #374151', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 140, y: 320 },
            size: { width: 700, height: 280 },
            content: '🎯 50% Core AI Engine & Global Distributed Edge Expansion\n\n🤝 30% Enterprise Sales, Solutions Engineering & Partnerships\n\n🛡️ 20% Security, SOC2 Compliance & Developer Evangelism',
            style: { color: '#E5E7EB', fontSize: '20px', lineHeight: '2.2', fontFamily: 'Space Grotesk, sans-serif', fontWeight: '700', zIndex: 3 },
          },
          {
            type: 'shape',
            position: { x: 100, y: 680 },
            size: { width: 780, height: 90 },
            style: { backgroundColor: '#10B981', borderRadius: '16px', zIndex: 2 },
          },
          {
            type: 'text',
            position: { x: 120, y: 710 },
            size: { width: 740, height: 35 },
            content: 'JOIN US TO SHAPE THE FUTURE OF WORK →',
            style: { color: '#FFFFFF', fontSize: '20px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
          },
        ],
      },
    ],
  },

  // 3. Python 3.12 & AI Setup Roadmap
  {
    description: 'Python & AI Dev Setup Roadmap',
    category: 'Infographic / Guide',
    filterCategory: 'infographic',
    canvasBackgroundColor: '#0F172A',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#1E293B', borderRadius: '24px', border: '1px solid #334155', zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 90 },
        size: { width: 170, height: 34 },
        style: { backgroundColor: '#38BDF8', borderRadius: '9999px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 90, y: 97 },
        size: { width: 170, height: 26 },
        content: 'DEV QUICKSTART',
        style: { color: '#0F172A', fontSize: '12px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1.5px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 90, y: 145 },
        size: { width: 820, height: 75 },
        content: 'Python 3.12 & AI Setup Guide',
        style: { color: '#F8FAFC', fontSize: '44px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 90, y: 225 },
        size: { width: 800, height: 50 },
        content: 'Zero to production-ready Python environment with uv, virtualenv, and modern typing in 4 clean steps.',
        style: { color: '#94A3B8', fontSize: '18px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 300 },
        size: { width: 820, height: 110 },
        style: { backgroundColor: '#0F172A', borderRadius: '16px', border: '1px solid #38BDF8', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 320 },
        size: { width: 760, height: 70 },
        content: '01 • Install UV Fast Package Manager\ncurl -LsSf https://astral.sh/uv/install.sh | sh',
        style: { color: '#38BDF8', fontSize: '18px', fontWeight: '700', fontFamily: 'Courier New, monospace', lineHeight: '1.6', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 430 },
        size: { width: 820, height: 110 },
        style: { backgroundColor: '#0F172A', borderRadius: '16px', border: '1px solid #34D399', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 450 },
        size: { width: 760, height: 70 },
        content: '02 • Initialize Project & Virtual Environment\nuv venv .venv && source .venv/bin/activate',
        style: { color: '#34D399', fontSize: '18px', fontWeight: '700', fontFamily: 'Courier New, monospace', lineHeight: '1.6', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 560 },
        size: { width: 820, height: 110 },
        style: { backgroundColor: '#0F172A', borderRadius: '16px', border: '1px solid #FBBF24', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 580 },
        size: { width: 760, height: 70 },
        content: '03 • Add AI & Data Science Dependencies\nuv pip install numpy pandas pydantic google-genai',
        style: { color: '#FBBF24', fontSize: '18px', fontWeight: '700', fontFamily: 'Courier New, monospace', lineHeight: '1.6', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 690 },
        size: { width: 820, height: 110 },
        style: { backgroundColor: '#0F172A', borderRadius: '16px', border: '1px solid #A78BFA', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 710 },
        size: { width: 760, height: 70 },
        content: '04 • Run Verification Script\npython -c "import google.genai; print(\'Environment Ready!\')"',
        style: { color: '#A78BFA', fontSize: '18px', fontWeight: '700', fontFamily: 'Courier New, monospace', lineHeight: '1.6', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 90, y: 840 },
        size: { width: 820, height: 35 },
        content: 'SAVE & STAR THIS CHEATSHEET FOR YOUR NEXT PROJECT',
        style: { color: '#64748B', fontSize: '13px', fontWeight: '800', textAlign: 'center', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
    ],
  },

  // 4. Cloud Architecture System Breakdown
  {
    description: 'Cloud Architecture System Breakdown',
    category: 'Infographic / Architecture',
    filterCategory: 'infographic',
    canvasBackgroundColor: '#0A0E1A',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#111827', borderRadius: '28px', border: '1px solid #1E293B', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 340, height: 30 },
        content: 'DISTRIBUTED SYSTEMS 101',
        style: { color: '#38BDF8', fontSize: '14px', fontWeight: '800', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 140 },
        size: { width: 800, height: 70 },
        content: 'Full-Stack Modern Microservices Stack',
        style: { color: '#FFFFFF', fontSize: '42px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 240 },
        size: { width: 800, height: 160 },
        style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #38BDF8', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 130, y: 265 },
        size: { width: 740, height: 35 },
        content: 'LAYER 1: GLOBAL EDGE & CDN',
        style: { color: '#38BDF8', fontSize: '18px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 130, y: 305 },
        size: { width: 740, height: 60 },
        content: 'Cloudflare Edge Workers • Dynamic Anycast Routing • SSL/TLS Termination • DDoS Mitigation',
        style: { color: '#E2E8F0', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 430 },
        size: { width: 800, height: 160 },
        style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #10B981', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 130, y: 455 },
        size: { width: 740, height: 35 },
        content: 'LAYER 2: EVENT-DRIVEN COMPUTE CORE',
        style: { color: '#34D399', fontSize: '18px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 130, y: 495 },
        size: { width: 740, height: 60 },
        content: 'Next.js App Server • Kafka Message Streaming • Redis Cluster Cache • gRPC Internal RPC',
        style: { color: '#E2E8F0', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 620 },
        size: { width: 800, height: 160 },
        style: { backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #F59E0B', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 130, y: 645 },
        size: { width: 740, height: 35 },
        content: 'LAYER 3: RELATIONAL PERSISTENCE & ANALYTICS',
        style: { color: '#FCD34D', fontSize: '18px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 130, y: 685 },
        size: { width: 740, height: 60 },
        content: 'PostgreSQL Cloud SQL • ClickHouse Columnar OLAP • AWS S3 Multi-Region Object Storage',
        style: { color: '#E2E8F0', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 830 },
        size: { width: 800, height: 30 },
        content: 'SCALE TO 10M+ DAILY ACTIVE USERS WITHOUT RE-ARCHITECTING',
        style: { color: '#64748B', fontSize: '13px', fontWeight: '800', textAlign: 'center', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
    ],
  },

  // 5. AI & Tech Keynote Summit 2026
  {
    description: 'AI & Tech Keynote Summit 2026',
    category: 'Technology',
    filterCategory: 'marketing',
    canvasBackgroundColor: '#090D16',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#111827', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.3)', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 100, y: 110 },
        size: { width: 300, height: 36 },
        content: 'ANNUAL GLOBAL SUMMIT',
        style: { color: '#60A5FA', fontSize: '14px', fontWeight: '800', letterSpacing: '3px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 160 },
        size: { width: 800, height: 130 },
        content: 'THE FUTURE OF ARTIFICIAL INTELLIGENCE',
        style: { color: '#FFFFFF', fontSize: '52px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.1', zIndex: 3 },
      },
      {
        type: 'image',
        position: { x: 100, y: 320 },
        size: { width: 800, height: 420 },
        source: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
        content: 'Tech Summit Stage',
        style: { borderRadius: '16px', zIndex: 2 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 790 },
        size: { width: 260, height: 60 },
        style: { backgroundColor: '#2563EB', borderRadius: '12px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 800 },
        size: { width: 260, height: 40 },
        content: 'REGISTER NOW',
        style: { color: '#FFFFFF', fontSize: '18px', fontWeight: '700', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
      {
        type: 'text',
        position: { x: 400, y: 805 },
        size: { width: 500, height: 40 },
        content: 'OCTOBER 24-26 • METROPOLIS CENTER',
        style: { color: '#94A3B8', fontSize: '16px', fontWeight: '600', textAlign: 'right', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
    ],
  },

  // 6. Flash Mega Weekend Sale - 50% Off
  {
    description: 'Flash Mega Weekend Sale - 50% Off',
    category: 'Retail & Sale',
    filterCategory: 'marketing',
    canvasBackgroundColor: '#991B1B',
    elements: [
      {
        type: 'shape',
        position: { x: 60, y: 60 },
        size: { width: 880, height: 880 },
        style: { backgroundColor: '#DC2626', borderRadius: '24px', border: '3px solid #FEF08A', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 100, y: 130 },
        size: { width: 800, height: 60 },
        content: 'THIS WEEKEND ONLY',
        style: { color: '#FEF08A', fontSize: '24px', fontWeight: '900', textAlign: 'center', letterSpacing: '4px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 200 },
        size: { width: 800, height: 160 },
        content: 'MEGA SALE 50% OFF',
        style: { color: '#FFFFFF', fontSize: '72px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.05', zIndex: 3 },
      },
      {
        type: 'image',
        position: { x: 140, y: 390 },
        size: { width: 720, height: 350 },
        source: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80',
        content: 'Fashion sale items',
        style: { borderRadius: '16px', zIndex: 2 },
      },
      {
        type: 'shape',
        position: { x: 260, y: 770 },
        size: { width: 480, height: 64 },
        style: { backgroundColor: '#FEF08A', borderRadius: '9999px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 260, y: 785 },
        size: { width: 480, height: 34 },
        content: 'SHOP ONLINE & IN STORE',
        style: { color: '#991B1B', fontSize: '20px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
    ],
  },

  // 7. Modern Real Estate Luxury Property
  {
    description: 'Modern Real Estate Luxury Property',
    category: 'Real Estate Flyer',
    filterCategory: 'marketing',
    canvasBackgroundColor: '#F8FAFC',
    elements: [
      {
        type: 'image',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 480 },
        source: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        content: 'Modern luxury home',
        style: { borderRadius: '24px', zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 90 },
        size: { width: 220, height: 44 },
        style: { backgroundColor: '#0F172A', borderRadius: '9999px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 90, y: 100 },
        size: { width: 220, height: 30 },
        content: 'JUST LISTED • $2,850,000',
        style: { color: '#38BDF8', fontSize: '13px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 560 },
        size: { width: 800, height: 370 },
        style: { backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 140, y: 600 },
        size: { width: 720, height: 70 },
        content: 'The Glass Pavilion at Crestview Hills',
        style: { color: '#0F172A', fontSize: '38px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 140, y: 680 },
        size: { width: 720, height: 60 },
        content: '5 Bedrooms • 6 Bathrooms • 6,200 Sq Ft • Infinity Pool • Panoramic Canyon Views',
        style: { color: '#64748B', fontSize: '18px', fontWeight: '600', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 140, y: 770 },
        size: { width: 320, height: 56 },
        style: { backgroundColor: '#0F172A', borderRadius: '12px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 140, y: 785 },
        size: { width: 320, height: 30 },
        content: 'SCHEDULE PRIVATE TOUR',
        style: { color: '#FFFFFF', fontSize: '15px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
    ],
  },

  // 8. Artisan Bakery & Café Opening
  {
    description: 'Artisan Bakery & Café Opening',
    category: 'Food & Beverage',
    filterCategory: 'marketing',
    canvasBackgroundColor: '#FBF8F3',
    elements: [
      {
        type: 'image',
        position: { x: 80, y: 80 },
        size: { width: 840, height: 460 },
        source: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
        content: 'Fresh Sourdough Bread',
        style: { borderRadius: '24px', zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 140, y: 500 },
        size: { width: 720, height: 380 },
        style: { backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E5E7EB', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 170, y: 540 },
        size: { width: 660, height: 30 },
        content: 'ORGANIC • STONE-MILLED • HOMEMADE',
        style: { color: '#D97706', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 170, y: 580 },
        size: { width: 660, height: 80 },
        content: 'Artisan Bakehouse Grand Opening',
        style: { color: '#1C1917', fontSize: '42px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 190, y: 670 },
        size: { width: 620, height: 60 },
        content: 'Join us this Saturday for complimentary espresso with any fresh sourdough pastry.',
        style: { color: '#78716C', fontSize: '18px', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 350, y: 760 },
        size: { width: 300, height: 50 },
        style: { backgroundColor: '#B45309', borderRadius: '9999px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 350, y: 770 },
        size: { width: 300, height: 30 },
        content: 'CLAIM 20% DISCOUNT',
        style: { color: '#FFFFFF', fontSize: '14px', fontWeight: '700', textAlign: 'center', fontFamily: 'Inter, sans-serif', zIndex: 4 },
      },
    ],
  },

  // 9. Cyberpunk Neon Music Festival
  {
    description: 'Cyberpunk Neon Music Festival',
    category: 'Entertainment',
    filterCategory: 'social',
    canvasBackgroundColor: '#120224',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#21094E', borderRadius: '32px', border: '2px solid #E056FD', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 80, y: 120 },
        size: { width: 840, height: 110 },
        content: 'SYNTHWAVE 2099',
        style: { color: '#F368E0', fontSize: '68px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '4px', zIndex: 3 },
      },
      {
        type: 'image',
        position: { x: 120, y: 250 },
        size: { width: 760, height: 420 },
        source: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
        content: 'Music festival lights',
        style: { borderRadius: '20px', border: '2px solid #FF9FF3', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 100, y: 710 },
        size: { width: 800, height: 40 },
        content: 'LIVE ELECTRONIC • RETRO FUTURE • VISUALS',
        style: { color: '#FECA57', fontSize: '20px', fontWeight: '800', textAlign: 'center', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 280, y: 780 },
        size: { width: 440, height: 60 },
        style: { backgroundColor: '#FF4757', borderRadius: '9999px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 280, y: 792 },
        size: { width: 440, height: 36 },
        content: 'GET TICKETS NOW',
        style: { color: '#FFFFFF', fontSize: '18px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
    ],
  },

  // 10. Minimalist Thought Leadership & Brand Poster
  {
    description: 'Minimalist Thought Leadership Poster',
    category: 'Editorial Poster',
    filterCategory: 'business',
    canvasBackgroundColor: '#F8FAFC',
    elements: [
      {
        type: 'shape',
        position: { x: 60, y: 60 },
        size: { width: 880, height: 880 },
        style: { backgroundColor: '#FFFFFF', borderRadius: '28px', border: '1px solid #E2E8F0', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 120, y: 120 },
        size: { width: 280, height: 30 },
        content: 'PERSPECTIVES ON DESIGN',
        style: { color: '#64748B', fontSize: '13px', fontWeight: '800', letterSpacing: '3px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 180 },
        size: { width: 760, height: 320 },
        content: '“Simplicity is not the lack of clutter, that’s a consequence of simplicity. Simplicity somehow essentially describes the purpose and place of an object.”',
        style: { color: '#0F172A', fontSize: '42px', fontWeight: '900', fontFamily: 'Playfair Display, serif', lineHeight: '1.25', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 120, y: 530 },
        size: { width: 80, height: 6 },
        style: { backgroundColor: '#3B82F6', borderRadius: '9999px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 570 },
        size: { width: 700, height: 36 },
        content: 'JONY IVE • CHIEF DESIGN OFFICER',
        style: { color: '#1E293B', fontSize: '18px', fontWeight: '800', letterSpacing: '1px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 615 },
        size: { width: 700, height: 50 },
        content: 'Focusing on what truly matters by removing everything superfluous.',
        style: { color: '#64748B', fontSize: '16px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 120, y: 780 },
        size: { width: 760, height: 64 },
        style: { backgroundColor: '#F1F5F9', borderRadius: '14px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 150, y: 802 },
        size: { width: 700, height: 30 },
        content: 'CURATED BY BLUEPRINT STUDIO • SHARE ON LINKEDIN & X',
        style: { color: '#475569', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
    ],
  },

  // 11. YouTube Hero Banner / Podcast Episode
  {
    description: 'YouTube / Podcast Cover Banner',
    category: 'Creator & Media',
    filterCategory: 'social',
    canvasBackgroundColor: '#0B0F19',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#111827', borderRadius: '32px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#1E293B', zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 100 },
        size: { width: 180, height: 36 },
        style: { backgroundColor: '#EF4444', borderRadius: '9999px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 100, y: 107 },
        size: { width: 180, height: 26 },
        content: 'EPISODE #42',
        style: { color: '#FFFFFF', fontSize: '13px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 160 },
        size: { width: 800, height: 140 },
        content: 'BUILDING A $10M BOOTSTRAPPED EMPIRE',
        style: { color: '#FFFFFF', fontSize: '56px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.05', zIndex: 3 },
      },
      {
        type: 'image',
        position: { x: 100, y: 330 },
        size: { width: 800, height: 400 },
        source: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80',
        content: 'Podcast Studio Microphone',
        style: { borderRadius: '20px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 100, y: 770 },
        size: { width: 800, height: 40 },
        content: 'FEATURING SARAH LIN • FOUNDER & CEO OF APEX',
        style: { color: '#94A3B8', fontSize: '18px', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 820 },
        size: { width: 260, height: 50 },
        style: { backgroundColor: '#EF4444', borderRadius: '12px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 832 },
        size: { width: 260, height: 32 },
        content: 'LISTEN ON SPOTIFY & APPLE',
        style: { color: '#FFFFFF', fontSize: '13px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
    ],
  },

  // 12. Fitness & 30-Day Wellness Transformation
  {
    description: 'Fitness & 30-Day Transformation',
    category: 'Health & Wellness',
    filterCategory: 'social',
    canvasBackgroundColor: '#0A0A0A',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#171717', borderRadius: '28px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#262626', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 100, y: 110 },
        size: { width: 300, height: 30 },
        content: '30-DAY HABIT CHALLENGE',
        style: { color: '#E11D48', fontSize: '14px', fontWeight: '900', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 150 },
        size: { width: 800, height: 120 },
        content: 'UNLEASH PEAK HUMAN PERFORMANCE',
        style: { color: '#FFFFFF', fontSize: '50px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.05', zIndex: 3 },
      },
      {
        type: 'image',
        position: { x: 100, y: 300 },
        size: { width: 800, height: 360 },
        source: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
        content: 'Athlete Training',
        style: { borderRadius: '18px', zIndex: 2 },
      },
      {
        type: 'shape',
        position: { x: 100, y: 690 },
        size: { width: 800, height: 100 },
        style: { backgroundColor: '#262626', borderRadius: '16px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 130, y: 710 },
        size: { width: 740, height: 60 },
        content: '💧 3L Water Daily • 💤 8 Hours Deep Sleep • 🏋️‍♂️ 45 Min Progressive Overload',
        style: { color: '#F5F5F5', fontSize: '18px', fontWeight: '700', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 300, y: 820 },
        size: { width: 400, height: 50 },
        style: { backgroundColor: '#E11D48', borderRadius: '9999px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 300, y: 832 },
        size: { width: 400, height: 30 },
        content: 'DOWNLOAD FREE 30-DAY PLAN →',
        style: { color: '#FFFFFF', fontSize: '15px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
    ],
  },

  // 13. We Are Hiring: Senior Product Designer
  {
    description: 'Hiring Announcement: Senior Designer',
    category: 'Recruiting & Career',
    filterCategory: 'business',
    canvasBackgroundColor: '#F8FAFC',
    elements: [
      {
        type: 'shape',
        position: { x: 60, y: 60 },
        size: { width: 880, height: 880 },
        style: { backgroundColor: '#FFFFFF', borderRadius: '28px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E2E8F0', zIndex: 1 },
      },
      {
        type: 'shape',
        position: { x: 110, y: 110 },
        size: { width: 170, height: 36 },
        style: { backgroundColor: '#ECFDF5', borderWidth: '1px', borderStyle: 'solid', borderColor: '#10B981', borderRadius: '9999px', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 110, y: 118 },
        size: { width: 170, height: 24 },
        content: '100% REMOTE • FULL-TIME',
        style: { color: '#059669', fontSize: '11px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 110, y: 170 },
        size: { width: 780, height: 120 },
        content: 'WE ARE HIRING: SENIOR PRODUCT DESIGNER',
        style: { color: '#0F172A', fontSize: '50px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', lineHeight: '1.1', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 110, y: 310 },
        size: { width: 780, height: 60 },
        content: '$140k – $180k USD + Meaningful Equity • Comprehensive Health & Equipment Stipend',
        style: { color: '#2563EB', fontSize: '20px', fontWeight: '700', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 110, y: 390 },
        size: { width: 780, height: 320 },
        style: { backgroundColor: '#F8FAFC', borderRadius: '20px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E2E8F0', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 140, y: 420 },
        size: { width: 720, height: 260 },
        content: 'What you will do:\n• Lead design architecture for next-gen creative productivity tools\n• Collaborate directly with founding engineers & executives\n• Conduct user interviews, rapid prototypes, and high-fidelity specs\n• Build and scale our cohesive multi-platform design token system',
        style: { color: '#334155', fontSize: '18px', lineHeight: '1.9', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 110, y: 750 },
        size: { width: 340, height: 60 },
        style: { backgroundColor: '#0F172A', borderRadius: '14px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 110, y: 766 },
        size: { width: 340, height: 32 },
        content: 'APPLY NOW: JOBS@COMPANY.IO',
        style: { color: '#FFFFFF', fontSize: '15px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 4 },
      },
    ],
  },

  // 14. Customer Testimonial & Social Proof Spotlight
  {
    description: 'Customer Testimonial Spotlight',
    category: 'Social Proof',
    filterCategory: 'marketing',
    canvasBackgroundColor: '#F8FAFC',
    elements: [
      {
        type: 'shape',
        position: { x: 60, y: 60 },
        size: { width: 880, height: 880 },
        style: { backgroundColor: '#FFFFFF', borderRadius: '32px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#E2E8F0', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 120, y: 120 },
        size: { width: 760, height: 40 },
        content: '★★★★★ VERIFIED 5-STAR REVIEW',
        style: { color: '#F59E0B', fontSize: '18px', fontWeight: '900', letterSpacing: '2px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 190 },
        size: { width: 760, height: 260 },
        content: '“Blueprint replaced three disconnected design tools in our growth stack. We went from spending 12 hours a week designing slide decks to producing high-impact graphics in minutes.”',
        style: { color: '#0F172A', fontSize: '36px', fontWeight: '800', fontFamily: 'Playfair Display, serif', lineHeight: '1.3', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 120, y: 490 },
        size: { width: 760, height: 2 },
        style: { backgroundColor: '#E2E8F0', zIndex: 2 },
      },
      {
        type: 'image',
        position: { x: 120, y: 530 },
        size: { width: 100, height: 100 },
        source: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        content: 'Customer Avatar',
        style: { borderRadius: '9999px', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 250, y: 545 },
        size: { width: 600, height: 35 },
        content: 'Elena Rostova',
        style: { color: '#0F172A', fontSize: '26px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 250, y: 585 },
        size: { width: 600, height: 30 },
        content: 'Head of Growth • Horizon Technologies',
        style: { color: '#64748B', fontSize: '18px', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 120, y: 700 },
        size: { width: 760, height: 120 },
        style: { backgroundColor: '#EFF6FF', borderRadius: '18px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#BFDBFE', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 160, y: 725 },
        size: { width: 680, height: 70 },
        content: '📈 4.8x Higher LinkedIn Engagement • 62% Reduced Production Time',
        style: { color: '#1E40AF', fontSize: '18px', fontWeight: '800', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
    ],
  },

  // 15. SaaS Pricing Tier Comparison Matrix
  {
    description: 'SaaS Pricing Tier Comparison',
    category: 'Pricing Matrix',
    filterCategory: 'business',
    canvasBackgroundColor: '#0F172A',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#1E293B', borderRadius: '28px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#334155', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 800, height: 40 },
        content: 'SIMPLE, TRANSPARENT PRICING',
        style: { color: '#38BDF8', fontSize: '16px', fontWeight: '900', textAlign: 'center', letterSpacing: '3px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 145 },
        size: { width: 800, height: 60 },
        content: 'Choose The Plan That Scales With You',
        style: { color: '#FFFFFF', fontSize: '42px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 90, y: 240 },
        size: { width: 390, height: 570 },
        style: { backgroundColor: '#0F172A', borderRadius: '20px', borderWidth: '1px', borderStyle: 'solid', borderColor: '#334155', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 120, y: 280 },
        size: { width: 330, height: 35 },
        content: 'PRO PLAN',
        style: { color: '#94A3B8', fontSize: '18px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 320 },
        size: { width: 330, height: 60 },
        content: '$29 / mo',
        style: { color: '#FFFFFF', fontSize: '44px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 120, y: 400 },
        size: { width: 330, height: 260 },
        content: '✓ Unlimited Graphics Exports\n✓ High-Res Multi-Page PDF\n✓ 50+ Curated Templates\n✓ 8-Point Vector Snapping\n✓ Personal Commercial License',
        style: { color: '#CBD5E1', fontSize: '16px', lineHeight: '2.2', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 520, y: 240 },
        size: { width: 390, height: 570 },
        style: { backgroundColor: '#1E1B4B', borderRadius: '20px', borderWidth: '2px', borderStyle: 'solid', borderColor: '#818CF8', zIndex: 2 },
      },
      {
        type: 'shape',
        position: { x: 670, y: 215 },
        size: { width: 150, height: 30 },
        style: { backgroundColor: '#6366F1', borderRadius: '9999px', zIndex: 4 },
      },
      {
        type: 'text',
        position: { x: 670, y: 220 },
        size: { width: 150, height: 22 },
        content: 'MOST POPULAR',
        style: { color: '#FFFFFF', fontSize: '10px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', zIndex: 5 },
      },
      {
        type: 'text',
        position: { x: 550, y: 280 },
        size: { width: 330, height: 35 },
        content: 'TEAM STUDIO',
        style: { color: '#A5B4FC', fontSize: '18px', fontWeight: '800', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 550, y: 320 },
        size: { width: 330, height: 60 },
        content: '$79 / mo',
        style: { color: '#FFFFFF', fontSize: '44px', fontWeight: '900', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 550, y: 400 },
        size: { width: 330, height: 260 },
        content: '✓ Everything in Pro Plan\n✓ Up to 10 Team Collaborators\n✓ Brand Kit Font & Palette Sync\n✓ Multi-Slide Carousel Builder\n✓ Dedicated Slack Support',
        style: { color: '#E0E7FF', fontSize: '16px', lineHeight: '2.2', fontFamily: 'Inter, sans-serif', fontWeight: '500', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 550, y: 690 },
        size: { width: 330, height: 50 },
        style: { backgroundColor: '#6366F1', borderRadius: '12px', zIndex: 4 },
      },
      {
        type: 'text',
        position: { x: 550, y: 702 },
        size: { width: 330, height: 30 },
        content: 'START 14-DAY FREE TRIAL',
        style: { color: '#FFFFFF', fontSize: '14px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 5 },
      },
    ],
  },

  // 16. Certificate of Excellence & Achievement
  {
    description: 'Certificate of Excellence & Achievement',
    category: 'Award & Recognition',
    filterCategory: 'other',
    canvasBackgroundColor: '#FAF8F5',
    elements: [
      {
        type: 'shape',
        position: { x: 50, y: 50 },
        size: { width: 900, height: 900 },
        style: { backgroundColor: '#FFFFFF', borderRadius: '16px', borderWidth: '8px', borderStyle: 'double', borderColor: '#B45309', zIndex: 1 },
      },
      {
        type: 'text',
        position: { x: 100, y: 130 },
        size: { width: 800, height: 35 },
        content: 'CERTIFICATE OF ACHIEVEMENT',
        style: { color: '#92400E', fontSize: '18px', fontWeight: '900', letterSpacing: '4px', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 190 },
        size: { width: 800, height: 80 },
        content: 'OUTSTANDING EXCELLENCE IN DESIGN',
        style: { color: '#1C1917', fontSize: '38px', fontWeight: '900', textAlign: 'center', fontFamily: 'Playfair Display, serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 310 },
        size: { width: 800, height: 30 },
        content: 'THIS RECOGNITION IS PROUDLY PRESENTED TO',
        style: { color: '#78716C', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 100, y: 370 },
        size: { width: 800, height: 80 },
        content: 'Alexander Wright',
        style: { color: '#B45309', fontSize: '54px', fontWeight: '900', textAlign: 'center', fontFamily: 'Playfair Display, serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 300, y: 460 },
        size: { width: 400, height: 2 },
        style: { backgroundColor: '#D97706', zIndex: 2 },
      },
      {
        type: 'text',
        position: { x: 150, y: 500 },
        size: { width: 700, height: 80 },
        content: 'For exemplary contributions, creative mastery, and leadership in elevating digital product experiences across the organization.',
        style: { color: '#57534E', fontSize: '18px', textAlign: 'center', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', zIndex: 3 },
      },
      {
        type: 'shape',
        position: { x: 440, y: 640 },
        size: { width: 120, height: 120 },
        style: { backgroundColor: '#F59E0B', shapeType: 'badge-ribbon', zIndex: 3 },
      },
      {
        type: 'text',
        position: { x: 440, y: 685 },
        size: { width: 120, height: 30 },
        content: 'OFFICIAL SEAL',
        style: { color: '#78350F', fontSize: '10px', fontWeight: '900', textAlign: 'center', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '1px', zIndex: 4 },
      },
      {
        type: 'text',
        position: { x: 100, y: 810 },
        size: { width: 800, height: 30 },
        content: 'VERIFIED CREDENTIAL ID: BP-2026-EXCELLENCE',
        style: { color: '#A8A29E', fontSize: '12px', fontWeight: '700', textAlign: 'center', letterSpacing: '1px', fontFamily: 'Space Grotesk, sans-serif', zIndex: 3 },
      },
    ],
  },
];

export function TemplateLibrary({ onLayoutSelect }: TemplateLibraryProps) {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectTemplate = (templateSchema: any) => {
    const layoutWithIds = addIdsToLayout(templateSchema);
    onLayoutSelect(layoutWithIds);
    const count = layoutWithIds.pages?.length || 1;
    toast({
      title: count > 1 ? `${count}-Slide Carousel Applied` : 'Template Applied',
      description: `"${layoutWithIds.description}" is ready to edit on canvas.`,
    });
  };

  const categories = [
    { id: 'all', label: `All (${PREDEFINED_TEMPLATES.length})` },
    { id: 'carousel', label: 'Carousels' },
    { id: 'infographic', label: 'Infographics' },
    { id: 'marketing', label: 'Marketing & Sales' },
    { id: 'social', label: 'Social & Media' },
    { id: 'business', label: 'Business & Career' },
  ];

  const filteredTemplates = PREDEFINED_TEMPLATES.filter((template) => {
    const matchesCategory = filterCategory === 'all' || template.filterCategory === filterCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 space-y-3.5 flex flex-col min-h-full overflow-y-auto">
      <div>
        <h2 className="text-sm font-bold font-headline flex items-center justify-between">
          <span>Preset Templates</span>
          <span className="text-[11px] font-mono text-primary font-bold">
            {filteredTemplates.length} Available
          </span>
        </h2>
        <p className="text-xs text-muted-foreground">Select a high-converting baseline layout</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search templates (carousel, guide, poster)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 pl-8 text-xs bg-muted/40"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFilterCategory(cat.id)}
            className={`px-2.5 py-1 text-[11px] rounded-full whitespace-nowrap font-medium transition-colors ${
              filterCategory === cat.id
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 gap-3 overflow-y-auto flex-grow pr-1">
        {filteredTemplates.map((template, index) => {
          const slideCount = template.pages?.length || 1;
          const isCarousel = slideCount > 1;

          return (
            <Card
              key={index}
              className="overflow-hidden border border-border/70 hover:border-primary transition-all shadow-sm group hover:shadow-md"
            >
              {/* Color Banner */}
              <div
                className="h-12 w-full flex items-center justify-between px-3 text-white relative overflow-hidden"
                style={{ backgroundColor: template.canvasBackgroundColor || '#1E293B' }}
              >
                <div className="absolute inset-0 bg-black/20" />
                <span className="relative z-10 text-[11px] font-bold uppercase tracking-wider">
                  {template.category}
                </span>

                <div className="relative z-10 flex items-center gap-1.5">
                  {isCarousel && (
                    <span className="bg-white/20 backdrop-blur-sm text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Layers className="h-2.5 w-2.5" />
                      {slideCount} Slides
                    </span>
                  )}
                  <Sparkles className="h-3.5 w-3.5 text-white/80" />
                </div>
              </div>

              <CardContent className="p-3 text-xs">
                <h3 className="font-semibold text-foreground leading-snug break-words">{template.description}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal">
                  {isCarousel
                    ? `Full Carousel Presentation • ${template.canvasBackgroundColor}`
                    : `${template.elements.length} Components • Canvas: ${template.canvasBackgroundColor}`}
                </p>
              </CardContent>

              <CardFooter className="p-3 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full text-xs h-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Apply Template
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No templates found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
