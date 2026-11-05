'use client';

import type { DesignLayout, DesignElement } from '@/types/blueprint';
import { CanvasElement, type ResizeHandle } from './CanvasElement';
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
  FolderPlus,
  FolderMinus,
  Folder,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CanvasProps {
  design: DesignLayout | null;
  selectedElementId: string | null;
  selectedElementIds?: string[];
  onSelectElement: (elementId: string | null) => void;
  onSelectElements?: (elementIds: string[]) => void;
  onToggleSelectElement?: (elementId: string) => void;
  onGroupElements?: () => void;
  onUngroupElements?: () => void;
  onUpdateElement?: (updatedElement: DesignElement) => void;
  onBatchUpdateElements?: (updatedElements: DesignElement[]) => void;
  onDeleteElement?: (elementId: string) => void;
  onDeleteElements?: (elementIds: string[]) => void;
  onDuplicateElement?: (elementId: string) => void;
  onDuplicateElements?: (elementIds: string[]) => void;
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
  selectedElementIds = [],
  onSelectElement,
  onSelectElements,
  onToggleSelectElement,
  onGroupElements,
  onUngroupElements,
  onUpdateElement,
  onBatchUpdateElements,
  onDeleteElement,
  onDeleteElements,
  onDuplicateElement,
  onDuplicateElements,
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

  // Effective multi-selection IDs list
  const effectiveSelectedIds =
    selectedElementIds.length > 0
      ? selectedElementIds
      : selectedElementId
      ? [selectedElementId]
      : [];

  // Drag state for single or multiple grouped elements
  const [dragState, setDragState] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    initialPositions: Record<string, { x: number; y: number }>;
  } | null>(null);

  // Resize state (for primary selected element - supports 8 handles)
  const [resizeState, setResizeState] = useState<{
    elementId: string;
    handle: ResizeHandle;
    startX: number;
    startY: number;
    initialW: number;
    initialH: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const calculateAutoFitScale = useCallback(() => {
    if (canvasContainerRef.current) {
      const containerWidth = canvasContainerRef.current.offsetWidth - 120;
      const containerHeight = canvasContainerRef.current.offsetHeight - 140;
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

  // Support Ctrl + Wheel or Trackpad Pinch to Zoom
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        setScale((s) => Math.min(2.0, Math.max(0.2, Number((s + delta).toFixed(2)))));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Keyboard navigation for selected elements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (effectiveSelectedIds.length === 0 || !design) return;

      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const step = e.shiftKey ? 25 : 5;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (onDeleteElements && effectiveSelectedIds.length > 1) {
          onDeleteElements(effectiveSelectedIds);
        } else if (onDeleteElement && effectiveSelectedIds[0]) {
          onDeleteElement(effectiveSelectedIds[0]);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const deltaX = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
        const deltaY = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;

        const updated = design.elements
          .filter((el) => effectiveSelectedIds.includes(el.id))
          .map((el) => ({
            ...el,
            position: {
              x: Math.max(0, Math.min(CANVAS_BASE_WIDTH, el.position.x + deltaX)),
              y: Math.max(0, Math.min(CANVAS_BASE_HEIGHT, el.position.y + deltaY)),
            },
          }));

        if (onBatchUpdateElements && updated.length > 1) {
          onBatchUpdateElements(updated);
        } else if (onUpdateElement && updated.length === 1) {
          onUpdateElement(updated[0]);
        }
      } else if (e.key === 'Escape') {
        onSelectElement(null);
        onSelectElements?.([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    effectiveSelectedIds,
    design,
    onUpdateElement,
    onBatchUpdateElements,
    onDeleteElement,
    onDeleteElements,
    onSelectElement,
    onSelectElements,
  ]);

  const handleStartDrag = useCallback(
    (e: React.MouseEvent, element: DesignElement) => {
      e.stopPropagation();
      if (element.style?.locked) return;

      let activeIds: string[] = [];

      if (e.shiftKey) {
        // Toggle selection
        onToggleSelectElement?.(element.id);
        const alreadyIn = effectiveSelectedIds.includes(element.id);
        activeIds = alreadyIn
          ? effectiveSelectedIds.filter((id) => id !== element.id)
          : [...effectiveSelectedIds, element.id];
      } else if (effectiveSelectedIds.includes(element.id) && effectiveSelectedIds.length > 1) {
        activeIds = effectiveSelectedIds;
      } else if (element.groupId) {
        // Auto select group members
        const groupMembers =
          design?.elements.filter((el) => el.groupId === element.groupId).map((el) => el.id) || [element.id];
        activeIds = groupMembers;
        if (onSelectElements) {
          onSelectElements(groupMembers);
        } else {
          onSelectElement(element.id);
        }
      } else {
        activeIds = [element.id];
        if (onSelectElements) {
          onSelectElements([element.id]);
        } else {
          onSelectElement(element.id);
        }
      }

      // Record initial positions for all dragged items
      const initialPositions: Record<string, { x: number; y: number }> = {};
      if (design) {
        design.elements.forEach((el) => {
          if (activeIds.includes(el.id)) {
            initialPositions[el.id] = { x: el.position.x, y: el.position.y };
          }
        });
      }

      setDragState({
        elementId: element.id,
        startX: e.clientX,
        startY: e.clientY,
        initialPositions,
      });
    },
    [design, effectiveSelectedIds, onSelectElement, onSelectElements, onToggleSelectElement]
  );

  const handleStartResize = useCallback(
    (e: React.MouseEvent, element: DesignElement, handle: ResizeHandle) => {
      e.stopPropagation();
      if (element.style?.locked) return;
      setResizeState({
        elementId: element.id,
        handle,
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
      if (!design) return;

      // Handle Dragging (Single or Group)
      if (dragState) {
        const deltaX = (e.clientX - dragState.startX) / scale;
        const deltaY = (e.clientY - dragState.startY) / scale;

        const updated = design.elements
          .filter((el) => dragState.initialPositions[el.id] !== undefined)
          .map((el) => ({
            ...el,
            position: {
              x: Math.round(dragState.initialPositions[el.id].x + deltaX),
              y: Math.round(dragState.initialPositions[el.id].y + deltaY),
            },
          }));

        if (onBatchUpdateElements && updated.length > 1) {
          onBatchUpdateElements(updated);
        } else if (onUpdateElement && updated.length === 1) {
          onUpdateElement(updated[0]);
        }
        return;
      }

      // Handle Resizing (8 directions: 4 corners + 4 mid-sides)
      if (resizeState && onUpdateElement) {
        const deltaX = (e.clientX - resizeState.startX) / scale;
        const deltaY = (e.clientY - resizeState.startY) / scale;
        const element = design.elements.find((el) => el.id === resizeState.elementId);
        if (!element) return;

        let newW = resizeState.initialW;
        let newH = resizeState.initialH;
        let newX = resizeState.initialX;
        let newY = resizeState.initialY;

        switch (resizeState.handle) {
          // 4 Corners
          case 'br':
            newW = Math.max(30, Math.round(resizeState.initialW + deltaX));
            newH = Math.max(20, Math.round(resizeState.initialH + deltaY));
            break;
          case 'bl':
            newW = Math.max(30, Math.round(resizeState.initialW - deltaX));
            newH = Math.max(20, Math.round(resizeState.initialH + deltaY));
            newX = Math.round(resizeState.initialX + deltaX);
            break;
          case 'tr':
            newW = Math.max(30, Math.round(resizeState.initialW + deltaX));
            newH = Math.max(20, Math.round(resizeState.initialH - deltaY));
            newY = Math.round(resizeState.initialY + deltaY);
            break;
          case 'tl':
            newW = Math.max(30, Math.round(resizeState.initialW - deltaX));
            newH = Math.max(20, Math.round(resizeState.initialH - deltaY));
            newX = Math.round(resizeState.initialX + deltaX);
            newY = Math.round(resizeState.initialY + deltaY);
            break;

          // 4 Mid-Sides
          case 'top':
            newH = Math.max(20, Math.round(resizeState.initialH - deltaY));
            newY = Math.round(resizeState.initialY + deltaY);
            break;
          case 'bottom':
            newH = Math.max(20, Math.round(resizeState.initialH + deltaY));
            break;
          case 'left':
            newW = Math.max(30, Math.round(resizeState.initialW - deltaX));
            newX = Math.round(resizeState.initialX + deltaX);
            break;
          case 'right':
            newW = Math.max(30, Math.round(resizeState.initialW + deltaX));
            break;
        }

        onUpdateElement({
          ...element,
          position: { x: newX, y: newY },
          size: { width: newW, height: newH },
        });
      }
    },
    [dragState, resizeState, design, onUpdateElement, onBatchUpdateElements, scale]
  );

  const handleMouseUp = useCallback(() => {
    setDragState(null);
    setResizeState(null);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
      onSelectElements?.([]);
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
        const { border: _discard, ...restStyle } = (el.style || {}) as any;
        return {
          ...el,
          style: {
            ...restStyle,
            backgroundColor: isButton ? theme.primary : theme.card,
            borderColor: theme.accent,
            borderStyle: restStyle.borderStyle || (restStyle.borderWidth ? 'solid' : undefined),
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

  const selectedElements = design?.elements.filter((el) => effectiveSelectedIds.includes(el.id)) || [];
  const singleSelectedElement = selectedElements.length === 1 ? selectedElements[0] : null;
  const isMultiSelection = selectedElements.length > 1;
  const hasGroupedItems = selectedElements.some((el) => Boolean(el.groupId));

  return (
    <div
      className={cn(
        'w-full h-full relative select-none overflow-hidden bg-muted/20 flex flex-col',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Floating Canvas Toolbar (Fixed overlay over scrolling viewport) */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-30 pointer-events-none">
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

        {/* Center: Multi-Select & Grouping Quick Bar */}
        {isMultiSelection && (
          <div className="flex items-center gap-1 p-1 bg-background/95 backdrop-blur-md border border-primary/40 rounded-xl shadow-md pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-1.5 px-2 text-[11px] font-bold text-primary">
              <Folder className="h-3.5 w-3.5" />
              <span>{selectedElements.length} Items</span>
            </div>
            <div className="w-[1px] h-4 bg-border" />

            {/* Group Action Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onGroupElements}
              className="h-7 px-2 text-xs gap-1 text-primary hover:bg-primary/10 font-semibold"
              title="Group selected elements together (Ctrl+G)"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>Group</span>
            </Button>

            {/* Ungroup Action Button (if any are already grouped) */}
            {hasGroupedItems && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onUngroupElements}
                className="h-7 px-2 text-xs gap-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 font-medium"
                title="Ungroup selected elements (Ctrl+Shift+G)"
              >
                <FolderMinus className="h-3.5 w-3.5" />
                <span>Ungroup</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Duplicate Selected (Ctrl+D)"
              onClick={() => onDuplicateElements?.(effectiveSelectedIds)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              title="Delete Selected (Backspace/Del)"
              onClick={() => onDeleteElements?.(effectiveSelectedIds)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Center: Single Element Quick Bar */}
        {!isMultiSelection && singleSelectedElement && (
          <div className="hidden lg:flex items-center gap-1 p-1 bg-background/95 backdrop-blur-md border rounded-xl shadow-md pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2">
              {singleSelectedElement.type}
            </span>

            {/* If element belongs to a group, allow instant ungrouping */}
            {singleSelectedElement.groupId && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onUngroupElements}
                  className="h-7 px-2 text-xs gap-1 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 font-medium"
                  title="Remove from group (Ctrl+Shift+G)"
                >
                  <FolderMinus className="h-3.5 w-3.5" />
                  <span>Ungroup</span>
                </Button>
                <div className="w-[1px] h-4 bg-border" />
              </>
            )}

            <div className="w-[1px] h-4 bg-border" />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Duplicate (Ctrl+D)"
              onClick={() => onDuplicateElement?.(singleSelectedElement.id)}
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
                  ...singleSelectedElement,
                  position: {
                    ...singleSelectedElement.position,
                    x: Math.round((1000 - singleSelectedElement.size.width) / 2),
                  },
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
                const z = Number(singleSelectedElement.style?.zIndex) || 1;
                onUpdateElement?.({ ...singleSelectedElement, style: { ...singleSelectedElement.style, zIndex: z + 1 } });
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
                const z = Number(singleSelectedElement.style?.zIndex) || 1;
                onUpdateElement?.({
                  ...singleSelectedElement,
                  style: { ...singleSelectedElement.style, zIndex: Math.max(0, z - 1) },
                });
              }}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              title="Delete (Backspace/Del)"
              onClick={() => onDeleteElement?.(singleSelectedElement.id)}
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

      {/* Scrollable Canvas Viewport */}
      <div
        ref={canvasContainerRef}
        className="w-full h-full overflow-auto custom-scrollbar relative flex p-16 sm:p-24"
      >
        {/* Main 1000x1000 Canvas with margin: auto for perfect centering & 360-degree scrollability */}
        <div
          ref={canvasRef}
          id="blueprint-active-canvas"
          className="m-auto shrink-0 relative transition-all duration-75"
          style={{
            width: `${CANVAS_BASE_WIDTH * scale}px`,
            height: `${CANVAS_BASE_HEIGHT * scale}px`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            borderRadius: '12px',
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
          design.elements.map((element) => {
            const isSelected = effectiveSelectedIds.includes(element.id);
            const isGroupMember = Boolean(
              !isSelected &&
                element.groupId &&
                design.elements.some((el) => el.groupId === element.groupId && effectiveSelectedIds.includes(el.id))
            );

            return (
              <CanvasElement
                key={element.id}
                element={element}
                scale={scale}
                isSelected={isSelected}
                isGroupMember={isGroupMember}
                onMouseDown={(e) => handleStartDrag(e, element)}
                onResizeStart={(e, handle) => handleStartResize(e, element, handle)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.shiftKey) {
                    onToggleSelectElement?.(element.id);
                  } else if (element.groupId) {
                    const groupMembers = design.elements
                      .filter((el) => el.groupId === element.groupId)
                      .map((el) => el.id);
                    if (onSelectElements) {
                      onSelectElements(groupMembers);
                    } else {
                      onSelectElement(element.id);
                    }
                  } else {
                    if (onSelectElements) {
                      onSelectElements([element.id]);
                    } else {
                      onSelectElement(element.id);
                    }
                  }
                }}
              />
            );
          })}

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
