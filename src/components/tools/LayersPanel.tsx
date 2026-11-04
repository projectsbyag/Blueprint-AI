'use client';

import type { DesignLayout, DesignElement } from '@/types/blueprint';
import { Type, Square, Image as ImageIcon, Layers, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayersPanelProps {
  currentDesign: DesignLayout | null;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (element: DesignElement) => void;
  onDeleteElement: (id: string) => void;
}

export function LayersPanel({
  currentDesign,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
}: LayersPanelProps) {
  if (!currentDesign || currentDesign.elements.length === 0) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center text-muted-foreground">
        <Layers className="w-12 h-12 mb-3 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">No Layers Yet</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          Add elements or load an AI design to inspect and rearrange layers.
        </p>
      </div>
    );
  }

  // Sort by zIndex descending (top-most layer on top of list)
  const sortedElements = [...currentDesign.elements].sort(
    (a, b) => (Number(b.style?.zIndex) || 1) - (Number(a.style?.zIndex) || 1)
  );

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="h-4 w-4 text-blue-500" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-emerald-500" />;
      case 'shape':
        return <Square className="h-4 w-4 text-amber-500" />;
      default:
        return <Layers className="h-4 w-4 text-purple-500" />;
    }
  };

  const getElementLabel = (el: DesignElement) => {
    if (el.type === 'text') return el.content || 'Text Element';
    if (el.type === 'image') return el.content || 'Image Layer';
    if (el.type === 'shape') {
      const isCircle = el.style?.borderRadius === '9999px';
      return isCircle ? 'Circle Accent' : 'Card / Shape';
    }
    return el.type;
  };

  const handleMoveZ = (el: DesignElement, delta: number) => {
    const curZ = Number(el.style?.zIndex) || 1;
    onUpdateElement({
      ...el,
      style: {
        ...el.style,
        zIndex: Math.max(0, curZ + delta),
      },
    });
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between pb-1 border-b">
        <div>
          <h2 className="text-sm font-bold font-headline">Canvas Layers</h2>
          <p className="text-[11px] text-muted-foreground">{currentDesign.elements.length} components total</p>
        </div>
      </div>

      <div className="space-y-1.5 overflow-y-auto flex-1 min-h-0 pr-1">
        {sortedElements.map((el) => {
          const isSelected = el.id === selectedElementId;
          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary font-medium text-foreground shadow-sm'
                  : 'bg-muted/30 border-border hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                <div className="p-1 rounded bg-background border shrink-0">
                  {getElementIcon(el.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-foreground font-medium">{getElementLabel(el)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Z: {el.style?.zIndex ?? 1} • {Math.round(el.size.width)}×{Math.round(el.size.height)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  title="Move Up"
                  onClick={() => handleMoveZ(el, 1)}
                >
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  title="Move Down"
                  onClick={() => handleMoveZ(el, -1)}
                >
                  <ArrowDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:bg-destructive/10"
                  title="Delete Layer"
                  onClick={() => onDeleteElement(el.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
