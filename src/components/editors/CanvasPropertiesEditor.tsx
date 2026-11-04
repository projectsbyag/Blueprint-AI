'use client';

import { SquareAsterisk } from 'lucide-react';
import { PresetColorPicker } from '@/components/ui/preset-color-picker';

interface CanvasPropertiesEditorProps {
  backgroundColor?: string;
  onUpdateBackgroundColor: (color: string) => void;
}

export function CanvasPropertiesEditor({ backgroundColor, onUpdateBackgroundColor }: CanvasPropertiesEditorProps) {
  const currentColor = backgroundColor || '#FFFFFF';

  return (
    <div className="space-y-4 border-t border-border pt-4 mt-4 select-none">
      <div className="flex items-center space-x-2">
        <SquareAsterisk className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold font-headline">Canvas Properties</h4>
      </div>

      <PresetColorPicker
        id="canvas-bgcolor"
        label="Canvas Background Color"
        value={currentColor}
        onChange={onUpdateBackgroundColor}
      />
    </div>
  );
}
