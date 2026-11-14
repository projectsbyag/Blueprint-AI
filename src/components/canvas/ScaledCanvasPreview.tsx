'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { DesignElement } from '@/types/blueprint';
import { CanvasElement } from '@/components/canvas/CanvasElement';
import { cn } from '@/lib/utils';

interface ScaledCanvasPreviewProps {
  elements: Array<Omit<DesignElement, 'id'> & { id?: string }>;
  canvasBackgroundColor?: string;
  className?: string;
}

export function ScaledCanvasPreview({
  elements,
  canvasBackgroundColor = '#FFFFFF',
  className,
}: ScaledCanvasPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.28);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / 1000);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full aspect-square overflow-hidden select-none pointer-events-none',
        className
      )}
    >
      <div
        style={{
          width: '1000px',
          height: '1000px',
          backgroundColor: canvasBackgroundColor || '#FFFFFF',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {elements.map((el, idx) => (
          <CanvasElement
            key={el.id || `preview_el_${idx}`}
            element={{
              ...el,
              id: el.id || `preview_el_${idx}`,
            }}
            scale={1}
            isSelected={false}
            isPreview={true}
          />
        ))}
      </div>
    </div>
  );
}
