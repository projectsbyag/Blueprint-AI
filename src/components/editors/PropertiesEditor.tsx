'use client';

import type { DesignElement } from '@/types/blueprint';
import { TextEditor } from './TextEditor';
import { ImageEditor } from './ImageEditor';
import { ShapeEditor } from './ShapeEditor';
import { GenericElementEditor } from './GenericElementEditor';
import { CanvasPropertiesEditor } from './CanvasPropertiesEditor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Settings2, Trash2, Copy, AlignCenter, ArrowUp, ArrowDown } from 'lucide-react';

interface PropertiesEditorProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (updatedElement: DesignElement) => void;
  onDeleteElement?: (elementId: string) => void;
  onDuplicateElement?: (elementId: string) => void;
  canvasBackgroundColor?: string;
  onUpdateCanvasBackgroundColor: (color: string) => void;
}

export function PropertiesEditor({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  canvasBackgroundColor,
  onUpdateCanvasBackgroundColor,
}: PropertiesEditorProps) {
  if (!selectedElement) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="p-6 h-full flex flex-col items-center justify-center text-center text-muted-foreground mb-4">
            <Settings2 className="w-12 h-12 mb-4 text-muted-foreground/60" />
            <h3 className="text-base font-semibold font-headline text-foreground">Canvas Properties</h3>
            <p className="text-xs mt-1 text-muted-foreground">
              Select any element on the canvas to customize text, colors, imagery, and positioning.
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

        {/* Quick alignment & layer shortcuts */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-muted/40 rounded border text-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCenterH}
            title="Center Horizontally"
            className="h-7 px-1 text-[11px]"
          >
            <AlignCenter className="h-3 w-3 mr-1" />
            Center X
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCenterV}
            title="Center Vertically"
            className="h-7 px-1 text-[11px]"
          >
            <AlignCenter className="h-3 w-3 mr-1 rotate-90" />
            Center Y
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLayerOrder('up')}
            title="Bring Forward"
            className="h-7 px-1 text-[11px]"
          >
            <ArrowUp className="h-3 w-3 mr-1" />
            Forward
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLayerOrder('down')}
            title="Send Backward"
            className="h-7 px-1 text-[11px]"
          >
            <ArrowDown className="h-3 w-3 mr-1" />
            Back
          </Button>
        </div>

        {renderEditor()}

        <GenericElementEditor element={selectedElement} onUpdateElement={onUpdateElement} />
      </div>
    </ScrollArea>
  );
}
