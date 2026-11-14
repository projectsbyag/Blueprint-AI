'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Undo2,
  Redo2,
  Sparkles,
  Maximize2,
  Layers,
  MousePointer2,
  SlidersHorizontal,
  ChevronRight,
  Type,
  Square,
  Image as ImageIcon,
  ArrowRight,
  FolderPlus,
  FolderMinus,
  Folder,
  Copy,
  Trash2,
  AlignHorizontalJustifyCenter,
  Check,
  Palette,
  LayoutTemplate,
} from 'lucide-react';
import type { DesignLayout, DesignElement, DesignPage } from '@/types/blueprint';
import { CanvasElement, type ResizeHandle } from '@/components/canvas/CanvasElement';
import { PREDEFINED_TEMPLATES } from '@/components/tools/TemplateLibrary';
import { savePendingStudioDraft } from '@/lib/preview-bridge';
import { cn } from '@/lib/utils';

const CANVAS_BASE = 1000;

const HARMONY_PALETTES = [
  { name: 'Blueprint Cobalt', primary: '#2563EB', accent: '#38BDF8', bg: '#0A0E1A', card: '#111827', text: '#F8FAFC' },
  { name: 'Nordic Architectural', primary: '#1E293B', accent: '#5B8DEF', bg: '#F8FAFC', card: '#FFFFFF', text: '#0F172A' },
  { name: 'Technical Emerald', primary: '#059669', accent: '#34D399', bg: '#061A14', card: '#0B2920', text: '#ECFDF5' },
  { name: 'Obsidian Amber', primary: '#D97706', accent: '#FBBF24', bg: '#181206', card: '#261C0B', text: '#FEF3C7' },
];

const QUICK_SWATCHES = ['#FFFFFF', '#0F172A', '#2563EB', '#5B8DEF', '#38BDF8', '#10B981', '#F59E0B', '#F43F5E'];

function buildDeterministicLayout(templateIndex: number): DesignLayout {
  const safeIdx = Math.min(Math.max(0, templateIndex), PREDEFINED_TEMPLATES.length - 1);
  const tmpl = PREDEFINED_TEMPLATES[safeIdx];

  let pages: DesignPage[] = [];
  if (tmpl.pages && Array.isArray(tmpl.pages) && tmpl.pages.length > 0) {
    pages = tmpl.pages.map((p: any, pIdx: number) => ({
      id: p.id || `preview_t${safeIdx}_p${pIdx}`,
      title: p.title || `Slide ${pIdx + 1}`,
      canvasBackgroundColor: p.canvasBackgroundColor || tmpl.canvasBackgroundColor || '#FFFFFF',
      elements: (p.elements || []).map((el: any, eIdx: number) => ({
        ...el,
        id: el.id || `preview_t${safeIdx}_p${pIdx}_e${eIdx}`,
      })),
    }));
  } else {
    pages = [
      {
        id: `preview_t${safeIdx}_p0`,
        title: 'Slide 1',
        canvasBackgroundColor: tmpl.canvasBackgroundColor || '#FFFFFF',
        elements: (tmpl.elements || []).map((el: any, eIdx: number) => ({
          ...el,
          id: el.id || `preview_t${safeIdx}_p0_e${eIdx}`,
        })),
      },
    ];
  }

  return {
    id: `preview_layout_${safeIdx}`,
    description: tmpl.description || 'Design Layout',
    pages,
    activePageIndex: 0,
    elements: pages[0].elements,
    canvasBackgroundColor: pages[0].canvasBackgroundColor || '#FFFFFF',
  };
}

function syncPages(layout: DesignLayout, nextElements: DesignElement[], nextBg?: string): DesignLayout {
  const activeIdx = layout.activePageIndex ?? 0;
  const pages = [...(layout.pages || [])];
  if (pages[activeIdx]) {
    pages[activeIdx] = {
      ...pages[activeIdx],
      elements: nextElements,
      ...(nextBg !== undefined ? { canvasBackgroundColor: nextBg } : {}),
    };
  }
  return {
    ...layout,
    pages,
    elements: nextElements,
    ...(nextBg !== undefined ? { canvasBackgroundColor: nextBg } : {}),
  };
}

interface PlayableCanvasWorkspaceProps {
  initialTemplateIndex?: number;
  figureLabel?: string;
  compact?: boolean;
  onOpenStudio?: () => void;
}

