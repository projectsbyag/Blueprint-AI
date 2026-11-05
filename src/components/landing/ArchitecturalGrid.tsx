'use client';

import React from 'react';

interface ArchitecturalGridProps {
  children?: React.ReactNode;
  className?: string;
  showCoordinates?: boolean;
}

export function ArchitecturalGrid({
  children,
  className = '',
  showCoordinates = true,
}: ArchitecturalGridProps) {
  return (
    <div className={`relative w-full bg-[#F5F7FA] text-[#1E293B] overflow-hidden ${className}`}>
      {/* Precision Blueprint Grid Background using CSS gradients */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, #DCE5F0 1px, transparent 1px),
            linear-gradient(to bottom, #DCE5F0 1px, transparent 1px),
            linear-gradient(to right, rgba(91, 141, 239, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91, 141, 239, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 24px 24px, 120px 120px, 120px 120px',
        }}
      />

      {/* Perimeter Sheet Registration Marks & Coordinates */}
      {showCoordinates && (
        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-between p-4 sm:p-6 opacity-60 text-[10px] font-mono text-[#64748B] select-none">
          {/* Top Row: Coordinates & Corner Marks */}
          <div className="flex items-center justify-between border-b border-[#CBD5E1]/60 pb-2">
            <div className="flex items-center gap-3">
              <span className="text-[#5B8DEF] font-bold">┌ DWG. REF: BP-2026</span>
              <span className="hidden md:inline">· SCALE: 1:1 METRIC</span>
              <span className="hidden lg:inline">· ORTHOGRAPHIC PROJECTION</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">COORD: 40°42′N / 74°00′W</span>
              <span className="text-[#5B8DEF] font-bold">SHEET 01 // 01 ┐</span>
            </div>
          </div>

          {/* Floating Subtle Crosshair Marks at 120px intervals */}
          <div className="relative flex-1 w-full my-4">
            <span className="absolute top-[120px] left-[120px] text-[#5B8DEF]/70 font-mono text-xs">+</span>
            <span className="absolute top-[120px] right-[120px] text-[#5B8DEF]/70 font-mono text-xs">+</span>
            <span className="absolute top-[360px] left-[240px] text-[#5B8DEF]/50 font-mono text-xs">+</span>
            <span className="absolute top-[360px] right-[240px] text-[#5B8DEF]/50 font-mono text-xs">+</span>
            <span className="absolute top-[600px] left-[120px] text-[#5B8DEF]/70 font-mono text-xs">+</span>
            <span className="absolute top-[600px] right-[120px] text-[#5B8DEF]/70 font-mono text-xs">+</span>
          </div>

          {/* Bottom Row: Sheet Verification */}
          <div className="flex items-center justify-between border-t border-[#CBD5E1]/60 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-[#5B8DEF] font-bold">└ SYSTEM: VECTOR STUDIO</span>
              <span className="hidden md:inline">· RESOLUTION: 1080×1350 PX</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">STATUS: APPROVED FOR PRODUCTION</span>
              <span className="text-[#5B8DEF] font-bold">REV: 04.2 ┘</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
