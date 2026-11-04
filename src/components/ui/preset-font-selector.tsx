'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Type } from 'lucide-react';

interface PresetFontSelectorProps {
  label?: string;
  value: string;
  onChange: (fontFamily: string) => void;
  id?: string;
  className?: string;
}

export const POPULAR_PRESET_FONTS = [
  { name: 'Inter', category: 'Clean Sans', fallback: 'sans-serif' },
  { name: 'Space Grotesk', category: 'Tech & Futuristic', fallback: 'sans-serif' },
  { name: 'Playfair Display', category: 'Luxury Editorial Serif', fallback: 'serif' },
  { name: 'Poppins', category: 'Geometric & Friendly', fallback: 'sans-serif' },
  { name: 'Montserrat', category: 'Punchy Modern', fallback: 'sans-serif' },
  { name: 'Roboto', category: 'Neutral Universal', fallback: 'sans-serif' },
  { name: 'Oswald', category: 'Condensed Impact', fallback: 'sans-serif' },
  { name: 'JetBrains Mono', category: 'Code & Terminal', fallback: 'monospace' },
  { name: 'Merriweather', category: 'Classic Warm Serif', fallback: 'serif' },
  { name: 'Georgia', category: 'Standard Web Serif', fallback: 'serif' },
  { name: 'Impact', category: 'Heavy Poster', fallback: 'sans-serif' },
  { name: 'Arial', category: 'System Standard', fallback: 'sans-serif' },
];

export function PresetFontSelector({
  label = 'Font Family',
  value = 'Inter',
  onChange,
  id,
  className,
}: PresetFontSelectorProps) {
  const currentFont = value || 'Inter';

  return (
    <div className={cn('space-y-2 select-none', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-primary" />
            {label}
          </Label>
        </div>
      )}

      {/* Preset Font Quick Chips */}
      <div className="flex flex-wrap gap-1">
        {POPULAR_PRESET_FONTS.slice(0, 5).map((font) => {
          const isActive = currentFont.toLowerCase().includes(font.name.toLowerCase());
          return (
            <button
              key={font.name}
              type="button"
              onClick={() => onChange(font.name)}
              className={cn(
                'text-[11px] px-2 py-0.5 rounded-md border transition-all text-left truncate max-w-[120px]',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                  : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border'
              )}
              style={{ fontFamily: font.name }}
            >
              {font.name}
            </button>
          );
        })}
      </div>

      {/* Full Preset Dropdown */}
      <Select value={currentFont} onValueChange={(val) => onChange(val)}>
        <SelectTrigger id={id} className="h-9 text-xs">
          <SelectValue placeholder="Select a preset font" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {POPULAR_PRESET_FONTS.map((font) => (
            <SelectItem key={font.name} value={font.name} className="text-xs py-2">
              <div className="flex items-center justify-between w-full gap-4">
                <span className="text-sm font-medium" style={{ fontFamily: font.name }}>
                  {font.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-normal">
                  {font.category}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Custom Font Family Fallback input */}
      <div className="pt-0.5">
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Custom font (e.g. Helvetica, Futura)"
          className="h-7 text-xs font-mono"
        />
      </div>
    </div>
  );
}
