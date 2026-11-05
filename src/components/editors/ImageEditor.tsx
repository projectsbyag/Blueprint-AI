'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PresetColorPicker } from '@/components/ui/preset-color-picker';
import {
  UploadCloud,
  Sparkles,
  Lock,
  Unlock,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  Layers,
  Wand2,
} from 'lucide-react';
import React, { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ImageEditorProps {
  element: DesignElement & { type: 'image' };
  onUpdateElement: (updatedElement: DesignElement) => void;
}

const STOCK_PHOTOS = [
  { name: 'Tech Stage', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Artisan Bakery', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Specialty Coffee', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Neon Concert', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Modern Fashion', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Atmospheric Glow', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Minimal Architecture', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80' },
  { name: 'Workspace Desk', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80' },
];

const FILTER_PRESETS = [
  { label: 'Normal', value: 'none' },
  { label: 'Grayscale', value: 'grayscale(100%)' },
  { label: 'High Contrast', value: 'contrast(130%) brightness(105%)' },
  { label: 'Vintage Warm', value: 'sepia(40%) contrast(110%)' },
  { label: 'Cool Minimal', value: 'saturate(80%) hue-rotate(15deg)' },
  { label: 'Soft Glow', value: 'brightness(115%) contrast(95%)' },
];

const SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Soft', value: '0 10px 25px -5px rgba(0,0,0,0.15)' },
  { label: 'Elevated', value: '0 20px 25px -5px rgba(0,0,0,0.3)' },
  { label: 'Hard Shadow', value: '6px 6px 0px #0F172A' },
  { label: 'Deep', value: '0 25px 50px -12px rgba(0,0,0,0.5)' },
];

export function ImageEditor({ element, onUpdateElement }: ImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const currentBorderColor = initialBorderColor || '#FFFFFF';

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

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateElement({ ...element, source: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file (e.g., PNG, JPG, GIF, WebP).',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateElement({ ...element, source: reader.result as string });
        toast({
          title: 'Image Uploaded',
          description: `${file.name} loaded to canvas.`,
        });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const isLocked = Boolean(element.style?.locked);
  const currentFilter = element.style?.filter || 'none';
  const currentShadow = element.style?.boxShadow || 'none';
  const currentRotation = Number(element.style?.rotation) || 0;

  return (
    <div className="space-y-4 select-none">
      {/* Lock / Unlock & Flip Quick Bar */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border">
        <Button
          type="button"
          variant={isLocked ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => {
            const nextLocked = !isLocked;
            handleStyleChange('locked', nextLocked);
            toast({
              title: nextLocked ? 'Image Locked' : 'Image Unlocked',
              description: nextLocked ? 'Cannot be moved or resized on canvas' : 'Free to edit',
            });
          }}
          className="h-7 px-2 text-xs gap-1"
        >
          {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          <span>{isLocked ? 'Locked' : 'Lock'}</span>
        </Button>

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

      {/* Image Source & Upload */}
      <div>
        <Label htmlFor={`image-source-${element.id}`} className="text-xs font-semibold">
          Image Source URL
        </Label>
        <Input
          id={`image-source-${element.id}`}
          value={element.source || ''}
          onChange={handleSourceChange}
          placeholder="https://images.unsplash.com/... or upload"
          className="mt-1 h-8 text-xs"
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="w-full text-xs h-8"
      >
        <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
        Upload from Device
      </Button>

      {/* Aspect Ratio & Shape Presets */}
      <div className="border-t pt-3 space-y-2">
        <Label className="text-xs font-semibold text-foreground">Aspect Ratio / Shape Presets</Label>
        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => {
              const side = Math.min(element.size.width, element.size.height);
              onUpdateElement({ ...element, size: { width: side, height: side } });
            }}
            className="p-1.5 text-[10px] rounded border border-border hover:bg-muted text-center"
          >
            1:1 Square
          </button>
          <button
            type="button"
            onClick={() => {
              const w = element.size.width;
              onUpdateElement({ ...element, size: { width: w, height: Math.round((w * 9) / 16) } });
            }}
            className="p-1.5 text-[10px] rounded border border-border hover:bg-muted text-center"
          >
            16:9 Video
          </button>
          <button
            type="button"
            onClick={() => {
              const w = element.size.width;
              onUpdateElement({ ...element, size: { width: w, height: Math.round((w * 4) / 3) } });
            }}
            className="p-1.5 text-[10px] rounded border border-border hover:bg-muted text-center"
          >
            3:4 Portrait
          </button>
          <button
            type="button"
            onClick={() => {
              const side = Math.min(element.size.width, element.size.height);
              onUpdateElement({
                ...element,
                size: { width: side, height: side },
                style: { ...element.style, borderRadius: '9999px' },
              });
            }}
            className="p-1.5 text-[10px] rounded border border-border hover:bg-muted text-center font-bold text-primary"
          >
            Circle Avatar
          </button>
        </div>
      </div>

      {/* Photo Filter Effects (Canva-style) */}
      <div className="space-y-2 border-t pt-3">
        <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Wand2 className="h-3 w-3 text-primary" /> Visual Filters
        </Label>
        <div className="grid grid-cols-3 gap-1.5">
          {FILTER_PRESETS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => handleStyleChange('filter', filter.value)}
              className={`p-1.5 text-[11px] rounded border transition-all text-center truncate ${
                currentFilter === filter.value
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Border & Corner Radius */}
      <div className="space-y-2.5 border-t pt-3">
        <Label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="h-3 w-3 text-primary" /> Border & Frame
        </Label>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`image-borderstyle-${element.id}`} className="text-[11px] text-muted-foreground">
              Style
            </Label>
            <Select
              value={currentBorderStyle}
              onValueChange={(val) => {
                handleStyleChange('borderStyle', val);
                if (val !== 'none' && borderWidthNum === 0) {
                  handleStyleChange('borderWidth', '3px');
                }
              }}
            >
              <SelectTrigger id={`image-borderstyle-${element.id}`} className="mt-1 h-8 text-xs">
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
            <Label htmlFor={`image-borderwidth-${element.id}`} className="text-[11px] text-muted-foreground">
              Width ({borderWidthNum}px)
            </Label>
            <Input
              id={`image-borderwidth-${element.id}`}
              type="number"
              min="0"
              max="30"
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

        <PresetColorPicker
          id={`image-bordercolor-${element.id}`}
          label="Border Color"
          value={currentBorderColor}
          onChange={(val) => handleStyleChange('borderColor', val)}
        />

        <div>
          <Label className="text-[11px] text-muted-foreground">Corner Radius</Label>
          <Input
            type="text"
            value={(element.style?.borderRadius as string) || '16px'}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            placeholder="e.g. 16px or 9999px"
            className="mt-1 h-8 text-xs"
          />
        </div>
      </div>

      {/* Shadow */}
      <div className="space-y-2 border-t pt-3">
        <Label className="text-xs font-semibold text-foreground">Shadow Effect</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {SHADOW_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleStyleChange('boxShadow', preset.value)}
              className={`p-1.5 text-[11px] rounded border transition-all text-center truncate ${
                currentShadow === preset.value
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rotation */}
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
          <Label htmlFor={`image-opacity-${element.id}`} className="text-xs font-semibold text-foreground">
            Transparency / Opacity
          </Label>
          <span className="text-[11px] font-mono text-muted-foreground">
            {typeof element.style?.opacity === 'number' ? Math.round(element.style.opacity * 100) : 100}%
          </span>
        </div>
        <Slider
          id={`image-opacity-${element.id}`}
          min={0}
          max={1}
          step={0.01}
          value={[typeof element.style?.opacity === 'number' ? element.style.opacity : 1]}
          onValueChange={(value) => handleStyleChange('opacity', value[0])}
          className="mt-1"
        />
      </div>

      {/* Curated Presets */}
      <div className="border-t pt-3">
        <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
          <Sparkles className="h-3 w-3 text-amber-500" /> Curated Stock Visuals
        </Label>
        <div className="grid grid-cols-2 gap-1.5">
          {STOCK_PHOTOS.map((stock) => (
            <button
              key={stock.name}
              type="button"
              onClick={() => {
                onUpdateElement({ ...element, source: stock.url });
                toast({ title: 'Image Replaced', description: `Applied ${stock.name}` });
              }}
              className="text-left p-1.5 rounded border border-border hover:border-primary hover:bg-muted text-[11px] truncate transition-colors"
            >
              {stock.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
