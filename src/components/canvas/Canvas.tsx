'use client';

import type { DesignLayout, DesignElement } from '@/types/blueprint';
import { CanvasElement } from './CanvasElement';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Sparkles,
  AlignHorizontalJustifyCenter,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CanvasProps {
  design: DesignLayout | null;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement?: (updatedElement: DesignElement) => void;
  onDeleteElement?: (elementId: string) => void;
  onDuplicateElement?: (elementId: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onLayoutUpdate?: (newDesign: DesignLayout) => void;
  className?: string;
}

const CANVAS_BASE_WIDTH = 1000;
const CANVAS_BASE_HEIGHT = 1000;

// Curated experimental color palettes for 1-click theme shifts
const EXPERIMENTAL_PALETTES = [
  {
    name: 'Midnight Luxe',
    bg: '#0B0F19',
    card: '#111827',
    primary: '#F59E0B',
    text: '#FFFFFF',
    accent: '#3B82F6',
  },
  {
    name: 'Cyberpunk Neon',
    bg: '#0F051D',
    card: '#1E0B36',
    primary: '#F43F5E',
    text: '#38BDF8',
    accent: '#FACC15',
  },
  {
    name: 'Nordic Clean Slate',
    bg: '#F8FAFC',
    card: '#FFFFFF',
    primary: '#0F172A',
    text: '#0F172A',
    accent: '#0284C7',
  },
  {
    name: 'Warm Artisan Terracotta',
    bg: '#FAF5EE',
    card: '#FFFFFF',
    primary: '#C2410C',
    text: '#431407',
    accent: '#D97706',
  },
  {
    name: 'Emerald Forest',
    bg: '#052E16',
    card: '#064E3B',
    primary: '#34D399',
    text: '#ECFDF5',
    accent: '#FDE047',
  },
];

export function Canvas({
  design,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onLayoutUpdate,
  className,
}: CanvasProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [scale, setScale] = useState(0.65);
  const [showGrid, setShowGrid] = useState(false);
  const [paletteIndex, setPaletteIndex] = useState(0);

  // Drag state
  const [dragState, setDragState] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    initialElemX: number;
    initialElemY: number;
  } | null>(null);

  // Resize state
  const [resizeState, setResizeState] = useState<{
    elementId: string;
    corner: 'br' | 'tl' | 'tr' | 'bl';
    startX: number;
    startY: number;
    initialW: number;
    initialH: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const calculateAutoFitScale = useCallback(() => {
    if (canvasContainerRef.current) {
      const containerWidth = canvasContainerRef.current.offsetWidth - 80;
      const containerHeight = canvasContainerRef.current.offsetHeight - 90;
      if (containerWidth > 0 && containerHeight > 0) {
        const minDim = Math.min(containerWidth, containerHeight);
        const newScale = Math.min(1.2, Math.max(0.25, minDim / CANVAS_BASE_WIDTH));
        setScale(newScale);
      }
    }
  }, []);

  useEffect(() => {
    calculateAutoFitScale();
    window.addEventListener('resize', calculateAutoFitScale);
    return () => window.removeEventListener('resize', calculateAutoFitScale);
  }, [calculateAutoFitScale]);

  // Keyboard navigation for selected element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId || !design || !onUpdateElement) return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const activeEl = design.elements.find((el) => el.id === selectedElementId);
      if (!activeEl) return;

      const step = e.shiftKey ? 25 : 5;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteElement?.(selectedElementId);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onUpdateElement({
          ...activeEl,
          position: { ...activeEl.position, x: Math.max(0, activeEl.position.x - step) },
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onUpdateElement({
          ...activeEl,
          position: { ...activeEl.position, x: Math.min(CANVAS_BASE_WIDTH, activeEl.position.x + step) },
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUpdateElement({
          ...activeEl,
          position: { ...activeEl.position, y: Math.max(0, activeEl.position.y - step) },
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onUpdateElement({
          ...activeEl,
          position: { ...activeEl.position, y: Math.min(CANVAS_BASE_HEIGHT, activeEl.position.y + step) },
        });
      } else if (e.key === 'Escape') {
        onSelectElement(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, design, onUpdateElement, onDeleteElement, onSelectElement]);

  const handleStartDrag = useCallback(
    (e: React.MouseEvent, element: DesignElement) => {
      e.stopPropagation();
      onSelectElement(element.id);
      setDragState({
        elementId: element.id,
        startX: e.clientX,
        startY: e.clientY,
        initialElemX: element.position.x,
        initialElemY: element.position.y,
      });
    },
    [onSelectElement]
  );

  const handleStartResize = useCallback(
    (e: React.MouseEvent, element: DesignElement, corner: 'br' | 'tl' | 'tr' | 'bl') => {
      e.stopPropagation();
      setResizeState({
        elementId: element.id,
        corner,
        startX: e.clientX,
        startY: e.clientY,
        initialW: element.size.width,
        initialH: element.size.height,
        initialX: element.position.x,
        initialY: element.position.y,
      });
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!design || !onUpdateElement) return;

      // Handle Dragging
      if (dragState) {
        const deltaX = (e.clientX - dragState.startX) / scale;
        const deltaY = (e.clientY - dragState.startY) / scale;
        const element = design.elements.find((el) => el.id === dragState.elementId);
        if (!element) return;

        onUpdateElement({
          ...element,
          position: {
            x: Math.round(dragState.initialElemX + deltaX),
            y: Math.round(dragState.initialElemY + deltaY),
          },
        });
        return;
      }

      // Handle Resizing
      if (resizeState) {
        const deltaX = (e.clientX - resizeState.startX) / scale;
        const deltaY = (e.clientY - resizeState.startY) / scale;
        const element = design.elements.find((el) => el.id === resizeState.elementId);
        if (!element) return;

        let newW = resizeState.initialW;
        let newH = resizeState.initialH;
        let newX = resizeState.initialX;
        let newY = resizeState.initialY;

        if (resizeState.corner === 'br') {
          newW = Math.max(40, Math.round(resizeState.initialW + deltaX));
          newH = Math.max(30, Math.round(resizeState.initialH + deltaY));
        } else if (resizeState.corner === 'bl') {
          newW = Math.max(40, Math.round(resizeState.initialW - deltaX));
          newH = Math.max(30, Math.round(resizeState.initialH + deltaY));
          newX = Math.round(resizeState.initialX + deltaX);
        } else if (resizeState.corner === 'tr') {
          newW = Math.max(40, Math.round(resizeState.initialW + deltaX));
          newH = Math.max(30, Math.round(resizeState.initialH - deltaY));
          newY = Math.round(resizeState.initialY + deltaY);
        } else if (resizeState.corner === 'tl') {
          newW = Math.max(40, Math.round(resizeState.initialW - deltaX));
          newH = Math.max(30, Math.round(resizeState.initialH - deltaY));
          newX = Math.round(resizeState.initialX + deltaX);
          newY = Math.round(resizeState.initialY + deltaY);
        }

        onUpdateElement({
          ...element,
          position: { x: newX, y: newY },
          size: { width: newW, height: newH },
        });
      }
    },
    [dragState, resizeState, design, onUpdateElement, scale]
  );

  const handleMouseUp = useCallback(() => {
    setDragState(null);
    setResizeState(null);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  // Experimental Feature 1: Smart Palette Shift
  const handleExperimentalPaletteShift = () => {
    if (!design || !onLayoutUpdate) return;
    const nextIdx = (paletteIndex + 1) % EXPERIMENTAL_PALETTES.length;
    setPaletteIndex(nextIdx);
    const theme = EXPERIMENTAL_PALETTES[nextIdx];

    const shiftedElements = design.elements.map((el) => {
      if (el.type === 'text') {
        return {
          ...el,
          style: {
            ...el.style,
            color: theme.text,
          },
        };
      } else if (el.type === 'shape') {
        const isButton = el.size.width < 320 && el.size.height < 70;
        return {
          ...el,
          style: {
            ...el.style,
            backgroundColor: isButton ? theme.primary : theme.card,
            borderColor: theme.accent,
          },
        };
      }
      return el;
    });

    onLayoutUpdate({
      ...design,
      canvasBackgroundColor: theme.bg,
      elements: shiftedElements,
    });

    toast({
      title: 'Palette Shifted!',
      description: `Applied ${theme.name} aesthetic scheme.`,
    });
  };

  // Experimental Feature 2: Smart Auto-Align & Distribute
  const handleAutoAlignAndDistribute = () => {
    if (!design || design.elements.length === 0 || !onLayoutUpdate) return;

    // Filter out huge background cards so they don't break stacking
    const normalElements = design.elements.filter((el) => el.size.width < 850 || el.size.height < 850);
    const bgElements = design.elements.filter((el) => el.size.width >= 850 && el.size.height >= 850);

    const sortedByY = [...normalElements].sort((a, b) => a.position.y - b.position.y);
    const totalHeight = sortedByY.reduce((acc, el) => acc + el.size.height, 0);
    const availableSpace = Math.max(100, 1000 - totalHeight);
    const gap = Math.min(60, Math.max(15, Math.round(availableSpace / (sortedByY.length + 1))));

    let currentY = gap;
    const alignedNormal = sortedByY.map((el) => {
      const centeredX = Math.round((1000 - el.size.width) / 2);
      const updatedEl = {
        ...el,
        position: { x: centeredX, y: currentY },
      };
      currentY += el.size.height + gap;
      return updatedEl;
    });

    onLayoutUpdate({
      ...design,
      elements: [...bgElements, ...alignedNormal],
    });

    toast({
      title: 'Smart Layout Balanced',
      description: 'Elements centered with proportional vertical spacing.',
    });
  };

  const selectedElement = design?.elements.find((el) => el.id === selectedElementId) || null;

  return (
    <div
      ref={canvasContainerRef}
      className={cn(
        'w-full h-full flex flex-col items-center justify-center bg-muted/30 overflow-hidden relative select-none',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Floating Canvas Toolbar */}
      <div className="absolute top-3 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
        {/* Left: History & Alignment */}
        <div className="flex items-center gap-1.5 p-1 bg-background/90 backdrop-blur-md border rounded-xl shadow-sm pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground disabled:opacity-30"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground disabled:opacity-30"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>

          <div className="w-[1px] h-4 bg-border mx-0.5" />

          {/* Experimental Quick Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExperimentalPaletteShift}
            className="h-8 px-2.5 text-xs gap-1 text-primary hover:text-primary font-medium"
            title="Cycle through curated harmony palettes"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">Palette Shift</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAutoAlignAndDistribute}
            className="h-8 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            title="Auto center and space components"
          >
            <AlignHorizontalJustifyCenter className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Auto-Align</span>
          </Button>
        </div>

        {/* Center: Selected Element Quick Bar (appears when an element is chosen) */}
        {selectedElement && (
          <div className="hidden lg:flex items-center gap-1 p-1 bg-background/95 backdrop-blur-md border rounded-xl shadow-md pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2">
              {selectedElement.type}
            </span>
            <div className="w-[1px] h-4 bg-border" />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Duplicate (Ctrl+D)"
              onClick={() => onDuplicateElement?.(selectedElement.id)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Center Horizontally"
              onClick={() => {
                onUpdateElement?.({
                  ...selectedElement,
                  position: { ...selectedElement.position, x: Math.round((1000 - selectedElement.size.width) / 2) },
                });
              }}
            >
              <AlignHorizontalJustifyCenter className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Bring Forward"
              onClick={() => {
                const z = Number(selectedElement.style?.zIndex) || 1;
                onUpdateElement?.({ ...selectedElement, style: { ...selectedElement.style, zIndex: z + 1 } });
              }}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Send Backward"
              onClick={() => {
                const z = Number(selectedElement.style?.zIndex) || 1;
                onUpdateElement?.({ ...selectedElement, style: { ...selectedElement.style, zIndex: Math.max(0, z - 1) } });
              }}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              title="Delete (Backspace/Del)"
              onClick={() => onDeleteElement?.(selectedElement.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Right: Zoom & Grid Controls */}
        <div className="flex items-center gap-1 p-1 bg-background/90 backdrop-blur-md border rounded-xl shadow-sm pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground"
            onClick={() => setScale((s) => Math.max(0.2, s - 0.1))}
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>

          <span className="text-[11px] font-semibold text-muted-foreground px-1 w-10 text-center">
            {Math.round(scale * 100)}%
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground"
            onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-foreground"
            onClick={calculateAutoFitScale}
            title="Fit to Screen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>

          <div className="w-[1px] h-4 bg-border mx-0.5" />

          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', showGrid ? 'text-primary bg-primary/10' : 'text-muted-foreground')}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Alignment Grid"
          >
            <Grid className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main 1000x1000 Canvas */}
      <div
        ref={canvasRef}
        id="blueprint-active-canvas"
        style={{
          width: `${CANVAS_BASE_WIDTH * scale}px`,
          height: `${CANVAS_BASE_HEIGHT * scale}px`,
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: design?.canvasBackgroundColor || '#FFFFFF',
          transition: 'background-color 0.2s ease',
          backgroundImage: showGrid
            ? 'linear-gradient(to right, rgba(120, 120, 120, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(120, 120, 120, 0.1) 1px, transparent 1px)'
            : 'none',
          backgroundSize: `${50 * scale}px ${50 * scale}px`,
        }}
        onClick={handleCanvasClick}
      >
        {design &&
          design.elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              scale={scale}
              isSelected={element.id === selectedElementId}
              onMouseDown={(e) => handleStartDrag(e, element)}
              onResizeStart={(e, corner) => handleStartResize(e, element, corner)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement(element.id);
              }}
            />
          ))}

        {(!design || design.elements.length === 0) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-6 text-center pointer-events-none">
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8 text-primary/70" />
            </div>
            <p className="text-base font-semibold text-foreground">Canvas Ready</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              Generate a layout with AI, pick a template, or add shapes and text from the sidebar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function addIdsToLayout(layout: any): DesignLayout {
  const layoutId = crypto.randomUUID();
  let pages: Array<{
    id: string;
    title?: string;
    elements: DesignElement[];
    canvasBackgroundColor?: string;
  }> = [];

  if (layout.pages && Array.isArray(layout.pages) && layout.pages.length > 0) {
    pages = layout.pages.map((p: any, idx: number) => ({
      id: p.id || crypto.randomUUID(),
      title: p.title || `Slide ${idx + 1}`,
      canvasBackgroundColor: p.canvasBackgroundColor || layout.canvasBackgroundColor || '#FFFFFF',
      elements: (p.elements || []).map((el: any) => ({
        ...el,
        id: el.id || crypto.randomUUID(),
      })),
    }));
  } else {
    pages = [
      {
        id: crypto.randomUUID(),
        title: 'Slide 1',
        canvasBackgroundColor: layout.canvasBackgroundColor || '#FFFFFF',
        elements: (layout.elements || []).map((el: any) => ({
          ...el,
          id: el.id || crypto.randomUUID(),
        })),
      },
    ];
  }

  const activeIdx = Math.min(Math.max(0, layout.activePageIndex ?? 0), pages.length - 1);
  const activePage = pages[activeIdx];

  return {
    ...layout,
    id: layoutId,
    description: layout.description || 'Design Layout',
    pages,
    activePageIndex: activeIdx,
    elements: activePage.elements,
    canvasBackgroundColor: activePage.canvasBackgroundColor || '#FFFFFF',
  };
}

export function addIdsToElements(elements: Omit<DesignElement, 'id'>[]): DesignElement[] {
  return elements.map((el) => ({ ...el, id: crypto.randomUUID() }));
}
