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
  // Multi-element selection state for grouping
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const selectedElementId = selectedElementIds[0] || null;

  // Adjustable and Collapsible Side Panels State
  const [leftPanelWidth, setLeftPanelWidth] = useState(360);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const isDraggingLeftResizer = useRef(false);
  const isDraggingRightResizer = useRef(false);



  // Undo / Redo history state
  const [history, setHistory] = useState<DesignLayout[]>([DEFAULT_BLANK_DESIGN]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/blueprint');
    }
  }, [user, authLoading, router]);

  // Recalculate auto-fit canvas scale whenever side panels resize or collapse
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 60);
    return () => clearTimeout(timer);
  }, [leftPanelWidth, isLeftPanelCollapsed, rightPanelWidth, isRightPanelCollapsed]);

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
      setSelectedElementIds([]);
      toast({ title: 'Undo', description: 'Reverted to previous change.', duration: 1500 });
    }
  }, [historyIndex, history, toast]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const targetIndex = historyIndex + 1;
      setHistoryIndex(targetIndex);
      setCurrentDesign(history[targetIndex]);
      setSelectedElementIds([]);
      toast({ title: 'Redo', description: 'Restored change.', duration: 1500 });
    }
  }, [historyIndex, history, toast]);

  // Helper to sync elements back to the active page
  const syncActivePageElements = useCallback(
    (newElements: DesignElement[], newBgColor?: string): DesignLayout => {
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
    },
    [currentDesign]
  );

  // Grouping Operations
  const handleGroupElements = useCallback(() => {
    if (selectedElementIds.length < 2) {
      toast({
        title: 'Select Multiple Elements',
        description: 'Select at least 2 elements (hold Shift to multi-select) to group them.',
      });
      return;
    }

    const newGroupId = `group_${crypto.randomUUID().slice(0, 8)}`;
    const updatedElements = currentDesign.elements.map((el) =>
      selectedElementIds.includes(el.id) ? { ...el, groupId: newGroupId } : el
    );

    const updatedLayout = syncActivePageElements(updatedElements);
    commitToHistory(updatedLayout);
    toast({
      title: 'Elements Grouped!',
      description: `Grouped ${selectedElementIds.length} elements together (Ctrl+G).`,
    });
  }, [selectedElementIds, currentDesign, syncActivePageElements, commitToHistory, toast]);

  const handleUngroupElements = useCallback(() => {
    if (selectedElementIds.length === 0) return;

    const selectedGroupIds = new Set(
      currentDesign.elements
        .filter((el) => selectedElementIds.includes(el.id) && el.groupId)
        .map((el) => el.groupId!)
    );

    if (selectedGroupIds.size === 0) {
      toast({
        title: 'No Group Selected',
        description: 'None of the selected elements belong to a group.',
      });
      return;
    }

    const updatedElements = currentDesign.elements.map((el) =>
      el.groupId && selectedGroupIds.has(el.groupId) ? { ...el, groupId: undefined } : el
    );

    const updatedLayout = syncActivePageElements(updatedElements);
    commitToHistory(updatedLayout);
    toast({
      title: 'Elements Ungrouped',
      description: 'Group dissolved into individual elements (Ctrl+Shift+G).',
    });
  }, [selectedElementIds, currentDesign, syncActivePageElements, commitToHistory, toast]);

  const handleBatchUpdateElements = useCallback(
    (updatedList: DesignElement[]) => {
      const map = new Map(updatedList.map((el) => [el.id, el]));
      const updatedElements = currentDesign.elements.map((el) => map.get(el.id) || el);
      const updatedLayout = syncActivePageElements(updatedElements);
      commitToHistory(updatedLayout);
    },
    [currentDesign, syncActivePageElements, commitToHistory]
  );

  const handleDuplicateSelected = useCallback(
    (idsToDup?: string[]) => {
      const ids = idsToDup || selectedElementIds;
      if (ids.length === 0) return;

      const targets = currentDesign.elements.filter((el) => ids.includes(el.id));
      if (targets.length === 0) return;

      // Map old groupIds to new ones so duplicated groups remain grouped
      const oldToNewGroupId = new Map<string, string>();
      targets.forEach((t) => {
        if (t.groupId && !oldToNewGroupId.has(t.groupId)) {
          oldToNewGroupId.set(t.groupId, `group_${crypto.randomUUID().slice(0, 8)}`);
        }
      });

      const duplicatedElements: DesignElement[] = targets.map((t) => ({
        ...t,
        id: crypto.randomUUID(),
        position: {
          x: Math.min(900, t.position.x + 24),
          y: Math.min(900, t.position.y + 24),
        },
        groupId: t.groupId ? oldToNewGroupId.get(t.groupId) : undefined,
        style: {
          ...t.style,
          zIndex: (Number(t.style?.zIndex) || 1) + 1,
        },
      }));

      const updatedElements = [...currentDesign.elements, ...duplicatedElements];
      const updatedLayout = syncActivePageElements(updatedElements);
      commitToHistory(updatedLayout);
      setSelectedElementIds(duplicatedElements.map((el) => el.id));
      toast({
        title: targets.length > 1 ? `Duplicated ${targets.length} Elements` : 'Element Duplicated',
      });
    },
    [selectedElementIds, currentDesign, syncActivePageElements, commitToHistory, toast]
  );

  const handleDeleteSelected = useCallback(
    (idsToDel?: string[]) => {
      const ids = idsToDel || selectedElementIds;
      if (ids.length === 0) return;

      const updatedElements = currentDesign.elements.filter((el) => !ids.includes(el.id));
      const updatedLayout = syncActivePageElements(updatedElements);
      commitToHistory(updatedLayout);
      setSelectedElementIds([]);
      toast({ title: ids.length > 1 ? `Removed ${ids.length} Elements` : 'Element Removed' });
    },
    [selectedElementIds, currentDesign, syncActivePageElements, commitToHistory, toast]
  );

  // Page / Carousel Operations
  const handleSelectPage = useCallback(
    (index: number) => {
      const pages = currentDesign.pages || [];
      if (pages.length === 0) return;
      const targetIdx = Math.min(Math.max(0, index), pages.length - 1);
      if (targetIdx === currentDesign.activePageIndex) return;

      const targetPage = pages[targetIdx];
      setSelectedElementIds([]);

      const updated: DesignLayout = {
        ...currentDesign,
        activePageIndex: targetIdx,
        elements: targetPage.elements || [],
        canvasBackgroundColor: targetPage.canvasBackgroundColor || '#FFFFFF',
      };
      commitToHistory(updated);
    },
    [currentDesign, commitToHistory]
  );

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

    setSelectedElementIds([]);
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

  const handleDuplicatePage = useCallback(
    (index: number) => {
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

      setSelectedElementIds([]);
      const updated: DesignLayout = {
        ...currentDesign,
        pages: nextPages,
        activePageIndex: newIdx,
        elements: duplicatedElements,
        canvasBackgroundColor: newPage.canvasBackgroundColor,
      };
      commitToHistory(updated);
      toast({ title: 'Slide Duplicated', description: `Cloned as Slide ${newIdx + 1}.` });
    },
    [currentDesign, commitToHistory, toast]
  );

  const handleDeletePage = useCallback(
    (index: number) => {
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

      setSelectedElementIds([]);
      const updated: DesignLayout = {
        ...currentDesign,
        pages: reindexedPages,
        activePageIndex: nextIdx,
        elements: activePage.elements || [],
        canvasBackgroundColor: activePage.canvasBackgroundColor || '#FFFFFF',
      };
      commitToHistory(updated);
      toast({ title: 'Slide Removed', description: `Carousel now has ${reindexedPages.length} slides.` });
    },
    [currentDesign, commitToHistory, toast]
  );

  const handleReorderPage = useCallback(
    (fromIdx: number, toIdx: number) => {
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
    },
    [currentDesign, commitToHistory]
  );

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      if (isCtrlOrMeta && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          handleUngroupElements();
        } else {
          handleGroupElements();
        }
      } else if (isCtrlOrMeta && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateSelected();
      } else if (isCtrlOrMeta && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (isCtrlOrMeta && e.key.toLowerCase() === 'y') {
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
  }, [
    handleUndo,
    handleRedo,
    handleGroupElements,
    handleUngroupElements,
    handleDuplicateSelected,
    handleSelectPage,
    handleAddPage,
    currentDesign,
  ]);

  const handleLayoutSelect = (layout: DesignLayout | null) => {
    const next = layout ? ensureDesignPages(layout) : DEFAULT_BLANK_DESIGN;
    commitToHistory(next);
    setSelectedElementIds([]);
  };

  const handleSelectElement = (elementId: string | null) => {
    if (!elementId) {
      setSelectedElementIds([]);
      return;
    }
    const target = currentDesign.elements.find((el) => el.id === elementId);
    if (target?.groupId) {
      const groupMembers = currentDesign.elements.filter((el) => el.groupId === target.groupId).map((el) => el.id);
      setSelectedElementIds(groupMembers);
    } else {
      setSelectedElementIds([elementId]);
    }
  };

  const handleSelectElements = (elementIds: string[]) => {
    setSelectedElementIds(elementIds);
  };

  const handleToggleSelectElement = (elementId: string) => {
    const target = currentDesign.elements.find((el) => el.id === elementId);
    const targetIds = target?.groupId
      ? currentDesign.elements.filter((el) => el.groupId === target.groupId).map((el) => el.id)
      : [elementId];

    setSelectedElementIds((prev) => {
      const allSelected = targetIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !targetIds.includes(id));
      } else {
        return Array.from(new Set([...prev, ...targetIds]));
      }
    });
  };

  const getSelectedElement = (): DesignElement | null => {
    if (!currentDesign || !selectedElementId) return null;
    return currentDesign.elements.find((el) => el.id === selectedElementId) || null;
  };

  const handleUpdateElement = (updatedElement: DesignElement) => {
    const updatedElements = currentDesign.elements.map((el) =>
      el.id === updatedElement.id ? updatedElement : el
    );
    const updatedLayout = syncActivePageElements(updatedElements);
    commitToHistory(updatedLayout);
  };

  const handleDeleteElement = (elementId: string) => {
    handleDeleteSelected([elementId]);
  };

  const handleDuplicateElement = (elementId: string) => {
    handleDuplicateSelected([elementId]);
  };

  const handleAddElement = (newElementSchema: Omit<DesignElement, 'id'>) => {
    const [newElementWithId] = addIdsToElements([newElementSchema]);
    const updatedElements = [...currentDesign.elements, newElementWithId];
    const updatedLayout = syncActivePageElements(updatedElements);
    commitToHistory(updatedLayout);
    setSelectedElementIds([newElementWithId.id]);
  };

  const handleUpdateCanvasBackgroundColor = (color: string) => {
    const updatedLayout = syncActivePageElements(currentDesign.elements, color);
    commitToHistory(updatedLayout);
  };

  // Drag-to-resize handlers for side panels
  const startLeftResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingLeftResizer.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingLeftResizer.current) return;
      const newWidth = Math.min(550, Math.max(260, moveEvent.clientX));
      setLeftPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      isDraggingLeftResizer.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.dispatchEvent(new Event('resize'));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const startRightResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRightResizer.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRightResizer.current) return;
      const newWidth = Math.min(500, Math.max(250, window.innerWidth - moveEvent.clientX));
      setRightPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      isDraggingRightResizer.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.dispatchEvent(new Event('resize'));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
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
      <AppHeader
        currentDesign={currentDesign}
        isRightPanelCollapsed={isRightPanelCollapsed}
        onToggleRightPanel={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
        isLeftPanelCollapsed={isLeftPanelCollapsed}
        onToggleLeftPanel={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
      />
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Left Side Panel (Adjustable & Collapsible) */}
        <LeftPanel
          currentDesign={currentDesign}
          selectedElementId={selectedElementId}
          selectedElementIds={selectedElementIds}
          onLayoutSelect={handleLayoutSelect}
          onAddElement={handleAddElement}
          onSelectElement={handleSelectElement}
          onSelectElements={handleSelectElements}
          onToggleSelectElement={handleToggleSelectElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          width={leftPanelWidth}
          isCollapsed={isLeftPanelCollapsed}
          onToggleCollapse={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
        />

        {/* Resizer Handle: Left Panel to Center */}
        {!isLeftPanelCollapsed && (
          <div
            onMouseDown={startLeftResize}
            className="w-1.5 hover:w-2 bg-transparent hover:bg-primary/50 active:bg-primary cursor-col-resize z-20 shrink-0 transition-all select-none group flex items-center justify-center"
            title="Drag to resize Left Panel"
          >
            <div className="w-[1px] h-8 bg-border group-hover:bg-primary" />
          </div>
        )}

        {/* Center Panel (Expands to occupy all available space) */}
        <div className="flex-1 min-w-0 h-full relative flex flex-col overflow-hidden">
          <CenterPanel
            currentDesign={currentDesign}
            selectedElementId={selectedElementId}
            selectedElementIds={selectedElementIds}
            onSelectElement={handleSelectElement}
            onSelectElements={handleSelectElements}
            onToggleSelectElement={handleToggleSelectElement}
            onGroupElements={handleGroupElements}
            onUngroupElements={handleUngroupElements}
            onUpdateElement={handleUpdateElement}
            onBatchUpdateElements={handleBatchUpdateElements}
            onDeleteElement={handleDeleteElement}
            onDeleteElements={handleDeleteSelected}
            onDuplicateElement={handleDuplicateElement}
            onDuplicateElements={handleDuplicateSelected}
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
        </div>

        {/* Resizer Handle: Center to Right Panel */}
        {!isRightPanelCollapsed && (
          <div
            onMouseDown={startRightResize}
            className="w-1.5 hover:w-2 bg-transparent hover:bg-primary/50 active:bg-primary cursor-col-resize z-20 shrink-0 transition-all select-none group flex items-center justify-center"
            title="Drag to resize Right Panel"
          >
            <div className="w-[1px] h-8 bg-border group-hover:bg-primary" />
          </div>
        )}

        {/* Right Side Panel (Adjustable & Collapsible) */}
        <RightPanel
          selectedElement={getSelectedElement()}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={handleDuplicateElement}
          canvasBackgroundColor={currentDesign?.canvasBackgroundColor}
          onUpdateCanvasBackgroundColor={handleUpdateCanvasBackgroundColor}
          width={rightPanelWidth}
          isCollapsed={isRightPanelCollapsed}
          onToggleCollapse={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
        />
      </div>

    </div>
  );
}
