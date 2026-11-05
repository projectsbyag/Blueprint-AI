'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Lock,
  Unlock,
  RotateCw,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  CaseUpper,
  CaseLower,
  CaseSensitive,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { PresetColorPicker } from '@/components/ui/preset-color-picker';
import { PresetFontSelector } from '@/components/ui/preset-font-selector';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface TextEditorProps {
  element: DesignElement & { type: 'text' };
  onUpdateElement: (updatedElement: DesignElement) => void;
}

interface TextShadow {
  offsetX: string;
  offsetY: string;
  blurRadius: string;
  color: string;
}

const initialShadow: TextShadow = { offsetX: '0px', offsetY: '0px', blurRadius: '0px', color: '#000000' };

function parseTextShadow(shadowString?: string): TextShadow {
  if (!shadowString || shadowString === 'none') return initialShadow;
  const parts = shadowString.trim().split(/\s+/);
  if (parts.length === 4) {
    return {
      offsetX: parts[0],
      offsetY: parts[1],
      blurRadius: parts[2],
      color: parts[3],
    };
  }
  return initialShadow;
}

const TEXT_SHADOW_PRESETS = [
  { label: 'None', value: 'none' },
  { label: 'Soft Shadow', value: '0px 2px 4px rgba(0,0,0,0.3)' },
  { label: 'Retro Hard', value: '3px 3px 0px #0F172A' },
  { label: 'Neon Blue', value: '0px 0px 12px #38BDF8' },
  { label: 'Neon Pink', value: '0px 0px 12px #F43F5E' },
];

