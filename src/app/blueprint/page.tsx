'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/shared/AppHeader';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { CenterPanel } from '@/components/layout/CenterPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import type { DesignLayout, DesignElement, DesignPage } from '@/types/blueprint';
import { addIdsToElements } from '@/components/canvas/Canvas';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_BLANK_DESIGN: DesignLayout = {
  id: 'starter_design',
  description: 'Blank Canvas',
  elements: [],
  canvasBackgroundColor: '#FFFFFF',
  pages: [
    {
      id: 'page_1',
      title: 'Slide 1',
      elements: [],
      canvasBackgroundColor: '#FFFFFF',
    },
  ],
  activePageIndex: 0,
};

function ensureDesignPages(layout: DesignLayout): DesignLayout {
  if (layout.pages && layout.pages.length > 0) {
    const activeIdx = Math.min(Math.max(0, layout.activePageIndex ?? 0), layout.pages.length - 1);
    const activePage = layout.pages[activeIdx];
    return {
      ...layout,
      pages: layout.pages,
      activePageIndex: activeIdx,
      elements: activePage.elements || [],
      canvasBackgroundColor: activePage.canvasBackgroundColor || layout.canvasBackgroundColor || '#FFFFFF',
    };
  }

  const initialPage: DesignPage = {
    id: crypto.randomUUID(),
    title: 'Slide 1',
    elements: layout.elements || [],
    canvasBackgroundColor: layout.canvasBackgroundColor || '#FFFFFF',
  };

  return {
    ...layout,
    pages: [initialPage],
    activePageIndex: 0,
    elements: initialPage.elements,
    canvasBackgroundColor: initialPage.canvasBackgroundColor,
  };
}

