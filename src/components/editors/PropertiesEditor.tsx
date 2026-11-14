'use client';

import type { DesignElement } from '@/types/blueprint';
import { TextEditor } from './TextEditor';
import { ImageEditor } from './ImageEditor';
import { ShapeEditor } from './ShapeEditor';
import { GenericElementEditor } from './GenericElementEditor';
import { CanvasPropertiesEditor } from './CanvasPropertiesEditor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Settings2,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  FolderPlus,
  FolderMinus,
  Folder,
} from 'lucide-react';

interface PropertiesEditorProps {
  selectedElement: DesignElement | null;
  selectedElements?: DesignElement[];
  onUpdateElement: (updatedElement: DesignElement) => void;
  onBatchUpdateElements?: (updatedElements: DesignElement[]) => void;
  onDeleteElement?: (elementId: string) => void;
  onDeleteElements?: (elementIds: string[]) => void;
  onDuplicateElement?: (elementId: string) => void;
  onDuplicateElements?: (elementIds: string[]) => void;
  onGroupElements?: () => void;
  onUngroupElements?: () => void;
  canvasBackgroundColor?: string;
  onUpdateCanvasBackgroundColor: (color: string) => void;
}

export function PropertiesEditor({
  selectedElement,
  selectedElements = [],
  onUpdateElement,
  onBatchUpdateElements,
  onDeleteElement,
  onDeleteElements,
  onDuplicateElement,
  onDuplicateElements,
  onGroupElements,
  onUngroupElements,
  canvasBackgroundColor,
  onUpdateCanvasBackgroundColor,
}: PropertiesEditorProps) {
  // 1. Multi-Selection & Grouping Inspector View
  if (selectedElements.length > 1) {
    const selectedIds = selectedElements.map((el) => el.id);
    const hasGrouped = selectedElements.some((el) => Boolean(el.groupId));
    const uniqueGroups = new Set(selectedElements.map((el) => el.groupId).filter(Boolean));
    const allInSameGroup = uniqueGroups.size === 1 && selectedElements.every((el) => Boolean(el.groupId));

    const minX = Math.min(...selectedElements.map((el) => el.position.x));
    const minY = Math.min(...selectedElements.map((el) => el.position.y));
    const maxX = Math.max(...selectedElements.map((el) => el.position.x + el.size.width));
    const maxY = Math.max(...selectedElements.map((el) => el.position.y + el.size.height));
    const bboxWidth = maxX - minX;
    const bboxHeight = maxY - minY;

    const avgOpacity =
      selectedElements.reduce((acc, el) => acc + (typeof el.style?.opacity === 'number' ? el.style.opacity : 1), 0) /
      selectedElements.length;

    const alignBatch = (mode: 'left' | 'centerX' | 'right' | 'top' | 'centerY' | 'bottom' | 'canvasCenterX') => {
      if (!onBatchUpdateElements) return;
      const updated = selectedElements.map((el) => {
        let nextX = el.position.x;
        let nextY = el.position.y;
        switch (mode) {
          case 'left':
            nextX = minX;
            break;
          case 'centerX':
            nextX = Math.round(minX + (bboxWidth - el.size.width) / 2);
            break;
          case 'right':
            nextX = Math.round(maxX - el.size.width);
            break;
          case 'top':
            nextY = minY;
            break;
          case 'centerY':
            nextY = Math.round(minY + (bboxHeight - el.size.height) / 2);
            break;
          case 'bottom':
            nextY = Math.round(maxY - el.size.height);
            break;
          case 'canvasCenterX': {
            const offset = Math.round((1000 - bboxWidth) / 2) - minX;
            nextX = el.position.x + offset;
            break;
          }
        }
        return { ...el, position: { x: nextX, y: nextY } };
      });
      onBatchUpdateElements(updated);
    };

    const handleBatchOpacity = (val: number) => {
      if (!onBatchUpdateElements) return;
      onBatchUpdateElements(
        selectedElements.map((el) => ({
          ...el,
          style: { ...el.style, opacity: val },
        }))
      );
    };

    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Folder className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-headline text-foreground">
                  {allInSameGroup ? 'Grouped Elements' : `${selectedElements.length} Elements Selected`}
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  {Math.round(bboxWidth)} × {Math.round(bboxHeight)} px bounding box
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Duplicate Selected (Ctrl+D)"
                onClick={() => onDuplicateElements?.(selectedIds)}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                title="Delete Selected"
                onClick={() => onDeleteElements?.(selectedIds)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Group / Ungroup Controls */}
          <div className="p-3 rounded-xl border bg-primary/5 border-primary/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Element Grouping</span>
              <span className="text-[10px] font-mono text-muted-foreground">Ctrl+G</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={allInSameGroup ? 'outline' : 'default'}
                size="sm"
                onClick={onGroupElements}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>{allInSameGroup ? 'Regroup' : 'Group'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasGrouped}
                onClick={onUngroupElements}
                className="h-8 text-xs font-semibold gap-1.5 text-amber-600 border-amber-300/80 hover:bg-amber-50 disabled:opacity-40"
              >
                <FolderMinus className="h-3.5 w-3.5" />
                <span>Ungroup</span>
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Grouped elements move and select together as a single component unit.
            </p>
          </div>

          {/* Batch Alignment */}
          <div className="space-y-2 p-2.5 bg-muted/30 rounded-lg border text-xs">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Align Selection
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <Button variant="outline" size="sm" onClick={() => alignBatch('left')} className="h-7 text-[10px]">
                Left
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignBatch('centerX')} className="h-7 text-[10px] font-bold text-primary">
                Center X
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignBatch('right')} className="h-7 text-[10px]">
                Right
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignBatch('top')} className="h-7 text-[10px]">
                Top
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignBatch('centerY')} className="h-7 text-[10px] font-bold text-primary">
                Center Y
              </Button>
              <Button variant="outline" size="sm" onClick={() => alignBatch('bottom')} className="h-7 text-[10px]">
                Bottom
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignBatch('canvasCenterX')}
              className="w-full h-7 text-[11px] font-semibold mt-1"
            >
              Center Selection on Canvas
            </Button>
          </div>

          {/* Batch Opacity */}
          <div className="space-y-2 p-2.5 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Group Opacity</Label>
              <span className="text-xs font-mono text-muted-foreground">{Math.round(avgOpacity * 100)}%</span>
            </div>
            <Slider
              value={[Math.round(avgOpacity * 100)]}
              min={10}
              max={100}
              step={5}
              onValueChange={([v]) => handleBatchOpacity(v / 100)}
            />
          </div>
        </div>
      </ScrollArea>
    );
  }

  // 2. No Element Selected -> Canvas Properties
  if (!selectedElement) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="p-6 h-full flex flex-col items-center justify-center text-center text-muted-foreground mb-4">
            <Settings2 className="w-12 h-12 mb-4 text-muted-foreground/60" />
            <h3 className="text-base font-semibold font-headline text-foreground">Canvas Properties</h3>
            <p className="text-xs mt-1 text-muted-foreground">
              Select any element to customize it, or drag across multiple items to select and group them together.
            </p>
          </div>
          <CanvasPropertiesEditor
            backgroundColor={canvasBackgroundColor}
            onUpdateBackgroundColor={onUpdateCanvasBackgroundColor}
          />
        </div>
      </ScrollArea>
    );
  }

  const handleCenterH = () => {
    onUpdateElement({
      ...selectedElement,
      position: {
        ...selectedElement.position,
        x: Math.round((1000 - selectedElement.size.width) / 2),
      },
    });
  };

  const handleCenterV = () => {
    onUpdateElement({
      ...selectedElement,
      position: {
        ...selectedElement.position,
        y: Math.round((1000 - selectedElement.size.height) / 2),
      },
    });
  };

  const handleLayerOrder = (direction: 'up' | 'down') => {
    const currentZ = Number(selectedElement.style?.zIndex) || 1;
    const newZ = direction === 'up' ? currentZ + 1 : Math.max(0, currentZ - 1);
    onUpdateElement({
      ...selectedElement,
      style: {
        ...selectedElement.style,
        zIndex: newZ,
      },
    });
  };

  const renderEditor = () => {
    switch (selectedElement.type) {
      case 'text':
        return (
          <TextEditor
            element={selectedElement as DesignElement & { type: 'text' }}
            onUpdateElement={onUpdateElement}
          />
        );
      case 'image':
        return (
          <ImageEditor
            element={selectedElement as DesignElement & { type: 'image' }}
            onUpdateElement={onUpdateElement}
          />
        );
      case 'shape':
        return (
          <ShapeEditor
            element={selectedElement as DesignElement & { type: 'shape' }}
            onUpdateElement={onUpdateElement}
          />
        );
      default:
        return <p className="text-sm text-muted-foreground">No specific editor for type: {selectedElement.type}</p>;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Header with Quick Actions */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-sm font-bold font-headline capitalize text-foreground">
              {selectedElement.type} Element
            </h3>
            <p className="text-[10px] text-muted-foreground">Layer Z: {selectedElement.style?.zIndex ?? 1}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Duplicate (Copy)"
              onClick={() => onDuplicateElement?.(selectedElement.id)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:bg-destructive/10"
              title="Delete element"
              onClick={() => onDeleteElement?.(selectedElement.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Group Membership Card if single item belongs to a group */}
        {selectedElement.groupId && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-blue-700 dark:text-blue-300">
              <Folder className="h-3.5 w-3.5" />
              <span>Part of Group</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onUngroupElements}
              className="h-6 px-2 text-[10px] font-bold text-amber-700 border-amber-300 bg-white hover:bg-amber-50"
            >
              <FolderMinus className="h-3 w-3 mr-1" />
              Ungroup
            </Button>
          </div>
        )}

        {/* Canva-Style Position & Alignment Controls */}
        <div className="space-y-1.5 p-2 bg-muted/30 rounded-lg border text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Canvas Alignment</span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateElement({ ...selectedElement, position: { ...selectedElement.position, x: 50 } })}
              title="Align Left (margin 50px)"
              className="h-7 px-1 text-[10px]"
            >
              Left
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCenterH}
              title="Center Horizontally"
              className="h-7 px-1 text-[10px] font-bold text-primary"
            >
              Center X
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onUpdateElement({
                  ...selectedElement,
                  position: { ...selectedElement.position, x: Math.max(0, 1000 - selectedElement.size.width - 50) },
                })
              }
              title="Align Right (margin 50px)"
              className="h-7 px-1 text-[10px]"
            >
              Right
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateElement({ ...selectedElement, position: { ...selectedElement.position, y: 50 } })}
              title="Align Top (margin 50px)"
              className="h-7 px-1 text-[10px]"
            >
              Top
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCenterV}
              title="Center Vertically"
              className="h-7 px-1 text-[10px] font-bold text-primary"
            >
              Center Y
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onUpdateElement({
                  ...selectedElement,
                  position: { ...selectedElement.position, y: Math.max(0, 1000 - selectedElement.size.height - 50) },
                })
              }
              title="Align Bottom (margin 50px)"
              className="h-7 px-1 text-[10px]"
            >
              Bottom
            </Button>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider pt-1.5 border-t">
            <span>Layer Order</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLayerOrder('up')}
              title="Bring Forward (+1)"
              className="h-7 px-1 text-[10px]"
            >
              <ArrowUp className="h-3 w-3 mr-0.5" /> Forward
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLayerOrder('down')}
              title="Send Backward (-1)"
              className="h-7 px-1 text-[10px]"
            >
              <ArrowDown className="h-3 w-3 mr-0.5" /> Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentZ = Number(selectedElement.style?.zIndex) || 1;
                onUpdateElement({
                  ...selectedElement,
                  style: { ...selectedElement.style, zIndex: Math.max(10, currentZ + 5) },
                });
              }}
              title="Bring to Front"
              className="h-7 px-1 text-[10px]"
            >
              To Front
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onUpdateElement({
                  ...selectedElement,
                  style: { ...selectedElement.style, zIndex: 1 },
                });
              }}
              title="Send to Back"
              className="h-7 px-1 text-[10px]"
            >
              To Back
            </Button>
          </div>
        </div>

        {renderEditor()}

        <GenericElementEditor element={selectedElement} onUpdateElement={onUpdateElement} />
      </div>
    </ScrollArea>
  );
}
