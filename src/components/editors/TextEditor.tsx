
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
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react';

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
  // Basic parser: assumes "offsetX offsetY blurRadius color"
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

export function TextEditor({ element, onUpdateElement }: TextEditorProps) {
  const [textShadow, setTextShadow] = useState<TextShadow>(initialShadow);
  const [aiCopySuggestions, setAiCopySuggestions] = useState<string[]>([]);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  useEffect(() => {
    setTextShadow(parseTextShadow(element.style?.textShadow));
  }, [element.style?.textShadow]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateElement({ ...element, content: e.target.value });
  };

  const handleStyleChange = (property: keyof React.CSSProperties | keyof DesignElement['style'], value: string | number | undefined) => {
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
  
  const fontWeights = [
    { label: 'Light', value: '300' },
    { label: 'Normal', value: '400' },
    { label: 'Medium', value: '500' },
    { label: 'Semi-Bold', value: '600' },
    { label: 'Bold', value: '700' },
    { label: 'Extra-Bold', value: '800' },
  ];

  const textAlignOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
    { label: 'Justify', value: 'justify' },
  ];


  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`text-content-${element.id}`} className="text-sm font-medium">Content</Label>
        <Textarea
          id={`text-content-${element.id}`}
          value={element.content || ''}
          onChange={handleContentChange}
          rows={3}
          className="mt-1"
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
            className="w-full text-xs h-7 gap-1"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
            {isGeneratingCopy ? 'Generating ideas...' : 'AI Polish & Catchy Rewrite'}
          </Button>

          {aiCopySuggestions.length > 0 && (
            <div className="mt-2 p-2 bg-muted/60 rounded border text-xs space-y-1">
              <span className="font-semibold text-muted-foreground block text-[10px] uppercase">Select to replace:</span>
              {aiCopySuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onUpdateElement({ ...element, content: suggestion });
                    setAiCopySuggestions([]);
                  }}
                  className="block w-full text-left p-1 rounded hover:bg-background transition-colors text-foreground text-xs"
                >
                  &ldquo;{suggestion}&rdquo;
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-4">
        <div>
          <Label htmlFor={`text-font-size-${element.id}`} className="text-sm font-medium">Font Size (px)</Label>
          <Input
            id={`text-font-size-${element.id}`}
            type="number"
            value={element.style?.fontSize ? parseFloat(element.style.fontSize as string) : ''}
            onChange={handleFontSizeChange}
            className="mt-1 h-9"
            placeholder="e.g., 24"
          />
        </div>
        <div>
          <Label htmlFor={`text-color-${element.id}`} className="text-sm font-medium">Color</Label>
          <Input
            id={`text-color-${element.id}`}
            type="color"
            value={(element.style?.color as string) || '#000000'}
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="mt-1 h-9 p-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor={`text-font-family-${element.id}`} className="text-sm font-medium">Font Family</Label>
          <Input
            id={`text-font-family-${element.id}`}
            type="text"
            value={(element.style?.fontFamily as string) || 'Inter'}
            onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
            className="mt-1 h-9"
            placeholder="e.g., Inter, Arial"
          />
        </div>
         <div>
          <Label htmlFor={`text-font-weight-${element.id}`} className="text-sm font-medium">Font Weight</Label>
          <Select
            value={element.style?.fontWeight?.toString() || '400'}
            onValueChange={(value) => handleStyleChange('fontWeight', value)}
          >
            <SelectTrigger id={`text-font-weight-${element.id}`} className="mt-1 h-9">
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent>
              {fontWeights.map(fw => (
                <SelectItem key={fw.value} value={fw.value}>{fw.label} ({fw.value})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
         <div>
          <Label htmlFor={`text-line-height-${element.id}`} className="text-sm font-medium">Line Height</Label>
          <Input
            id={`text-line-height-${element.id}`}
            type="text" // Allows units like 1.5 or 24px
            value={(element.style?.lineHeight as string) || ''}
            onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
            className="mt-1 h-9"
            placeholder="e.g., 1.5 or 24px"
          />
        </div>
        <div>
          <Label htmlFor={`text-letter-spacing-${element.id}`} className="text-sm font-medium">Letter Spacing</Label>
          <Input
            id={`text-letter-spacing-${element.id}`}
            type="text" // Allows units like 1px or 0.1em
            value={(element.style?.letterSpacing as string) || ''}
            onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
            className="mt-1 h-9"
            placeholder="e.g., 1px or 0.1em"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor={`text-text-align-${element.id}`} className="text-sm font-medium">Text Align</Label>
          <Select
            value={(element.style?.textAlign as string) || 'left'}
            onValueChange={(value) => handleStyleChange('textAlign', value)}
          >
            <SelectTrigger id={`text-text-align-${element.id}`} className="mt-1 h-9">
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              {textAlignOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 border-t pt-4 mt-4">
        <Label className="text-sm font-medium">Text Shadow</Label>
        <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            <div>
                <Label htmlFor={`text-shadow-offsetx-${element.id}`} className="text-xs">Offset X</Label>
                <Input id={`text-shadow-offsetx-${element.id}`} type="text" value={textShadow.offsetX} onChange={(e) => handleTextShadowChange('offsetX', e.target.value)} className="mt-1 h-8" placeholder="e.g., 2px"/>
            </div>
            <div>
                <Label htmlFor={`text-shadow-offsety-${element.id}`} className="text-xs">Offset Y</Label>
                <Input id={`text-shadow-offsety-${element.id}`} type="text" value={textShadow.offsetY} onChange={(e) => handleTextShadowChange('offsetY', e.target.value)} className="mt-1 h-8" placeholder="e.g., 2px"/>
            </div>
            <div>
                <Label htmlFor={`text-shadow-blur-${element.id}`} className="text-xs">Blur Radius</Label>
                <Input id={`text-shadow-blur-${element.id}`} type="text" value={textShadow.blurRadius} onChange={(e) => handleTextShadowChange('blurRadius', e.target.value)} className="mt-1 h-8" placeholder="e.g., 5px"/>
            </div>
            <div>
                <Label htmlFor={`text-shadow-color-${element.id}`} className="text-xs">Color</Label>
                <Input id={`text-shadow-color-${element.id}`} type="color" value={textShadow.color} onChange={(e) => handleTextShadowChange('color', e.target.value)} className="mt-1 h-8 p-1 w-full"/>
            </div>
        </div>
      </div>
    </div>
  );
}
