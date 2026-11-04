
'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SquareAsterisk } from 'lucide-react';

interface CanvasPropertiesEditorProps {
  backgroundColor?: string;
  onUpdateBackgroundColor: (color: string) => void;
}

const DEFAULT_CANVAS_COLOR = 'hsl(var(--card))'; // from globals.css via tailwind bg-card

export function CanvasPropertiesEditor({ backgroundColor, onUpdateBackgroundColor }: CanvasPropertiesEditorProps) {
  const currentColor = backgroundColor || DEFAULT_CANVAS_COLOR;

  // Helper to convert HSL string to HEX for color input, if needed.
  // For now, assuming the color input handles HSL strings or that we store HEX.
  // The `Input type="color"` typically expects HEX.
  // Let's try to manage this by ensuring we pass HEX to it.
  // This is a simplification; a full HSL to HEX conversion might be needed if HSL is strictly stored.
  // For now, we'll assume the input field handles it or the user enters HEX.
  // A more robust solution might involve a color picker component that handles conversions.

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateBackgroundColor(e.target.value);
  };

  return (
    <div className="space-y-4 border-t border-border pt-4 mt-4">
      <div className="flex items-center space-x-2">
        <SquareAsterisk className="w-5 h-5 text-muted-foreground" />
        <h4 className="text-md font-medium font-headline">Canvas Properties</h4>
      </div>
      
      <div>
        <Label htmlFor="canvas-bgcolor" className="text-sm font-medium">Background Color</Label>
        <Input
          id="canvas-bgcolor"
          type="color"
          value={currentColor.startsWith('hsl') ? '#FFFFFF' : currentColor } // Color input prefers hex. Provide a fallback.
          onChange={handleColorChange}
          className="mt-1 h-10 p-1 w-full"
        />
        {currentColor.startsWith('hsl') && (
            <p className="text-xs text-muted-foreground mt-1">
                Current: {currentColor}. Color picker shows best with HEX.
            </p>
        )}
      </div>
       <p className="text-xs text-muted-foreground text-center">
        More canvas settings (dimensions, grid, etc.) coming soon.
      </p>
    </div>
  );
}
