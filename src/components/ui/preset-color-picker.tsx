'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, Pipette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PresetColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  id?: string;
  className?: string;
}

const NEUTRAL_COLORS = [
  '#FFFFFF',
  '#F8FAFC',
  '#E2E8F0',
  '#94A3B8',
  '#64748B',
  '#334155',
  '#1E293B',
  '#0F172A',
  '#000000',
];

const VIBRANT_COLORS = [
  '#3B82F6',
  '#2563EB',
  '#0284C7',
  '#06B6D4',
  '#10B981',
  '#059669',
  '#F59E0B',
  '#D97706',
  '#EF4444',
  '#DC2626',
  '#EC4899',
  '#8B5CF6',
  '#6366F1',
];

const PASTEL_AND_EARTHY_COLORS = [
  '#DBEAFE',
  '#E0F2FE',
  '#D1FAE5',
  '#FEF3C7',
  '#FEE2E2',
  '#FCE7F3',
  '#EDE9FE',
  '#FAF5EE',
  '#C2410C',
  '#431407',
];

export function PresetColorPicker({
  label,
  value,
  onChange,
  id,
  className,
}: PresetColorPickerProps) {
  // Normalize color for comparison and native color input
  const normalizedValue = value?.startsWith('hsl') ? '#FFFFFF' : (value || '#000000');
  const isSelected = (hex: string) =>
    normalizedValue.toLowerCase() === hex.toLowerCase();

  return (
    <div className={cn('space-y-2 select-none', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label htmlFor={id} className="text-xs font-semibold text-foreground">
            {label}
          </Label>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            {normalizedValue}
          </span>
        </div>
      )}

      {/* Preset Swatches Grid */}
      <div className="space-y-1.5 p-2 rounded-xl bg-muted/40 border border-border/70">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">
            Neutrals
          </span>
          <div className="flex flex-wrap gap-1">
            {NEUTRAL_COLORS.map((hex) => {
              const active = isSelected(hex);
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => onChange(hex)}
                  title={hex}
                  className={cn(
                    'w-5 h-5 rounded-md border shadow-2xs transition-all flex items-center justify-center shrink-0 hover:scale-115',
                    active ? 'ring-2 ring-primary ring-offset-1 z-10 scale-110 border-primary' : 'border-black/10 dark:border-white/10'
                  )}
                  style={{ backgroundColor: hex }}
                >
                  {active && (
                    <Check
                      className={cn(
                        'w-3 h-3 stroke-[3]',
                        hex === '#FFFFFF' || hex === '#F8FAFC' || hex === '#E2E8F0'
                          ? 'text-black'
                          : 'text-white'
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">
            Vibrant Primaries
          </span>
          <div className="flex flex-wrap gap-1">
            {VIBRANT_COLORS.map((hex) => {
              const active = isSelected(hex);
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => onChange(hex)}
                  title={hex}
                  className={cn(
                    'w-5 h-5 rounded-md border shadow-2xs transition-all flex items-center justify-center shrink-0 hover:scale-115',
                    active ? 'ring-2 ring-primary ring-offset-1 z-10 scale-110 border-primary' : 'border-black/10 dark:border-white/10'
                  )}
                  style={{ backgroundColor: hex }}
                >
                  {active && <Check className="w-3 h-3 stroke-[3] text-white" />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">
            Pastels & Earthy
          </span>
          <div className="flex flex-wrap gap-1">
            {PASTEL_AND_EARTHY_COLORS.map((hex) => {
              const active = isSelected(hex);
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => onChange(hex)}
                  title={hex}
                  className={cn(
                    'w-5 h-5 rounded-md border shadow-2xs transition-all flex items-center justify-center shrink-0 hover:scale-115',
                    active ? 'ring-2 ring-primary ring-offset-1 z-10 scale-110 border-primary' : 'border-black/10 dark:border-white/10'
                  )}
                  style={{ backgroundColor: hex }}
                >
                  {active && (
                    <Check
                      className={cn(
                        'w-3 h-3 stroke-[3]',
                        hex === '#FAF5EE' || hex.startsWith('#DB') || hex.startsWith('#E0') || hex.startsWith('#D1') || hex.startsWith('#FE')
                          ? 'text-black'
                          : 'text-white'
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Color Input Row */}
        <div className="pt-1.5 border-t border-border flex items-center gap-2">
          <div className="relative flex items-center">
            <Input
              id={id}
              type="color"
              value={normalizedValue}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 p-0.5 rounded-lg cursor-pointer border border-border shrink-0"
              title="Open full spectrum color wheel"
            />
            <Pipette className="h-3 w-3 absolute right-1.5 pointer-events-none opacity-50" />
          </div>
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#HEX or rgb"
            className="h-8 text-xs font-mono uppercase"
          />
        </div>
      </div>
    </div>
  );
}