export default function BlueprintEditorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [currentDesign, setCurrentDesign] = useState<DesignLayout>(DEFAULT_BLANK_DESIGN);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Undo / Redo history state
  const [history, setHistory] = useState<DesignLayout[]>([DEFAULT_BLANK_DESIGN]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/blueprint');
    }
  }, [user, authLoading, router]);

  const commitToHistory = useCallback((newDesign: DesignLayout) => {
    const normalized = ensureDesignPages(newDesign);
    setCurrentDesign(normalized);
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      const nextHistory = [...upToCurrent, normalized].slice(-30);
      setHistoryIndex(nextHistory.length - 1);
      return nextHistory;
    });
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const targetIndex = historyIndex - 1;
      setHistoryIndex(targetIndex);
      setCurrentDesign(history[targetIndex]);
      setSelectedElementId(null);
      toast({ title: 'Undo', description: 'Reverted to previous change.', duration: 1500 });
    }
  }, [historyIndex, history, toast]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const targetIndex = historyIndex + 1;
      setHistoryIndex(targetIndex);
      setCurrentDesign(history[targetIndex]);
      setSelectedElementId(null);
      toast({ title: 'Redo', description: 'Restored change.', duration: 1500 });
    }
  }, [historyIndex, history, toast]);

  // Page / Carousel Operations
  const handleSelectPage = useCallback((index: number) => {
    const pages = currentDesign.pages || [];
    if (pages.length === 0) return;
    const targetIdx = Math.min(Math.max(0, index), pages.length - 1);
    if (targetIdx === currentDesign.activePageIndex) return;

    const targetPage = pages[targetIdx];
    setSelectedElementId(null);

    const updated: DesignLayout = {
      ...currentDesign,
      activePageIndex: targetIdx,
      elements: targetPage.elements || [],
      canvasBackgroundColor: targetPage.canvasBackgroundColor || '#FFFFFF',
    };
    commitToHistory(updated);
  }, [currentDesign, commitToHistory]);

  const handleAddPage = useCallback(() => {
    const pages = currentDesign.pages ? [...currentDesign.pages] : [];
    const newSlideNum = pages.length + 1;
    const newPage: DesignPage = {
      id: crypto.randomUUID(),
      title: `Slide ${newSlideNum}`,
      elements: [],
      canvasBackgroundColor: currentDesign.canvasBackgroundColor || '#FFFFFF',
    };
    const nextPages = [...pages, newPage];
    const newIdx = nextPages.length - 1;

    setSelectedElementId(null);
    const updated: DesignLayout = {
      ...currentDesign,
      pages: nextPages,
      activePageIndex: newIdx,
      elements: [],
      canvasBackgroundColor: newPage.canvasBackgroundColor,
    };
    commitToHistory(updated);
    toast({ title: `Added Slide ${newSlideNum}`, description: 'New carousel slide created.' });
  }, [currentDesign, commitToHistory, toast]);

  const handleDuplicatePage = useCallback((index: number) => {
    const pages = currentDesign.pages ? [...currentDesign.pages] : [];
    const target = pages[index];
    if (!target) return;

    const duplicatedElements: DesignElement[] = (target.elements || []).map((el) => ({
      ...el,
      id: crypto.randomUUID(),
    }));

    const newPage: DesignPage = {
      id: crypto.randomUUID(),
      title: `${target.title || `Slide ${index + 1}`} (Copy)`,
      elements: duplicatedElements,
      canvasBackgroundColor: target.canvasBackgroundColor || currentDesign.canvasBackgroundColor || '#FFFFFF',
    };

    const nextPages = [...pages];
    nextPages.splice(index + 1, 0, newPage);
    const newIdx = index + 1;

    setSelectedElementId(null);
    const updated: DesignLayout = {
      ...currentDesign,
      pages: nextPages,
      activePageIndex: newIdx,
      elements: duplicatedElements,
      canvasBackgroundColor: newPage.canvasBackgroundColor,
    };
    commitToHistory(updated);
    toast({ title: 'Slide Duplicated', description: `Cloned as Slide ${newIdx + 1}.` });
  }, [currentDesign, commitToHistory, toast]);

  const handleDeletePage = useCallback((index: number) => {
    const pages = currentDesign.pages ? [...currentDesign.pages] : [];
    if (pages.length <= 1) {
      toast({
        title: 'Cannot Delete Slide',
        description: 'A carousel must have at least one slide.',
        variant: 'destructive',
      });
      return;
    }

    const filtered = pages.filter((_, idx) => idx !== index);
    const reindexedPages = filtered.map((p, idx) => ({
      ...p,
      title: p.title?.startsWith('Slide ') ? `Slide ${idx + 1}` : p.title,
    }));

    const nextIdx = Math.min(index, reindexedPages.length - 1);
    const activePage = reindexedPages[nextIdx];

    setSelectedElementId(null);
    const updated: DesignLayout = {
      ...currentDesign,
      pages: reindexedPages,
      activePageIndex: nextIdx,
      elements: activePage.elements || [],
      canvasBackgroundColor: activePage.canvasBackgroundColor || '#FFFFFF',
    };
    commitToHistory(updated);
    toast({ title: 'Slide Removed', description: `Carousel now has ${reindexedPages.length} slides.` });
  }, [currentDesign, commitToHistory, toast]);

  const handleReorderPage = useCallback((fromIdx: number, toIdx: number) => {
    const pages = currentDesign.pages ? [...currentDesign.pages] : [];
    if (fromIdx < 0 || fromIdx >= pages.length || toIdx < 0 || toIdx >= pages.length || fromIdx === toIdx) return;

    const nextPages = [...pages];
    const [moved] = nextPages.splice(fromIdx, 1);
    nextPages.splice(toIdx, 0, moved);

    const updated: DesignLayout = {
      ...currentDesign,
      pages: nextPages,
      activePageIndex: toIdx,
      elements: moved.elements || [],
      canvasBackgroundColor: moved.canvasBackgroundColor || '#FFFFFF',
    };
    commitToHistory(updated);
  }, [currentDesign, commitToHistory]);

  // Global Keyboard shortcuts:
  // Undo/Redo: Ctrl+Z / Cmd+Z, Ctrl+Y / Cmd+Shift+Z
  // Carousel Navigation: PageUp/PageDown or Alt+ArrowLeft/Alt+ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'PageUp' || (e.altKey && e.key === 'ArrowLeft')) {
        e.preventDefault();
        const activeIdx = currentDesign.activePageIndex ?? 0;
        if (activeIdx > 0) {
          handleSelectPage(activeIdx - 1);
        }
      } else if (e.key === 'PageDown' || (e.altKey && e.key === 'ArrowRight')) {
        e.preventDefault();
        const activeIdx = currentDesign.activePageIndex ?? 0;
        const total = currentDesign.pages?.length || 1;
        if (activeIdx < total - 1) {
          handleSelectPage(activeIdx + 1);
        }
      } else if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleAddPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleSelectPage, handleAddPage, currentDesign]);

  const handleLayoutSelect = (layout: DesignLayout | null) => {
    const next = layout ? ensureDesignPages(layout) : DEFAULT_BLANK_DESIGN;
    commitToHistory(next);
    setSelectedElementId(null);
  };

  const handleSelectElement = (elementId: string | null) => {
    setSelectedElementId(elementId);
  };

  const getSelectedElement = (): DesignElement | null => {
    if (!currentDesign || !selectedElementId) return null;
    return currentDesign.elements.find((el) => el.id === selectedElementId) || null;
  };

  const syncActivePageElements = (newElements: DesignElement[], newBgColor?: string): DesignLayout => {
    const activeIdx = currentDesign.activePageIndex ?? 0;
    const pages = currentDesign.pages ? [...currentDesign.pages] : [];

    if (pages[activeIdx]) {
      pages[activeIdx] = {
        ...pages[activeIdx],
        elements: newElements,
        ...(newBgColor !== undefined ? { canvasBackgroundColor: newBgColor } : {}),
      };
    }

    return {
      ...currentDesign,
      pages,
      elements: newElements,
      ...(newBgColor !== undefined ? { canvasBackgroundColor: newBgColor } : {}),
    };
  };

  const handleUpdateElement = (updatedElement: DesignElement) => {
    const updatedElements = currentDesign.elements.map((el) =>
      el.id === updatedElement.id ? updatedElement : el
    );
    const updatedLayout = syncActivePageElements(updatedElements);
    commitToHistory(updatedLayout);
  };

  const handleDeleteElement = (elementId: string) => {
    const updatedElements = currentDesign.elements.filter((el) => el.id !== elementId);
    const updatedLayout = syncActivePageElements(updatedElements);
    commitToHistory(updatedLayout);
    setSelectedElementId(null);
    toast({ title: 'Element Removed' });
  };

  const handleDuplicateElement = (elementId: string) => {
    const target = currentDesign.elements.find((el) => el.id === elementId);
    if (!target) return;

    const duplicated: DesignElement = {
      ...target,
      id: crypto.randomUUID(),
      position: {
        x: Math.min(900, target.position.x + 24),
        y: Math.min(900, target.position.y + 24),
      },
      style: {
        ...target.style,
        zIndex: (Number(target.style?.zIndex) || 1) + 1,
      },
    };

    const updatedElements = [...currentDesign.elements, duplicated];
    const updatedLayout = syncActivePageElements(updatedElements);
    commitToHistory(updatedLayout);
    setSelectedElementId(duplicated.id);
    toast({ title: 'Element Duplicated' });
  };

  const handleAddElement = (newElementSchema: Omit<DesignElement, 'id'>) => {
    const [newElementWithId] = addIdsToElements([newElementSchema]);
    const updatedElements = [...currentDesign.elements, newElementWithId];
    const updatedLayout = syncActivePageElements(updatedElements);
    commitToHistory(updatedLayout);
    setSelectedElementId(newElementWithId.id);
  };

  const handleUpdateCanvasBackgroundColor = (color: string) => {
    const updatedLayout = syncActivePageElements(currentDesign.elements, color);
    commitToHistory(updatedLayout);
  };

  if (authLoading || !user) {
    return (
      <div className="flex flex-col h-screen max-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">Loading Blueprint Studio...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background">
      <AppHeader currentDesign={currentDesign} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <LeftPanel
          currentDesign={currentDesign}
          selectedElementId={selectedElementId}
          onLayoutSelect={handleLayoutSelect}
          onAddElement={handleAddElement}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
        />
        <CenterPanel
          currentDesign={currentDesign}
          selectedElementId={selectedElementId}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onLayoutUpdate={commitToHistory}
          pages={currentDesign.pages || []}
          activePageIndex={currentDesign.activePageIndex ?? 0}
          onSelectPage={handleSelectPage}
          onAddPage={handleAddPage}
          onDuplicatePage={handleDuplicatePage}
          onDeletePage={handleDeletePage}
          onReorderPage={handleReorderPage}
        />
        <RightPanel
          selectedElement={getSelectedElement()}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          canvasBackgroundColor={currentDesign?.canvasBackgroundColor}
          onUpdateCanvasBackgroundColor={handleUpdateCanvasBackgroundColor}
        />
      </div>
    </div>
  );
}
