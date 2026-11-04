'use client';

import { PropertiesEditor } from '@/components/editors/PropertiesEditor';
import type { DesignElement } from '@/types/blueprint';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, SlidersHorizontal } from 'lucide-react';

interface RightPanelProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (updatedElement: DesignElement) => void;
  onDeleteElement?: (elementId: string) => void;
  onDuplicateElement?: (elementId: string) => void;
  canvasBackgroundColor?: string;
  onUpdateCanvasBackgroundColor: (color: string) => void;
  // Resizing & Collapsing
  width?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function RightPanel({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  canvasBackgroundColor,
  onUpdateCanvasBackgroundColor,
  width = 320,
  isCollapsed = false,
  onToggleCollapse,
}: RightPanelProps) {
  if (isCollapsed) {
    return (
      <aside className="w-11 border-l bg-card flex flex-col items-center py-2 shrink-0 select-none z-30 transition-all duration-150">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          title="Expand Properties Panel"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="my-2 w-5 h-[1px] bg-border" />
        <button
          onClick={onToggleCollapse}
          className="flex flex-col items-center gap-2 p-1.5 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
          title="Click to open Properties"
        >
          <SlidersHorizontal className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          <span
            className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground [writing-mode:vertical-rl] rotate-180 select-none"
            style={{ textOrientation: 'mixed' }}
          >
            Properties
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      style={{ width: `${width}px` }}
      className="border-l bg-card flex flex-col h-full min-h-0 overflow-hidden shrink-0 select-none relative transition-all duration-75"
    >
      {/* Top Header with Collapse action */}
      <div className="flex items-center justify-between px-3 h-12 border-b bg-muted/40 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
          <span>Properties</span>
        </div>

        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
            title="Collapse Right Panel (larger canvas area)"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <PropertiesEditor
          selectedElement={selectedElement}
          onUpdateElement={onUpdateElement}
          onDeleteElement={onDeleteElement}
          onDuplicateElement={onDuplicateElement}
          canvasBackgroundColor={canvasBackgroundColor}
          onUpdateCanvasBackgroundColor={onUpdateCanvasBackgroundColor}
        />
      </div>
    </aside>
  );
}