export function TextEditor({ element, onUpdateElement }: TextEditorProps) {
  const { toast } = useToast();
  const [textShadow, setTextShadow] = useState<TextShadow>(initialShadow);
  const [aiCopySuggestions, setAiCopySuggestions] = useState<string[]>([]);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  useEffect(() => {
    setTextShadow(parseTextShadow(element.style?.textShadow));
  }, [element.style?.textShadow]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateElement({ ...element, content: e.target.value });
  };

  const handleStyleChange = (property: string, value: any) => {
    onUpdateElement({
      ...element,
      style: {
        ...element.style,
        [property]: value,
      },
    });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = e.target.value;
    handleStyleChange('fontSize', newSize ? `${parseFloat(newSize)}px` : undefined);
  };

  const handleTextShadowChange = (part: keyof TextShadow, value: string) => {
    const newShadow = { ...textShadow, [part]: value };
    setTextShadow(newShadow);
    if (newShadow.offsetX === '0px' && newShadow.offsetY === '0px' && newShadow.blurRadius === '0px') {
      handleStyleChange('textShadow', 'none');
    } else {
      handleStyleChange('textShadow', `${newShadow.offsetX} ${newShadow.offsetY} ${newShadow.blurRadius} ${newShadow.color}`);
    }
  };

  const isLocked = Boolean(element.style?.locked);
  const currentRotation = Number(element.style?.rotation) || 0;

  const fontWeights = [
    { label: 'Light', value: '300' },
    { label: 'Normal', value: '400' },
    { label: 'Medium', value: '500' },
    { label: 'Semi-Bold', value: '600' },
    { label: 'Bold', value: '700' },
    { label: 'Extra-Bold', value: '800' },
    { label: 'Black / Heavy', value: '900' },
  ];

  const textAlignOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
    { label: 'Justify', value: 'justify' },
  ];

  return (
    <div className="space-y-4 select-none">
      {/* Quick Lock Bar */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border">
        <Button
          type="button"
          variant={isLocked ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => {
            const nextLocked = !isLocked;
            handleStyleChange('locked', nextLocked);
            toast({
              title: nextLocked ? 'Text Locked' : 'Text Unlocked',
              description: nextLocked ? 'Cannot be moved or resized on canvas' : 'Free to edit',
            });
          }}
          className="h-7 px-2 text-xs gap-1"
        >
          {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          <span>{isLocked ? 'Locked' : 'Lock Text'}</span>
        </Button>

        {/* Text Decoration Quick Toggles */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={element.style?.textTransform === 'uppercase' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() =>
              handleStyleChange(
                'textTransform',
                element.style?.textTransform === 'uppercase' ? 'none' : 'uppercase'
              )
            }
            className="h-7 w-7"
            title="UPPERCASE"
          >
            <CaseUpper className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={element.style?.textTransform === 'capitalize' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() =>
              handleStyleChange(
                'textTransform',
                element.style?.textTransform === 'capitalize' ? 'none' : 'capitalize'
              )
            }
            className="h-7 w-7"
            title="Capitalize Words"
          >
            <CaseSensitive className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={element.style?.textDecoration === 'underline' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() =>
              handleStyleChange(
                'textDecoration',
                element.style?.textDecoration === 'underline' ? 'none' : 'underline'
              )
            }
            className="h-7 w-7"
            title="Underline"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant={element.style?.textDecoration === 'line-through' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() =>
              handleStyleChange(
                'textDecoration',
                element.style?.textDecoration === 'line-through' ? 'none' : 'line-through'
              )
            }
            className="h-7 w-7"
            title="Strikethrough"
          >
            <StrikethroughIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content Field & AI Polish */}
      <div>
        <Label htmlFor={`text-content-${element.id}`} className="text-xs font-semibold">
          Text Content
        </Label>
        <Textarea
          id={`text-content-${element.id}`}
          value={element.content || ''}
          onChange={handleContentChange}
          rows={3}
          className="mt-1 text-xs"
        />
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isGeneratingCopy || !element.content}
            onClick={async () => {
              if (!element.content) return;
              setIsGeneratingCopy(true);
              try {
                const { generateAICopyAlternative } = await import('@/lib/actions');
                const results = await generateAICopyAlternative(element.content);
                setAiCopySuggestions(results);
              } catch (e) {
                console.error(e);
              } finally {
                setIsGeneratingCopy(false);
              }
            }}
            className="w-full text-xs h-7 gap-1 font-semibold border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            {isGeneratingCopy ? 'Generating ideas...' : 'AI Polish & Catchy Rewrite'}
          </Button>

          {aiCopySuggestions.length > 0 && (
            <div className="mt-2 p-2 bg-muted/60 rounded-lg border text-xs space-y-1">
              <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                Select to replace on canvas:
              </span>
              {aiCopySuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onUpdateElement({ ...element, content: suggestion });
                    setAiCopySuggestions([]);
                  }}
                  className="block w-full text-left p-1.5 rounded hover:bg-background border border-transparent hover:border-border transition-colors text-foreground text-xs"
                >
                  &ldquo;{suggestion}&rdquo;
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preset Font Family Selector */}
      <PresetFontSelector
        id={`text-font-family-${element.id}`}
        label="Popular Preset Fonts"
        value={(element.style?.fontFamily as string) || 'Inter'}
        onChange={(font) => handleStyleChange('fontFamily', font)}
      />

      {/* Preset Color Picker */}
      <PresetColorPicker
        id={`text-color-${element.id}`}
        label="Text Color"
        value={(element.style?.color as string) || '#000000'}
        onChange={(color) => handleStyleChange('color', color)}
      />

      {/* Background Highlight / Pill Badge Behind Text */}
      <PresetColorPicker
        id={`text-bgcolor-${element.id}`}
        label="Text Background / Highlight"
        value={(element.style?.backgroundColor as string) || 'transparent'}
        onChange={(color) => {
          handleStyleChange('backgroundColor', color);
          if (color !== 'transparent' && !element.style?.borderRadius) {
            handleStyleChange('borderRadius', '8px');
          }
        }}
      />

      {/* Size and Weight Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`text-font-size-${element.id}`} className="text-xs font-semibold">
            Size (px)
          </Label>
          <Input
            id={`text-font-size-${element.id}`}
            type="number"
            value={element.style?.fontSize ? parseFloat(element.style.fontSize as string) : ''}
            onChange={handleFontSizeChange}
            className="mt-1 h-8 text-xs"
            placeholder="24"
          />
        </div>

        <div>
          <Label htmlFor={`text-font-weight-${element.id}`} className="text-xs font-semibold">
            Weight
          </Label>
          <Select
            value={element.style?.fontWeight?.toString() || '400'}
            onValueChange={(value) => handleStyleChange('fontWeight', value)}
          >
            <SelectTrigger id={`text-font-weight-${element.id}`} className="mt-1 h-8 text-xs">
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent>
              {fontWeights.map((fw) => (
                <SelectItem key={fw.value} value={fw.value} className="text-xs">
                  {fw.label} ({fw.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alignment, Line Height, Letter Spacing */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`text-line-height-${element.id}`} className="text-xs font-semibold">
            Line Height
          </Label>
          <Input
            id={`text-line-height-${element.id}`}
            type="text"
            value={(element.style?.lineHeight as string) || ''}
            onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
            className="mt-1 h-8 text-xs"
            placeholder="1.2"
          />
        </div>
        <div>
          <Label htmlFor={`text-letter-spacing-${element.id}`} className="text-xs font-semibold">
            Letter Spacing
          </Label>
          <Input
            id={`text-letter-spacing-${element.id}`}
            type="text"
            value={(element.style?.letterSpacing as string) || ''}
            onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
            className="mt-1 h-8 text-xs"
            placeholder="1px"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`text-text-align-${element.id}`} className="text-xs font-semibold">
          Text Align
        </Label>
        <Select
          value={(element.style?.textAlign as string) || 'left'}
          onValueChange={(value) => handleStyleChange('textAlign', value)}
        >
          <SelectTrigger id={`text-text-align-${element.id}`} className="mt-1 h-8 text-xs">
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            {textAlignOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {/* Text Shadow Effects */}
      <div className="space-y-2 border-t pt-3">
        <Label className="text-xs font-bold uppercase tracking-wider text-foreground">Text Shadow Presets</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {TEXT_SHADOW_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleStyleChange('textShadow', preset.value)}
              className={`p-1.5 text-[11px] rounded border transition-all text-center truncate ${
                element.style?.textShadow === preset.value
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom text shadow inputs */}
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          <div>
            <Label className="text-[10px] text-muted-foreground">Offset X</Label>
            <Input
              type="text"
              value={textShadow.offsetX}
              onChange={(e) => handleTextShadowChange('offsetX', e.target.value)}
              className="mt-0.5 h-7 text-xs"
              placeholder="0px"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Offset Y</Label>
            <Input
              type="text"
              value={textShadow.offsetY}
              onChange={(e) => handleTextShadowChange('offsetY', e.target.value)}
              className="mt-0.5 h-7 text-xs"
              placeholder="2px"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Blur</Label>
            <Input
              type="text"
              value={textShadow.blurRadius}
              onChange={(e) => handleTextShadowChange('blurRadius', e.target.value)}
              className="mt-0.5 h-7 text-xs"
              placeholder="4px"
            />
          </div>
        </div>

        <PresetColorPicker
          id={`text-shadow-color-${element.id}`}
          label="Shadow Color"
          value={textShadow.color}
          onChange={(color) => handleTextShadowChange('color', color)}
        />
      </div>
    </div>
  );
}
