
'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface GenericElementEditorProps {
  element: DesignElement;
  onUpdateElement: (updatedElement: DesignElement) => void;
}

export function GenericElementEditor({ element, onUpdateElement }: GenericElementEditorProps) {
  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateElement({
      ...element,
      position: {
        ...element.position,
        [axis]: numValue,
      },
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateElement({
      ...element,
      size: {
        ...element.size,
        [dimension]: numValue,
      },
    });
  };

  const handleStyleChange = (property: string, value: string | number) => {
    onUpdateElement({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    });
  };


  return (
    <div className="space-y-4 border-t border-border pt-4 mt-4">
       <h4 className="text-sm font-medium text-muted-foreground font-headline">Transform & Layout</h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`element-pos-x-${element.id}`} className="text-xs">X</Label>
          <Input
            id={`element-pos-x-${element.id}`}
            type="number"
            value={element.position.x}
            onChange={(e) => handlePositionChange('x', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
        <div>
          <Label htmlFor={`element-pos-y-${element.id}`} className="text-xs">Y</Label>
          <Input
            id={`element-pos-y-${element.id}`}
            type="number"
            value={element.position.y}
            onChange={(e) => handlePositionChange('y', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`element-size-w-${element.id}`} className="text-xs">Width</Label>
          <Input
            id={`element-size-w-${element.id}`}
            type="number"
            value={element.size.width}
            onChange={(e) => handleSizeChange('width', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
        <div>
          <Label htmlFor={`element-size-h-${element.id}`} className="text-xs">Height</Label>
          <Input
            id={`element-size-h-${element.id}`}
            type="number"
            value={element.size.height}
            onChange={(e) => handleSizeChange('height', e.target.value)}
            className="mt-1 h-8"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`element-rotation-${element.id}`} className="text-xs">Rotation (°)</Label>
          <Input
            id={`element-rotation-${element.id}`}
            type="number"
            value={element.style?.rotation || 0}
            onChange={(e) => handleStyleChange('rotation', parseFloat(e.target.value) || 0)}
            className="mt-1 h-8"
          />
        </div>
        <div>
          <Label htmlFor={`element-zindex-${element.id}`} className="text-xs">Z-Index</Label>
          <Input
            id={`element-zindex-${element.id}`}
            type="number"
            value={element.style?.zIndex || 0}
            onChange={(e) => handleStyleChange('zIndex', parseInt(e.target.value) || 0)}
            className="mt-1 h-8"
          />
        </div>
      </div>
    </div>
  );
}
