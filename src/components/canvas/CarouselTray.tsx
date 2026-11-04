'use client';

import React from 'react';
import type { DesignPage } from '@/types/blueprint';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Copy,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselTrayProps {
  pages: DesignPage[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onReorderPage: (fromIndex: number, toIndex: number) => void;
}

export function CarouselTray({
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onReorderPage,
}: CarouselTrayProps) {
  const totalPages = pages.length;
  const isMultiPage = totalPages > 1;

  return (
    <div className="w-full bg-background/95 backdrop-blur-md border-t border-border px-4 py-2 flex items-center justify-between shrink-0 select-none z-30 shadow-xs">
      {/* Left: Carousel Stats & Quick Nav */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border text-xs font-semibold text-foreground">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span>
            Slide <span className="text-primary">{activePageIndex + 1}</span> of {totalPages}
          </span>
          {isMultiPage && (
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-muted-foreground bg-primary/10 text-primary px-1.5 py-0.2 rounded font-bold">
              Carousel
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground disabled:opacity-30"
            disabled={activePageIndex === 0}
            onClick={() => onSelectPage(Math.max(0, activePageIndex - 1))}
            title="Previous Slide (Alt+Left or PageUp)"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground disabled:opacity-30"
            disabled={activePageIndex >= totalPages - 1}
            onClick={() => onSelectPage(Math.min(totalPages - 1, activePageIndex + 1))}
            title="Next Slide (Alt+Right or PageDown)"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Center: Scrollable Slide Strip */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 px-2 max-w-full mx-2 scrollbar-thin">
        {pages.map((page, idx) => {
          const isActive = idx === activePageIndex;
          const elementCount = page.elements?.length || 0;
          const bgColor = page.canvasBackgroundColor || '#FFFFFF';

          return (
            <div
              key={page.id || idx}
              onClick={() => onSelectPage(idx)}
              className={cn(
                'group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-all shrink-0',
                isActive
                  ? 'bg-primary/10 border-primary text-foreground font-semibold shadow-xs ring-1 ring-primary/40'
                  : 'bg-card hover:bg-muted/60 border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Mini Slide Preview Color Indicator */}
              <div
                className="w-4 h-4 rounded-md border shadow-2xs shrink-0 flex items-center justify-center text-[9px] font-bold"
                style={{
                  backgroundColor: bgColor,
                  color: bgColor === '#FFFFFF' || bgColor.toLowerCase().includes('white') ? '#000000' : '#FFFFFF',
                }}
              >
                {idx + 1}
              </div>

              {/* Title & Count */}
              <div className="flex flex-col text-left">
                <span className="leading-tight truncate max-w-[110px]">
                  {page.title || `Slide ${idx + 1}`}
                </span>
                <span className="text-[10px] text-muted-foreground font-normal leading-tight">
                  {elementCount} {elementCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Action Buttons on Active / Hover */}
              <div className={cn('items-center gap-0.5 ml-1', isActive ? 'flex' : 'hidden group-hover:flex')}>
                {/* Move Left */}
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderPage(idx, idx - 1);
                    }}
                    className="p-1 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground"
                    title="Move Slide Earlier"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </button>
                )}

                {/* Move Right */}
                {idx < totalPages - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderPage(idx, idx + 1);
                    }}
                    className="p-1 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground"
                    title="Move Slide Later"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicatePage(idx);
                  }}
                  className="p-1 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground"
                  title="Duplicate Slide"
                >
                  <Copy className="h-3 w-3" />
                </button>

                {/* Delete (if > 1) */}
                {totalPages > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(idx);
                    }}
                    className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                    title="Delete Slide"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Slide Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onAddPage}
          className="h-9 px-3 rounded-xl gap-1.5 text-xs text-foreground border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 shrink-0"
        >
          <Plus className="h-3.5 w-3.5 text-primary" />
          <span>Add Slide</span>
        </Button>
      </div>

      {/* Right: Quick Multi-Slide Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDuplicatePage(activePageIndex)}
          className="h-8 px-2.5 text-xs gap-1 text-muted-foreground hover:text-foreground hidden md:flex"
          title="Clone current slide"
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Clone</span>
        </Button>

        {totalPages > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeletePage(activePageIndex)}
            className="h-8 px-2 text-xs gap-1 text-destructive hover:bg-destructive/10 hidden md:flex"
            title="Delete current slide"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
        )}
      </div>
    </div>
  );
}
