'use client';

import { Type, Square, Image as ImageIcon, Circle, Minus, Tag, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DesignElement } from '@/types/blueprint';
import { useToast } from '@/hooks/use-toast';

interface ElementLibraryProps {
  onAddElement: (elementSchema: Omit<DesignElement, 'id'>) => void;
}

export function ElementLibrary({ onAddElement }: ElementLibraryProps) {
  const { toast } = useToast();

  const handleAddHeadline = () => {
    onAddElement({
      type: 'text',
      position: { x: 200, y: 350 },
      size: { width: 600, height: 90 },
      content: 'Bold Headline',
      style: {
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '56px',
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
        zIndex: 5,
      },
    });
    toast({ title: 'Headline Added' });
  };

  const handleAddSubtitle = () => {
    onAddElement({
      type: 'text',
      position: { x: 200, y: 460 },
      size: { width: 600, height: 50 },
      content: 'Add your supporting message or description here.',
      style: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '20px',
        fontWeight: '400',
        color: '#64748B',
        textAlign: 'center',
        zIndex: 5,
      },
    });
    toast({ title: 'Subtitle Added' });
  };

  const handleAddPillBadge = () => {
    onAddElement({
      type: 'shape',
      position: { x: 380, y: 280 },
      size: { width: 240, height: 44 },
      style: {
        backgroundColor: '#3B82F6',
        borderRadius: '9999px',
        zIndex: 4,
      },
    });
    toast({ title: 'Pill Badge Added' });
  };

  const handleAddCardContainer = () => {
    onAddElement({
      type: 'shape',
      position: { x: 150, y: 200 },
      size: { width: 700, height: 600 },
      style: {
        backgroundColor: '#F8FAFC',
        borderRadius: '24px',
        border: '1px solid #E2E8F0',
        opacity: 0.95,
        zIndex: 1,
      },
    });
    toast({ title: 'Card Container Added' });
  };

  const handleAddCircle = () => {
    onAddElement({
      type: 'shape',
      position: { x: 400, y: 400 },
      size: { width: 200, height: 200 },
      style: {
        backgroundColor: '#F59E0B',
        borderRadius: '9999px',
        opacity: 0.9,
        zIndex: 2,
      },
    });
    toast({ title: 'Circle Element Added' });
  };

  const handleAddDivider = () => {
    onAddElement({
      type: 'shape',
      position: { x: 350, y: 500 },
      size: { width: 300, height: 4 },
      style: {
        backgroundColor: '#CBD5E1',
        borderRadius: '2px',
        zIndex: 3,
      },
    });
    toast({ title: 'Divider Added' });
  };

  const handleAddStockImage = () => {
    onAddElement({
      type: 'image',
      position: { x: 200, y: 250 },
      size: { width: 600, height: 400 },
      source: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      content: 'Stock photo',
      style: {
        borderRadius: '16px',
        zIndex: 2,
      },
    });
    toast({ title: 'Stock Image Added' });
  };

  const handleAddCTAButton = () => {
    onAddElement({
      type: 'shape',
      position: { x: 360, y: 540 },
      size: { width: 280, height: 56 },
      style: {
        backgroundColor: '#0F172A',
        borderRadius: '12px',
        zIndex: 4,
      },
    });
    toast({ title: 'CTA Button Shape Added' });
  };

  const elementItems = [
    { name: 'Headline Text', icon: Type, action: handleAddHeadline, desc: 'Large title (56px)' },
    { name: 'Subtitle Text', icon: Type, action: handleAddSubtitle, desc: 'Body text (20px)' },
    { name: 'Card Container', icon: Square, action: handleAddCardContainer, desc: 'Rounded background' },
    { name: 'Pill Badge', icon: Tag, action: handleAddPillBadge, desc: 'Tags & labels' },
    { name: 'Circle Shape', icon: Circle, action: handleAddCircle, desc: 'Circular accent' },
    { name: 'Divider Line', icon: Minus, action: handleAddDivider, desc: 'Separator bar' },
    { name: 'Stock Photo', icon: ImageIcon, action: handleAddStockImage, desc: 'Unsplash image' },
    { name: 'CTA Button', icon: MousePointerClick, action: handleAddCTAButton, desc: 'Action trigger' },
  ];

  return (
    <div className="p-4 space-y-4 flex flex-col min-h-full overflow-y-auto">
      <div>
        <h2 className="text-sm font-bold font-headline">Element Library</h2>
        <p className="text-xs text-muted-foreground">Add shapes, typography, and visuals to canvas</p>
      </div>

      <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-grow pr-1">
        {elementItems.map((item) => (
          <Button
            key={item.name}
            variant="outline"
            className="flex flex-col items-center justify-center h-20 p-2 text-center border-border hover:border-primary transition-all"
            onClick={item.action}
          >
            <item.icon className="w-5 h-5 mb-1 text-primary" />
            <span className="text-xs font-semibold">{item.name}</span>
            <span className="text-[10px] text-muted-foreground">{item.desc}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
