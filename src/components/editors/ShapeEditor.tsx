'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { PresetColorPicker } from '@/components/ui/preset-color-picker';

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
    <div className="space-y-4 select-none">
      <PresetColorPicker
        id={`shape-bgcolor-${element.id}`}
        label="Background Color"
        value={(element.style?.backgroundColor as string) || '#E2E8F0'}
        onChange={(val) => handleStyleChange('backgroundColor', val)}
      />

      <PresetColorPicker
        id={`shape-bordercolor-${element.id}`}
        label="Border Color"
        value={(element.style?.borderColor as string) || '#94A3B8'}
        onChange={(val) => handleStyleChange('borderColor', val)}
      />

      <div>
        <Label htmlFor={`shape-borderwidth-${element.id}`} className="text-xs font-semibold text-foreground">
          Border Width (px)
        </Label>
        <Input
          id={`shape-borderwidth-${element.id}`}
          type="number"
          min="0"
          value={element.style?.borderWidth ? parseFloat(element.style.borderWidth as string) : 0}
          onChange={(e) => handleStyleChange('borderWidth', e.target.value ? `${e.target.value}px` : '0px')}
          className="mt-1 h-8 text-xs"
        />
      </div>

      <div>
        <Label htmlFor={`shape-borderradius-${element.id}`} className="text-xs font-semibold text-foreground">
          Border Radius
        </Label>
        <Input
          id={`shape-borderradius-${element.id}`}
          type="text"
          value={(element.style?.borderRadius as string) || '0px'}
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          className="mt-1 h-8 text-xs"
          placeholder="e.g. 12px or 9999px (circle)"
        />
      </div>

      <div>
        <Label htmlFor={`shape-opacity-${element.id}`} className="text-xs font-semibold text-foreground">
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
