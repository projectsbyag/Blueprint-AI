'use client';

import type { DesignLayout, DesignElement } from '@/types/blueprint';
import {
  Type,
  Square,
  Image as ImageIcon,
  Layers,
  Trash2,
  ArrowUp,
  ArrowDown,
  Folder,
  FolderPlus,
  FolderMinus,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayersPanelProps {
  currentDesign: DesignLayout | null;
  selectedElementId: string | null;
  selectedElementIds?: string[];
  onSelectElement: (id: string | null) => void;
  onSelectElements?: (ids: string[]) => void;
  onToggleSelectElement?: (id: string) => void;
  onGroupElements?: () => void;
  onUngroupElements?: () => void;
  onUpdateElement: (element: DesignElement) => void;
  onDeleteElement: (id: string) => void;
}

export function LayersPanel({
  currentDesign,
  selectedElementId,
  selectedElementIds = [],
  onSelectElement,
  onSelectElements,
  onToggleSelectElement,
  onGroupElements,
  onUngroupElements,
  onUpdateElement,
  onDeleteElement,
}: LayersPanelProps) {
  if (!currentDesign || currentDesign.elements.length === 0) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center text-muted-foreground">
        <Layers className="w-12 h-12 mb-3 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">No Layers Yet</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          Add elements or load a template to inspect, group, and rearrange layers.
        </p>
      </div>
    );
  }

  // Effective multi-selection IDs list
  const effectiveSelectedIds =
    selectedElementIds.length > 0
      ? selectedElementIds
      : selectedElementId
      ? [selectedElementId]
      : [];

  const selectedElements = currentDesign.elements.filter((el) => effectiveSelectedIds.includes(el.id));
  const hasGroupedSelection = selectedElements.some((el) => Boolean(el.groupId));
  const canGroupSelection = selectedElements.length >= 2;

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
      return isCircle ? 'Circle Accent' : el.style?.shapeType || 'Card / Shape';
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

  const handleLayerClick = (e: React.MouseEvent, el: DesignElement) => {
    if (e.shiftKey) {
      onToggleSelectElement?.(el.id);
    } else if (el.groupId) {
      const groupMembers = currentDesign.elements.filter((item) => item.groupId === el.groupId).map((item) => item.id);
      if (onSelectElements) {
        onSelectElements(groupMembers);
      } else {
        onSelectElement(el.id);
      }
    } else {
      if (onSelectElements) {
        onSelectElements([el.id]);
      } else {
        onSelectElement(el.id);
      }
    }
  };

  const handleCheckboxToggle = (e: React.MouseEvent, el: DesignElement) => {
    e.stopPropagation();
    if (onToggleSelectElement) {
      onToggleSelectElement(el.id);
    } else if (onSelectElements) {
      const exists = effectiveSelectedIds.includes(el.id);
      onSelectElements(
        exists ? effectiveSelectedIds.filter((id) => id !== el.id) : [...effectiveSelectedIds, el.id]
      );
    }
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h2 className="text-sm font-bold font-headline">Canvas Layers</h2>
          <p className="text-[11px] text-muted-foreground">
            {effectiveSelectedIds.length > 1
              ? `${effectiveSelectedIds.length} layers selected`
              : `${currentDesign.elements.length} components total`}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {effectiveSelectedIds.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              onClick={() => {
                onSelectElements?.([]);
                onSelectElement(null);
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Group / Ungroup Action Bar */}
      <div className="space-y-1.5 p-1.5 rounded-lg bg-muted/40 border">
        <div className="flex items-center gap-1.5">
          <Button
            variant={canGroupSelection ? 'default' : 'outline'}
            size="sm"
            disabled={!canGroupSelection || !onGroupElements}
            onClick={onGroupElements}
            className="flex-1 h-7 text-[11px] font-semibold gap-1"
            title="Select 2+ layers using Shift+Click, marquee, or checkboxes, then press Ctrl+G to group"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Group {canGroupSelection ? `(${selectedElements.length})` : ''}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasGroupedSelection || !onUngroupElements}
            onClick={onUngroupElements}
            className="h-7 px-2.5 text-[11px] font-semibold gap-1 text-amber-600 border-amber-300/80 hover:bg-amber-50 disabled:opacity-40"
            title="Ungroup selected elements (Ctrl+Shift+G)"
          >
            <FolderMinus className="h-3.5 w-3.5" />
            <span>Ungroup</span>
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground px-0.5 leading-tight">
          Shift + Click elements to multi-select, then press <kbd className="px-1 py-0.2 rounded bg-background border text-[9px] font-mono">Ctrl+G</kbd> to group.
        </p>
      </div>

      <div className="space-y-1.5 overflow-y-auto flex-1 min-h-0 pr-1">
        {sortedElements.map((el) => {
          const isSelected = effectiveSelectedIds.includes(el.id);
          return (
            <div
              key={el.id}
              onClick={(e) => handleLayerClick(e, el)}
              className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary font-medium text-foreground shadow-sm'
                  : 'bg-muted/30 border-border hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                {/* Multi-select Checkbox */}
                <button
                  type="button"
                  onClick={(e) => handleCheckboxToggle(e, el)}
                  className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border hover:border-primary'
                  }`}
                  title="Select / deselect for grouping"
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </button>

                <div className="p-1 rounded bg-background border shrink-0">
                  {getElementIcon(el.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs text-foreground font-medium">{getElementLabel(el)}</p>
                    {el.groupId && (
                      <span
                        title={`Group ID: ${el.groupId}`}
                        className="shrink-0 flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800"
                      >
                        <Folder className="h-2.5 w-2.5" />
                        GRP
                      </span>
                    )}
                  </div>
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
