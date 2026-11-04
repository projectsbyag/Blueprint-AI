'use client';

import { Canvas } from '@/components/canvas/Canvas';
import { CarouselTray } from '@/components/canvas/CarouselTray';
import type { DesignLayout, DesignElement, DesignPage } from '@/types/blueprint';

interface CenterPanelProps {
  currentDesign: DesignLayout | null;
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
  // Multi-page carousel support
  pages?: DesignPage[];
  activePageIndex?: number;
  onSelectPage?: (index: number) => void;
  onAddPage?: () => void;
  onDuplicatePage?: (index: number) => void;
  onDeletePage?: (index: number) => void;
  onReorderPage?: (fromIndex: number, toIndex: number) => void;
}

export function CenterPanel({
  currentDesign,
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
  pages = [],
  activePageIndex = 0,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onReorderPage,
}: CenterPanelProps) {
  const displayPages: DesignPage[] =
    pages.length > 0
      ? pages
      : currentDesign?.pages && currentDesign.pages.length > 0
      ? currentDesign.pages
      : [
          {
            id: currentDesign?.id || 'page_1',
            title: 'Slide 1',
            elements: currentDesign?.elements || [],
            canvasBackgroundColor: currentDesign?.canvasBackgroundColor || '#FFFFFF',
          },
        ];

  return (
    <main className="flex-1 bg-muted/20 flex flex-col items-center justify-between overflow-hidden h-full relative">
      <div className="flex-1 w-full h-full min-h-0 relative flex items-center justify-center overflow-hidden">
        <Canvas
          design={currentDesign}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          onUpdateElement={onUpdateElement}
          onDeleteElement={onDeleteElement}
          onDuplicateElement={onDuplicateElement}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
          onLayoutUpdate={onLayoutUpdate}
          className="w-full h-full max-w-full max-h-full"
        />
      </div>

      {/* Multi-page carousel tray beneath canvas */}
      {onSelectPage && onAddPage && onDuplicatePage && onDeletePage && onReorderPage && (
        <CarouselTray
          pages={displayPages}
          activePageIndex={activePageIndex}
          onSelectPage={onSelectPage}
          onAddPage={onAddPage}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          onReorderPage={onReorderPage}
        />
      )}
    </main>
  );
}
