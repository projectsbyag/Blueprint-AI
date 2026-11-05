'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PresetColorPicker } from '@/components/ui/preset-color-picker';
import {
  Lock,
  Unlock,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShapeEditorProps {
  element: DesignElement & { type: 'shape' };
  onUpdateElement: (updatedElement: DesignElement) => void;
}

const SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Soft', value: '0 10px 25px -5px rgba(0,0,0,0.1)' },
  { label: 'Elevated', value: '0 20px 25px -5px rgba(0,0,0,0.25)' },
  { label: 'Neon Glow', value: '0 0 25px rgba(59,130,246,0.5)' },
  { label: 'Retro Hard', value: '5px 5px 0px #0F172A' },
  { label: 'Dramatic', value: '0 25px 50px -12px rgba(0,0,0,0.5)' },
];

const RADIUS_PRESETS = [
  { label: 'Sharp (0px)', value: '0px' },
  { label: 'Soft (8px)', value: '8px' },
  { label: 'Card (20px)', value: '20px' },
  { label: 'Pill (9999px)', value: '9999px' },
];

export function ShapeEditor({ element, onUpdateElement }: ShapeEditorProps) {
  const { toast } = useToast();

  // Decompose any legacy shorthand border so individual controls read correctly
  let initialBorderWidth = element.style?.borderWidth as string | undefined;
  let initialBorderStyle = element.style?.borderStyle as string | undefined;
  let initialBorderColor = element.style?.borderColor as string | undefined;

  if (element.style?.border && typeof element.style.border === 'string') {
    const parts = element.style.border.trim().split(/\s+/);
    if (!initialBorderWidth && parts[0]) initialBorderWidth = parts[0];
    if (!initialBorderStyle && parts[1]) initialBorderStyle = parts[1];
    if (!initialBorderColor && parts.length >= 3) initialBorderColor = parts.slice(2).join(' ');
  }

  const borderWidthNum = initialBorderWidth ? parseFloat(initialBorderWidth) : 0;
  const currentBorderStyle = initialBorderStyle || (borderWidthNum > 0 ? 'solid' : 'none');
  const currentBorderColor = initialBorderColor || '#94A3B8';

  const handleStyleChange = (property: string, value: any) => {
    const nextStyle: any = {
      ...element.style,
      [property]: value,
    };

    // If updating border properties, eliminate legacy shorthand border
    if (property === 'borderWidth' || property === 'borderStyle' || property === 'borderColor') {
      delete nextStyle.border;
      if (!nextStyle.borderStyle) nextStyle.borderStyle = currentBorderStyle;
      if (!nextStyle.borderColor) nextStyle.borderColor = currentBorderColor;
      if (!nextStyle.borderWidth) nextStyle.borderWidth = `${borderWidthNum}px`;
    }

    onUpdateElement({
      ...element,
      style: nextStyle,
    });
  };

  const isLocked = Boolean(element.style?.locked);
  const currentShadow = element.style?.boxShadow || 'none';
  const currentRotation = Number(element.style?.rotation) || 0;

  return (
    <div className="space-y-4 select-none">
      {/* Lock / Unlock & Flip Quick Bar */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant={isLocked ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => {
              const nextLocked = !isLocked;
              handleStyleChange('locked', nextLocked);
              toast({
                title: nextLocked ? 'Element Locked' : 'Element Unlocked',
                description: nextLocked ? 'Cannot be moved or resized on canvas' : 'Free to edit',
              });
            }}
            className="h-7 px-2 text-xs gap-1"
          >
            {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            <span>{isLocked ? 'Locked' : 'Lock'}</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={element.style?.flipX ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => handleStyleChange('flipX', !element.style?.flipX)}
            className="h-7 w-7"
            title="Flip Horizontally"
          >
            <FlipHorizontal className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant={element.style?.flipY ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => handleStyleChange('flipY', !element.style?.flipY)}
            className="h-7 w-7"
            title="Flip Vertically"
          >
            <FlipVertical className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Fill Color */}
      <PresetColorPicker
        id={`shape-bgcolor-${element.id}`}
        label="Fill / Background Color"
        value={(element.style?.backgroundColor as string) || '#3B82F6'}
        onChange={(val) => handleStyleChange('backgroundColor', val)}
      />

      {/* Border Configuration Section */}
      <div className="space-y-2.5 border-t pt-3">
        <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-3 w-3 text-primary" /> Border & Stroke
        </Label>

        {/* Border Style Dropdown */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`shape-borderstyle-${element.id}`} className="text-[11px] text-muted-foreground">
              Style
            </Label>
            <Select
              value={currentBorderStyle}
              onValueChange={(val) => {
                handleStyleChange('borderStyle', val);
                if (val !== 'none' && borderWidthNum === 0) {
                  handleStyleChange('borderWidth', '2px');
                }
              }}
            >
              <SelectTrigger id={`shape-borderstyle-${element.id}`} className="mt-1 h-8 text-xs">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-xs">None</SelectItem>
                <SelectItem value="solid" className="text-xs">Solid</SelectItem>
                <SelectItem value="dashed" className="text-xs">Dashed</SelectItem>
                <SelectItem value="dotted" className="text-xs">Dotted</SelectItem>
                <SelectItem value="double" className="text-xs">Double</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`shape-borderwidth-${element.id}`} className="text-[11px] text-muted-foreground">
              Width ({borderWidthNum}px)
            </Label>
            <Input
              id={`shape-borderwidth-${element.id}`}
              type="number"
              min="0"
              max="40"
              value={borderWidthNum}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                handleStyleChange('borderWidth', `${val}px`);
                if (val > 0 && (!element.style?.borderStyle || element.style.borderStyle === 'none')) {
                  handleStyleChange('borderStyle', 'solid');
                }
              }}
              className="mt-1 h-8 text-xs"
            />
          </div>
        </div>

        {/* Border Width Slider */}
        <Slider
          min={0}
          max={30}
          step={1}
          value={[borderWidthNum]}
          onValueChange={(v) => {
            handleStyleChange('borderWidth', `${v[0]}px`);
            if (v[0] > 0 && (!element.style?.borderStyle || element.style.borderStyle === 'none')) {
              handleStyleChange('borderStyle', 'solid');
            }
          }}
          className="mt-1.5"
        />

        {/* Border Color */}
        <PresetColorPicker
          id={`shape-bordercolor-${element.id}`}
          label="Border Color"
          value={currentBorderColor}
          onChange={(val) => handleStyleChange('borderColor', val)}
        />
      </div>

      {/* Corner Radius Controls */}
      <div className="space-y-2 border-t pt-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground">Corner Radius</Label>
          <span className="text-[11px] text-muted-foreground font-mono">
            {element.style?.borderRadius || '0px'}
          </span>
        </div>

        {/* Quick Radius Buttons */}
        <div className="grid grid-cols-4 gap-1">
          {RADIUS_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleStyleChange('borderRadius', preset.value)}
              className={`px-1.5 py-1 text-[10px] rounded border transition-colors ${
                element.style?.borderRadius === preset.value
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {preset.label.split(' ')[0]}
            </button>
          ))}
        </div>

        <Input
          type="text"
          value={(element.style?.borderRadius as string) || '0px'}
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          placeholder="e.g. 16px or 9999px"
          className="h-8 text-xs"
        />
      </div>

      {/* Shadow Effects (Canva-style) */}
      <div className="space-y-2 border-t pt-3">
        <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-amber-500" /> Shadow Effects
        </Label>
        <div className="grid grid-cols-3 gap-1.5">
          {SHADOW_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleStyleChange('boxShadow', preset.value)}
              className={`p-1.5 text-[11px] rounded border transition-all text-center truncate ${
                currentShadow === preset.value
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rotation & Angle (Canva-style) */}
      <div className="space-y-2 border-t pt-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <RotateCw className="h-3 w-3 text-primary" /> Rotation ({currentRotation}°)
          </Label>
          <div className="flex gap-1">
            {[0, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => handleStyleChange('rotation', deg)}
                className={`px-1.5 py-0.5 text-[10px] rounded border ${
                  currentRotation === deg
                    ? 'border-primary bg-primary/10 text-primary font-bold'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>

        <Slider
          min={-180}
          max={180}
          step={1}
          value={[currentRotation]}
          onValueChange={(val) => handleStyleChange('rotation', val[0])}
          className="mt-1"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-2 border-t pt-3">
        <div className="flex items-center justify-between">
          <Label htmlFor={`shape-opacity-${element.id}`} className="text-xs font-semibold text-foreground">
            Transparency / Opacity
          </Label>
          <span className="text-[11px] font-mono text-muted-foreground">
            {typeof element.style?.opacity === 'number' ? Math.round(element.style.opacity * 100) : 100}%
          </span>
        </div>
        <Slider
          id={`shape-opacity-${element.id}`}
          min={0}
          max={1}
          step={0.01}
          value={[typeof element.style?.opacity === 'number' ? element.style.opacity : 1]}
          onValueChange={(value) => handleStyleChange('opacity', value[0])}
          className="mt-1"
        />
      </div>
    </div>
  );
}