export function PlayableCanvasWorkspace({
  initialTemplateIndex = 0,
  figureLabel = 'FIG. 001 // BLUEPRINT VECTOR WORKSPACE',
  compact = false,
  onOpenStudio,
}: PlayableCanvasWorkspaceProps) {
  const router = useRouter();
  const artboardContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.54);

  const [templateIdx, setTemplateIdx] = useState(initialTemplateIndex);
  const [design, setDesign] = useState<DesignLayout>(() => buildDeterministicLayout(initialTemplateIndex));
  const [history, setHistory] = useState<DesignLayout[]>(() => [buildDeterministicLayout(initialTemplateIndex)]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const initial = buildDeterministicLayout(initialTemplateIndex);
    const firstText = initial.elements.find((e) => e.type === 'text') || initial.elements[0];
    return firstText ? [firstText.id] : [];
  });

  const [paletteIdx, setPaletteIdx] = useState(0);

  // Drag / Resize / Marquee transient state
  const [dragState, setDragState] = useState<{
    startX: number;
    startY: number;
    initialPositions: Record<string, { x: number; y: number }>;
    moved: boolean;
  } | null>(null);

  const [resizeState, setResizeState] = useState<{
    elementId: string;
    handle: ResizeHandle;
    startX: number;
    startY: number;
    initialW: number;
    initialH: number;
    initialX: number;
    initialY: number;
    resized: boolean;
  } | null>(null);

  const [marqueeState, setMarqueeState] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Sync if initialTemplateIndex prop changes externally (e.g., modal opened for another template)
  useEffect(() => {
    const fresh = buildDeterministicLayout(initialTemplateIndex);
    setTemplateIdx(initialTemplateIndex);
    setDesign(fresh);
    setHistory([fresh]);
    setHistoryIdx(0);
    const firstText = fresh.elements.find((e) => e.type === 'text') || fresh.elements[0];
    setSelectedIds(firstText ? [firstText.id] : []);
  }, [initialTemplateIndex]);

  // Auto-scale artboard accurately to fit its container
  useEffect(() => {
    const el = artboardContainerRef.current;
    if (!el) return;
    const updateScale = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setScale(w / CANVAS_BASE);
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const commitLayout = useCallback(
    (nextLayout: DesignLayout) => {
      setDesign(nextLayout);
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIdx + 1);
        const updated = [...sliced, nextLayout].slice(-25);
        setHistoryIdx(updated.length - 1);
        return updated;
      });
    },
    [historyIdx]
  );

  const handleUndo = () => {
    if (historyIdx <= 0) return;
    const prevIdx = historyIdx - 1;
    setHistoryIdx(prevIdx);
    setDesign(history[prevIdx]);
    setSelectedIds([]);
  };

  const handleRedo = () => {
    if (historyIdx >= history.length - 1) return;
    const nextIdx = historyIdx + 1;
    setHistoryIdx(nextIdx);
    setDesign(history[nextIdx]);
    setSelectedIds([]);
  };

  const handleTemplateChange = (newIdx: number) => {
    const fresh = buildDeterministicLayout(newIdx);
    setTemplateIdx(newIdx);
    commitLayout(fresh);
    const firstText = fresh.elements.find((e) => e.type === 'text') || fresh.elements[0];
    setSelectedIds(firstText ? [firstText.id] : []);
  };

  const handleSwitchSlide = (slideIdx: number) => {
    const pages = design.pages || [];
    if (slideIdx < 0 || slideIdx >= pages.length) return;
    const target = pages[slideIdx];
    const next: DesignLayout = {
      ...design,
      activePageIndex: slideIdx,
      elements: target.elements || [],
      canvasBackgroundColor: target.canvasBackgroundColor || '#FFFFFF',
    };
    setDesign(next);
    const firstText = next.elements.find((e) => e.type === 'text') || next.elements[0];
    setSelectedIds(firstText ? [firstText.id] : []);
  };

  const handlePaletteShift = () => {
    const nextIdx = (paletteIdx + 1) % HARMONY_PALETTES.length;
    setPaletteIdx(nextIdx);
    const palette = HARMONY_PALETTES[nextIdx];

    const shifted = design.elements.map((el) => {
      if (el.type === 'text') {
        return { ...el, style: { ...el.style, color: palette.text } };
      }
      if (el.type === 'shape') {
        const isSmallPill = el.size.width < 360 && el.size.height < 85;
        const { border: _discard, ...restStyle } = (el.style || {}) as any;
        return {
          ...el,
          style: {
            ...restStyle,
            backgroundColor: isSmallPill ? palette.primary : palette.card,
            borderColor: palette.accent,
            borderStyle: restStyle.borderStyle || (restStyle.borderWidth ? 'solid' : undefined),
          },
        };
      }
      return el;
    });

    commitLayout(syncPages(design, shifted, palette.bg));
  };

  const handleUpdateElement = (updatedEl: DesignElement, skipHistory = false) => {
    const nextElements = design.elements.map((el) => (el.id === updatedEl.id ? updatedEl : el));
    const nextLayout = syncPages(design, nextElements);
    if (skipHistory) {
      setDesign(nextLayout);
    } else {
      commitLayout(nextLayout);
    }
  };

  const handleGroupSelected = () => {
    if (selectedIds.length < 2) return;
    const newGroupId = `group_${Math.random().toString(36).slice(2, 9)}`;
    const nextElements = design.elements.map((el) =>
      selectedIds.includes(el.id) ? { ...el, groupId: newGroupId } : el
    );
    commitLayout(syncPages(design, nextElements));
  };

  const handleUngroupSelected = () => {
    if (selectedIds.length === 0) return;
    const groupIds = new Set(
      design.elements.filter((el) => selectedIds.includes(el.id) && el.groupId).map((el) => el.groupId!)
    );
    if (groupIds.size === 0) return;
    const nextElements = design.elements.map((el) =>
      el.groupId && groupIds.has(el.groupId) ? { ...el, groupId: undefined } : el
    );
    commitLayout(syncPages(design, nextElements));
  };

  const handleDuplicateSelected = () => {
    if (selectedIds.length === 0) return;
    const targets = design.elements.filter((el) => selectedIds.includes(el.id));
    const oldToNewGroup = new Map<string, string>();
    targets.forEach((t) => {
      if (t.groupId && !oldToNewGroup.has(t.groupId)) {
        oldToNewGroup.set(t.groupId, `group_${Math.random().toString(36).slice(2, 9)}`);
      }
    });
    const copies: DesignElement[] = targets.map((t, i) => ({
      ...t,
      id: `dup_${Date.now()}_${i}`,
      position: { x: Math.min(900, t.position.x + 24), y: Math.min(900, t.position.y + 24) },
      groupId: t.groupId ? oldToNewGroup.get(t.groupId) : undefined,
      style: { ...t.style, zIndex: (Number(t.style?.zIndex) || 1) + 1 },
    }));
    commitLayout(syncPages(design, [...design.elements, ...copies]));
    setSelectedIds(copies.map((c) => c.id));
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const nextElements = design.elements.filter((el) => !selectedIds.includes(el.id));
    commitLayout(syncPages(design, nextElements));
    setSelectedIds([]);
  };

  // Dragging, Resizing, and Marquee Pointer handlers on the scaled 1000x1000 artboard
  const handleStartDrag = (e: React.MouseEvent, element: DesignElement) => {
    e.stopPropagation();
    if (element.style?.locked) return;

    let activeIds: string[];
    if (e.shiftKey) {
      const targetIds = element.groupId
        ? design.elements.filter((el) => el.groupId === element.groupId).map((el) => el.id)
        : [element.id];
      const allIn = targetIds.every((id) => selectedIds.includes(id));
      activeIds = allIn
        ? selectedIds.filter((id) => !targetIds.includes(id))
        : Array.from(new Set([...selectedIds, ...targetIds]));
      setSelectedIds(activeIds);
    } else if (selectedIds.includes(element.id) && selectedIds.length > 1) {
      activeIds = selectedIds;
    } else if (element.groupId) {
      activeIds = design.elements.filter((el) => el.groupId === element.groupId).map((el) => el.id);
      setSelectedIds(activeIds);
    } else {
      activeIds = [element.id];
      setSelectedIds(activeIds);
    }

    const initialPositions: Record<string, { x: number; y: number }> = {};
    design.elements.forEach((el) => {
      if (activeIds.includes(el.id)) {
        initialPositions[el.id] = { x: el.position.x, y: el.position.y };
      }
    });

    setDragState({
      startX: e.clientX,
      startY: e.clientY,
      initialPositions,
      moved: false,
    });
  };

  const handleStartResize = (e: React.MouseEvent, element: DesignElement, handle: ResizeHandle) => {
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
      resized: false,
    });
  };

  const handleArtboardMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    setMarqueeState({ startX: x, startY: y, currentX: x, currentY: y });
  };

  const handleWorkspaceMouseMove = (e: React.MouseEvent) => {
    if (dragState) {
      const dx = (e.clientX - dragState.startX) / scale;
      const dy = (e.clientY - dragState.startY) / scale;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && !dragState.moved) return;

      const updatedElements = design.elements.map((el) => {
        const initPos = dragState.initialPositions[el.id];
        if (!initPos) return el;
        return {
          ...el,
          position: {
            x: Math.round(initPos.x + dx),
            y: Math.round(initPos.y + dy),
          },
        };
      });
      setDragState((prev) => (prev ? { ...prev, moved: true } : null));
      setDesign((prev) => syncPages(prev, updatedElements));
      return;
    }

    if (resizeState) {
      const dx = (e.clientX - resizeState.startX) / scale;
      const dy = (e.clientY - resizeState.startY) / scale;
      const target = design.elements.find((el) => el.id === resizeState.elementId);
      if (!target) return;

      let newW = resizeState.initialW;
      let newH = resizeState.initialH;
      let newX = resizeState.initialX;
      let newY = resizeState.initialY;

      switch (resizeState.handle) {
        case 'br':
          newW = Math.max(30, Math.round(resizeState.initialW + dx));
          newH = Math.max(20, Math.round(resizeState.initialH + dy));
          break;
        case 'bl':
          newW = Math.max(30, Math.round(resizeState.initialW - dx));
          newH = Math.max(20, Math.round(resizeState.initialH + dy));
          newX = Math.round(resizeState.initialX + dx);
          break;
        case 'tr':
          newW = Math.max(30, Math.round(resizeState.initialW + dx));
          newH = Math.max(20, Math.round(resizeState.initialH - dy));
          newY = Math.round(resizeState.initialY + dy);
          break;
        case 'tl':
          newW = Math.max(30, Math.round(resizeState.initialW - dx));
          newH = Math.max(20, Math.round(resizeState.initialH - dy));
          newX = Math.round(resizeState.initialX + dx);
          newY = Math.round(resizeState.initialY + dy);
          break;
        case 'top':
          newH = Math.max(20, Math.round(resizeState.initialH - dy));
          newY = Math.round(resizeState.initialY + dy);
          break;
        case 'bottom':
          newH = Math.max(20, Math.round(resizeState.initialH + dy));
          break;
        case 'left':
          newW = Math.max(30, Math.round(resizeState.initialW - dx));
          newX = Math.round(resizeState.initialX + dx);
          break;
        case 'right':
          newW = Math.max(30, Math.round(resizeState.initialW + dx));
          break;
      }

      setResizeState((prev) => (prev ? { ...prev, resized: true } : null));
      handleUpdateElement(
        {
          ...target,
          position: { x: newX, y: newY },
          size: { width: newW, height: newH },
        },
        true
      );
      return;
    }

    if (marqueeState && artboardContainerRef.current) {
      const rect = artboardContainerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(CANVAS_BASE, (e.clientX - rect.left) / scale));
      const y = Math.max(0, Math.min(CANVAS_BASE, (e.clientY - rect.top) / scale));
      setMarqueeState((prev) => (prev ? { ...prev, currentX: x, currentY: y } : null));
    }
  };

  const handleWorkspaceMouseUp = () => {
    if (dragState?.moved || resizeState?.resized) {
      commitLayout(design);
    }
    if (marqueeState) {
      const minX = Math.min(marqueeState.startX, marqueeState.currentX);
      const maxX = Math.max(marqueeState.startX, marqueeState.currentX);
      const minY = Math.min(marqueeState.startY, marqueeState.currentY);
      const maxY = Math.max(marqueeState.startY, marqueeState.currentY);

      if (maxX - minX > 8 || maxY - minY > 8) {
        const hits = design.elements
          .filter((el) => {
            if (el.style?.locked) return false;
            const ex2 = el.position.x + el.size.width;
            const ey2 = el.position.y + el.size.height;
            return el.position.x <= maxX && ex2 >= minX && el.position.y <= maxY && ey2 >= minY;
          })
          .map((el) => el.id);
        setSelectedIds(hits);
      } else {
        setSelectedIds([]);
      }
    }
    setDragState(null);
    setResizeState(null);
    setMarqueeState(null);
  };

  const handleOpenInStudio = () => {
    savePendingStudioDraft(design);
    onOpenStudio?.();
    router.push('/blueprint?fromPreview=1');
  };

  const selectedElements = design.elements.filter((el) => selectedIds.includes(el.id));
  const primaryElement = selectedElements.length === 1 ? selectedElements[0] : null;
  const hasGrouped = selectedElements.some((el) => Boolean(el.groupId));
  const pages = design.pages || [];
  const activeSlide = design.activePageIndex ?? 0;

  const handleWorkspaceKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable
    ) {
      return;
    }

    const isCtrlOrMeta = e.ctrlKey || e.metaKey;
    if (isCtrlOrMeta && e.key.toLowerCase() === 'g') {
      e.preventDefault();
      if (e.shiftKey) {
        handleUngroupSelected();
      } else {
        handleGroupSelected();
      }
    } else if (isCtrlOrMeta && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      setSelectedIds(design.elements.filter((el) => !el.style?.locked).map((el) => el.id));
    } else if (isCtrlOrMeta && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      handleDuplicateSelected();
    } else if (isCtrlOrMeta && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) handleRedo();
      else handleUndo();
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
      e.preventDefault();
      handleDeleteSelected();
    } else if (e.key === 'Escape') {
      setSelectedIds([]);
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleWorkspaceKeyDown}
      onMouseMove={handleWorkspaceMouseMove}
      onMouseUp={handleWorkspaceMouseUp}
      onMouseLeave={handleWorkspaceMouseUp}
      className={cn(
        'relative w-full mx-auto rounded-2xl border-2 border-[#CBD5E1] bg-white shadow-2xl overflow-hidden select-none focus:outline-none focus:border-[#5B8DEF]',
        compact ? 'border' : 'max-w-6xl'
      )}
    >
      {/* 1. Technical Drawing Sheet Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#F1F5F9] border-b border-[#CBD5E1] text-[11px] font-mono text-[#475569]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-red-500/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-500/40 inline-block" />
          </div>
          <span className="text-[#CBD5E1]">|</span>
          <span className="font-bold text-[#1E293B] truncate max-w-[260px] sm:max-w-none">{figureLabel}</span>
          <span className="hidden md:inline text-[#64748B]">· 1000 × 1000 PX VECTOR</span>
        </div>

        {/* Template Preset Switcher */}
        <div className="flex items-center gap-2">
          <label className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-[#64748B]">
            <LayoutTemplate className="w-3 h-3 text-[#5B8DEF]" />
            <span>PRESET:</span>
          </label>
          <select
            value={templateIdx}
            onChange={(e) => handleTemplateChange(Number(e.target.value))}
            className="h-6 rounded border border-[#CBD5E1] bg-white px-2 text-[11px] font-mono font-bold text-[#1E293B] focus:outline-none focus:border-[#5B8DEF] max-w-[200px]"
          >
            {PREDEFINED_TEMPLATES.map((t, i) => (
              <option key={i} value={i}>
                {String(i + 1).padStart(2, '0')} · {t.description}
              </option>
            ))}
          </select>

          <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#5B8DEF]/15 text-[#5B8DEF] border border-[#5B8DEF]/30">
            <span>INTERACTIVE SANDBOX</span>
          </div>
        </div>
      </div>

      {/* 2. Top Drafting Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-[#E2E8F0] bg-white text-xs">
        {/* Left: History, Palette Shift, Grouping Quick Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center border border-[#CBD5E1] rounded-lg p-0.5 bg-[#F8FAFC]">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIdx <= 0}
              className="p-1.5 hover:bg-white rounded text-[#64748B] hover:text-[#1E293B] disabled:opacity-30 transition-colors cursor-pointer"
              title="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIdx >= history.length - 1}
              className="p-1.5 hover:bg-white rounded text-[#64748B] hover:text-[#1E293B] disabled:opacity-30 transition-colors cursor-pointer"
              title="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handlePaletteShift}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#5B8DEF]/30 bg-[#5B8DEF]/10 hover:bg-[#5B8DEF]/20 text-[#2563EB] font-semibold text-xs transition-all cursor-pointer"
            title="Cycle live color harmony"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Palette Shift</span>
          </button>

          {selectedIds.length >= 2 && (
            <button
              type="button"
              onClick={handleGroupSelected}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-500/40 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-all cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Group ({selectedIds.length})</span>
            </button>
          )}

          {hasGrouped && (
            <button
              type="button"
              onClick={handleUngroupSelected}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-amber-400/50 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition-all cursor-pointer"
            >
              <FolderMinus className="w-3.5 h-3.5" />
              <span>Ungroup</span>
            </button>
          )}
        </div>

        {/* Center Info */}
        <div className="hidden xl:flex items-center gap-2 font-mono text-[11px] text-[#64748B]">
          <MousePointer2 className="w-3 h-3 text-[#5B8DEF]" />
          <span>SHIFT+CLICK MULTI-SELECT · CTRL+G GROUP</span>
        </div>

        {/* Right: Zoom badge & Open in Studio CTA */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="hidden sm:inline-block border border-[#CBD5E1] rounded-lg px-2 py-0.5 bg-[#F8FAFC] font-mono text-[11px] font-semibold text-[#1E293B]">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleOpenInStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B8DEF] hover:bg-[#4377DE] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <span>Open in Studio</span>
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Main Workspace Area: FIX -> Left column wraps Ruler + Artboard (flex-1 min-w-0 flex flex-col), Right column is Inspector */}
      <div className="relative flex flex-col lg:flex-row bg-[#F1F5F9]/80">
        {/* Left Column: Metric Ruler + Interactive Artboard + Slide Pagination */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Horizontal Top Metric Ruler */}
          <div className="w-full h-6 bg-[#E2E8F0] border-b border-[#CBD5E1] flex items-end overflow-hidden select-none font-mono text-[9px] text-[#64748B] px-6 sm:px-12 shrink-0">
            <div className="flex justify-between w-full">
              <span>0</span>
              <span className="hidden sm:inline">100</span>
              <span>200</span>
              <span className="hidden sm:inline">300</span>
              <span>400</span>
              <span className="text-[#5B8DEF] font-bold">500 [CENTER]</span>
              <span>600</span>
              <span className="hidden sm:inline">700</span>
              <span>800</span>
              <span className="hidden sm:inline">900</span>
              <span>1000 PX</span>
            </div>
          </div>

          {/* Centered Artboard Area */}
          <div className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden">
            {/* Blueprint Alignment Crosshair Overlay */}
            <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 w-[1px] border-r border-dashed border-[#38BDF8]/50 pointer-events-none z-0">
              <span className="absolute top-2 left-1.5 text-[9px] font-mono font-bold bg-[#38BDF8] text-white px-1 rounded-xs">
                X: 500 PX
              </span>
            </div>

            {/* Interactive 1000x1000 Scaled Canvas */}
            <div
              ref={artboardContainerRef}
              onMouseDown={handleArtboardMouseDown}
              className={cn(
                'relative w-full aspect-square rounded-xl shadow-2xl overflow-hidden border border-[#CBD5E1] z-10 cursor-crosshair',
                compact ? 'max-w-[480px]' : 'max-w-[540px]'
              )}
              style={{
                backgroundColor: design.canvasBackgroundColor || '#FFFFFF',
                backgroundImage:
                  'linear-gradient(to right, rgba(91,141,239,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(91,141,239,0.08) 1px, transparent 1px)',
                backgroundSize: `${50 * scale}px ${50 * scale}px`,
              }}
            >
              {design.elements.map((element) => {
                const isSelected = selectedIds.includes(element.id);
                const isGroupMember = Boolean(
                  !isSelected &&
                    element.groupId &&
                    design.elements.some((el) => el.groupId === element.groupId && selectedIds.includes(el.id))
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
                    onClick={(e) => e.stopPropagation()}
                  />
                );
              })}

              {/* Marquee Drag-Selection Box */}
              {marqueeState && (
                <div
                  className="absolute pointer-events-none border-2 border-[#2563EB] bg-[#3B82F6]/15 z-50"
                  style={{
                    left: `${Math.min(marqueeState.startX, marqueeState.currentX) * scale}px`,
                    top: `${Math.min(marqueeState.startY, marqueeState.currentY) * scale}px`,
                    width: `${Math.abs(marqueeState.currentX - marqueeState.startX) * scale}px`,
                    height: `${Math.abs(marqueeState.currentY - marqueeState.startY) * scale}px`,
                  }}
                />
              )}
            </div>

            {/* Floating Slide Pagination & Open in Studio Rail */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-xl border border-[#CBD5E1] bg-white shadow-md z-10">
              {pages.map((p, idx) => (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => handleSwitchSlide(idx)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer',
                    activeSlide === idx
                      ? 'bg-[#1E293B] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
                  )}
                >
                  <span>SLIDE {idx + 1}</span>
                  {activeSlide === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />}
                </button>
              ))}
              <div className="w-[1px] h-4 bg-[#E2E8F0] mx-1" />
              <button
                type="button"
                onClick={handleOpenInStudio}
                className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 px-1.5 cursor-pointer"
              >
                <span>Continue in Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Inspector & Layer Grouping Stack */}
        <div className="w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-[#CBD5E1] bg-white p-4 flex flex-col gap-3.5 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-1.5 font-bold text-[#1E293B]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B8DEF]" />
              <span>LIVE INSPECTOR</span>
            </div>
            <span className="text-[10px] text-[#64748B]">
              {selectedIds.length > 0 ? `${selectedIds.length} SELECTED` : 'CANVAS'}
            </span>
          </div>

          {/* Layer Stack with Multi-Select Checkboxes for Grouping */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#64748B] uppercase font-bold">
                Layers ({design.elements.length})
              </span>
              <div className="flex items-center gap-1">
                {selectedIds.length >= 2 && (
                  <button
                    type="button"
                    onClick={handleGroupSelected}
                    className="px-1.5 py-0.5 rounded bg-[#5B8DEF] text-white text-[9px] font-bold hover:bg-[#4377DE] cursor-pointer"
                  >
                    + GROUP
                  </button>
                )}
                {hasGrouped && (
                  <button
                    type="button"
                    onClick={handleUngroupSelected}
                    className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-bold hover:bg-amber-200 cursor-pointer"
                  >
                    UNGROUP
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {[...design.elements]
                .sort((a, b) => (Number(b.style?.zIndex) || 1) - (Number(a.style?.zIndex) || 1))
                .map((el) => {
                  const isSel = selectedIds.includes(el.id);
                  const label =
                    el.type === 'text'
                      ? el.content || 'Text Layer'
                      : el.type === 'image'
                      ? el.content || 'Image Frame'
                      : el.style?.shapeType || 'Shape Layer';

                  return (
                    <div
                      key={el.id}
                      onClick={(e) => {
                        if (e.shiftKey) {
                          setSelectedIds((prev) =>
                            prev.includes(el.id) ? prev.filter((id) => id !== el.id) : [...prev, el.id]
                          );
                        } else if (el.groupId) {
                          setSelectedIds(design.elements.filter((x) => x.groupId === el.groupId).map((x) => x.id));
                        } else {
                          setSelectedIds([el.id]);
                        }
                      }}
                      className={cn(
                        'flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors border',
                        isSel
                          ? 'bg-[#5B8DEF]/15 border-[#5B8DEF]/50 text-[#1E293B] font-bold'
                          : 'bg-[#F8FAFC] border-transparent hover:border-[#CBD5E1] text-[#475569]'
                      )}
                    >
                      {/* Multi-select checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIds((prev) =>
                            prev.includes(el.id) ? prev.filter((id) => id !== el.id) : [...prev, el.id]
                          );
                        }}
                        className={cn(
                          'w-3.5 h-3.5 rounded-xs border flex items-center justify-center shrink-0 cursor-pointer',
                          isSel ? 'bg-[#5B8DEF] border-[#5B8DEF] text-white' : 'bg-white border-[#CBD5E1]'
                        )}
                        title="Toggle multi-select"
                      >
                        {isSel && <Check className="w-2.5 h-2.5" />}
                      </button>

                      {el.type === 'text' ? (
                        <Type className="w-3 h-3 text-[#2563EB] shrink-0" />
                      ) : el.type === 'image' ? (
                        <ImageIcon className="w-3 h-3 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-3 h-3 text-amber-600 shrink-0" />
                      )}

                      <span className="truncate flex-1 text-[11px]">{label}</span>

                      {el.groupId && (
                        <span className="px-1 py-0.2 rounded bg-blue-100 text-blue-700 text-[8px] font-bold flex items-center gap-0.5 shrink-0">
                          <Folder className="w-2 h-2" />
                          GRP
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Active Selection Property Controls */}
          {primaryElement ? (
            <div className="space-y-2.5 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#64748B] uppercase font-bold">
                  Edit {primaryElement.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateElement({
                        ...primaryElement,
                        position: {
                          ...primaryElement.position,
                          x: Math.round((CANVAS_BASE - primaryElement.size.width) / 2),
                        },
                      })
                    }
                    className="p-1 rounded hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B] cursor-pointer"
                    title="Center Horizontally"
                  >
                    <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDuplicateSelected}
                    className="p-1 rounded hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#1E293B] cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    className="p-1 rounded hover:bg-red-50 text-red-500 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {primaryElement.type === 'text' && (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={primaryElement.content || ''}
                    onChange={(e) =>
                      handleUpdateElement({
                        ...primaryElement,
                        content: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] p-2 text-xs font-sans text-[#1E293B] focus:outline-none focus:border-[#5B8DEF]"
                    placeholder="Edit text copy..."
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#64748B]">FONT SIZE</span>
                    <input
                      type="number"
                      min={10}
                      max={140}
                      value={parseInt(String(primaryElement.style?.fontSize || '32'), 10) || 32}
                      onChange={(e) =>
                        handleUpdateElement({
                          ...primaryElement,
                          style: {
                            ...primaryElement.style,
                            fontSize: `${Math.max(10, Number(e.target.value) || 24)}px`,
                          },
                        })
                      }
                      className="w-20 h-7 rounded border border-[#CBD5E1] bg-white px-2 text-xs text-right text-[#1E293B]"
                    />
                  </div>
                </div>
              )}

              {/* Color Swatches for Text or Shape */}
              {(primaryElement.type === 'text' || primaryElement.type === 'shape') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                    <span>{primaryElement.type === 'text' ? 'TEXT COLOR' : 'FILL COLOR'}</span>
                    <input
                      type="color"
                      value={
                        (primaryElement.type === 'text'
                          ? (primaryElement.style?.color as string)
                          : (primaryElement.style?.backgroundColor as string)) || '#2563EB'
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        handleUpdateElement({
                          ...primaryElement,
                          style: {
                            ...primaryElement.style,
                            ...(primaryElement.type === 'text'
                              ? { color: val }
                              : { backgroundColor: val }),
                          },
                        });
                      }}
                      className="w-6 h-5 rounded cursor-pointer border border-[#CBD5E1]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() =>
                          handleUpdateElement({
                            ...primaryElement,
                            style: {
                              ...primaryElement.style,
                              ...(primaryElement.type === 'text'
                                ? { color: hex }
                                : { backgroundColor: hex }),
                            },
                          })
                        }
                        className="w-5 h-5 rounded border border-[#CBD5E1] shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Coordinates Readout */}
              <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] text-[#64748B]">
                <div>
                  X: <span className="font-bold text-[#1E293B]">{Math.round(primaryElement.position.x)}</span>
                </div>
                <div>
                  Y: <span className="font-bold text-[#1E293B]">{Math.round(primaryElement.position.y)}</span>
                </div>
                <div>
                  W: <span className="font-bold text-[#1E293B]">{Math.round(primaryElement.size.width)}</span>
                </div>
                <div>
                  H: <span className="font-bold text-[#1E293B]">{Math.round(primaryElement.size.height)}</span>
                </div>
              </div>
            </div>
          ) : selectedElements.length > 1 ? (
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <div className="p-2.5 rounded-lg bg-[#5B8DEF]/10 border border-[#5B8DEF]/30 space-y-2">
                <div className="font-bold text-[#1E293B] flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{selectedElements.length} Elements Selected</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={handleGroupSelected}
                    className="flex items-center justify-center gap-1 py-1.5 rounded bg-[#5B8DEF] hover:bg-[#4377DE] text-white font-bold text-[11px] cursor-pointer"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>Group</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUngroupSelected}
                    disabled={!hasGrouped}
                    className="flex items-center justify-center gap-1 py-1.5 rounded bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#1E293B] font-bold text-[11px] disabled:opacity-40 cursor-pointer"
                  >
                    <FolderMinus className="w-3 h-3" />
                    <span>Ungroup</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDuplicateSelected}
                    className="flex items-center justify-center gap-1 py-1.5 rounded bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#1E293B] font-bold text-[11px] cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    className="flex items-center justify-center gap-1 py-1.5 rounded bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold text-[11px] cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                <span className="flex items-center gap-1 font-bold uppercase">
                  <Palette className="w-3 h-3 text-[#5B8DEF]" />
                  Canvas Background
                </span>
                <input
                  type="color"
                  value={design.canvasBackgroundColor || '#FFFFFF'}
                  onChange={(e) => commitLayout(syncPages(design, design.elements, e.target.value))}
                  className="w-6 h-5 rounded cursor-pointer border border-[#CBD5E1]"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => commitLayout(syncPages(design, design.elements, hex))}
                    className="w-5 h-5 rounded border border-[#CBD5E1] hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Save & Continue in Full Studio CTA */}
          <div className="mt-auto pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={handleOpenInStudio}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#1E293B] hover:bg-[#0F172A] text-white font-sans text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <span>Keep Editing in Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Drawing Sheet Verification Block */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 bg-[#F8FAFC] border-t border-[#CBD5E1] text-[10px] font-mono text-[#64748B]">
        <div className="flex items-center gap-3 flex-wrap">
          <span>PRESET #{String(templateIdx + 1).padStart(2, '0')}</span>
          <span>·</span>
          <span>EDITS TRANSFER DIRECTLY TO STUDIO</span>
        </div>
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <span className="text-emerald-600 font-bold">✓ LIVE CLIENT-SIDE VECTOR CANVAS</span>
        </div>
      </div>
    </div>
  );
}
