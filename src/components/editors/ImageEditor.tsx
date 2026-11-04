'use client';

import type { DesignElement } from '@/types/blueprint';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UploadCloud, Sparkles } from 'lucide-react';
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
];

export function ImageEditor({ element, onUpdateElement }: ImageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateElement({ ...element, source: e.target.value });
  };

  const handleImageUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file (e.g., PNG, JPG, GIF).',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateElement({ ...element, source: reader.result as string });
        toast({
          title: 'Image Uploaded',
          description: `${file.name} set as image source.`,
        });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`image-source-${element.id}`} className="text-sm font-medium">
          Image Source URL
        </Label>
        <Input
          id={`image-source-${element.id}`}
          value={element.source || ''}
          onChange={handleSourceChange}
          placeholder="https://images.unsplash.com/... or upload"
          className="mt-1 h-9 text-xs"
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <Button variant="outline" size="sm" onClick={handleImageUploadButtonClick} className="w-full text-xs">
        <UploadCloud className="mr-2 h-4 w-4" />
        Upload from Device
      </Button>

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
