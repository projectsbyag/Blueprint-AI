
'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface ShapeEditorProps {
  element: DesignElement & { type: 'shape' };
  onUpdateElement: (updatedElement: DesignElement) => void;
}

export function ShapeEditor({ element, onUpdateElement }: ShapeEditorProps) {
  const handleStyleChange = (property: string, value: string | number | undefined) => {
    onUpdateElement({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`shape-bgcolor-${element.id}`} className="text-sm font-medium">Background Color</Label>
        <Input
          id={`shape-bgcolor-${element.id}`}
          type="color"
          value={(element.style?.backgroundColor as string) || '#cccccc'}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          className="mt-1 h-10 p-1 w-full"
        />
      </div>
      <div>
        <Label htmlFor={`shape-bordercolor-${element.id}`} className="text-sm font-medium">Border Color</Label>
        <Input
          id={`shape-bordercolor-${element.id}`}
          type="color"
          value={(element.style?.borderColor as string) || '#333333'}
          onChange={(e) => handleStyleChange('borderColor', e.target.value)}
          className="mt-1 h-10 p-1 w-full"
        />
      </div>
       <div>
        <Label htmlFor={`shape-borderwidth-${element.id}`} className="text-sm font-medium">Border Width (px)</Label>
        <Input
          id={`shape-borderwidth-${element.id}`}
          type="number"
          min="0"
          value={element.style?.borderWidth ? parseFloat(element.style.borderWidth as string) : 0}
          onChange={(e) => handleStyleChange('borderWidth', e.target.value ? `${e.target.value}px` : '0px')}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={`shape-borderradius-${element.id}`} className="text-sm font-medium">Border Radius</Label>
        <Input
          id={`shape-borderradius-${element.id}`}
          type="text"
          value={(element.style?.borderRadius as string) || '0px'}
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          className="mt-1"
          placeholder="e.g., 10px or 50%"
        />
      </div>
      <div>
        <Label htmlFor={`shape-opacity-${element.id}`} className="text-sm font-medium">
          Opacity: {typeof element.style?.opacity === 'number' ? Math.round(element.style.opacity * 100) : 100}%
        </Label>
        <Slider
          id={`shape-opacity-${element.id}`}
          min={0}
          max={1}
          step={0.01}
          value={[typeof element.style?.opacity === 'number' ? element.style.opacity : 1]}
          onValueChange={(value) => handleStyleChange('opacity', value[0])}
          className="mt-2"
        />
      </div>
    </div>
  );
}
