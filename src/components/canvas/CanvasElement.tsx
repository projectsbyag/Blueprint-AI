'use client';

import type { DesignElement } from '@/types/blueprint';
import React, { useState } from 'react';

interface CanvasElementProps {
  element: DesignElement;
  scale: number;
  isSelected: boolean;
  isGroupMember?: boolean;
  onClick: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onResizeStart?: (event: React.MouseEvent, corner: 'tl' | 'tr' | 'bl' | 'br') => void;
}

export function CanvasElement({
  element,
  scale,
  isSelected,
  isGroupMember,
  onClick,
  onMouseDown,
  onResizeStart,
}: CanvasElementProps) {
  const [imageError, setImageError] = useState(false);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${element.position.x * scale}px`,
    top: `${element.position.y * scale}px`,
    width: `${element.size.width * scale}px`,
    height: `${element.size.height * scale}px`,
    boxSizing: 'border-box',
    cursor: isSelected ? 'move' : 'pointer',
    zIndex: element.style?.zIndex ?? 1,
    ...element.style,
  };

  if (element.style?.fontFamily) style.fontFamily = element.style.fontFamily as string;
  if (element.style?.fontSize) {
    const rawSize = parseFloat(element.style.fontSize as string) || 16;
    style.fontSize = `${rawSize * scale}px`;
  }
  if (element.style?.lineHeight) style.lineHeight = element.style.lineHeight;
  if (element.style?.color) style.color = element.style.color as string;
  if (element.style?.backgroundColor) style.backgroundColor = element.style.backgroundColor as string;
  if (element.style?.fontWeight) style.fontWeight = element.style.fontWeight;
  if (element.style?.letterSpacing) style.letterSpacing = element.style.letterSpacing;
  if (element.style?.textAlign) style.textAlign = element.style.textAlign;
  if (element.style?.textShadow) style.textShadow = element.style.textShadow;

  if (element.style?.borderRadius) style.borderRadius = element.style.borderRadius as string;
  if (element.style?.border) style.border = element.style.border as string;
  if (typeof element.style?.opacity === 'number') style.opacity = element.style.opacity;

  if (element.style?.rotation) {
    style.transform = `rotate(${element.style.rotation}deg)`;
  }

  const selectionOutline = isSelected
    ? '2px solid #3B82F6'
    : isGroupMember
    ? '2px dashed #60A5FA'
    : '1px dashed rgba(150, 150, 150, 0.25)';

  const handlePointerDown = (e: React.MouseEvent) => {
    onMouseDown?.(e);
  };

  const handleCornerDown = (e: React.MouseEvent, corner: 'tl' | 'tr' | 'bl' | 'br') => {
    e.stopPropagation();
    onResizeStart?.(e, corner);
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div className="w-full h-full flex flex-col justify-center px-1 overflow-hidden pointer-events-none">
            <span
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                textAlign: (element.style?.textAlign as any) || 'inherit',
                display: 'block',
              }}
            >
              {element.content}
            </span>
          </div>
        );

      case 'image': {
        const fallbackSrc = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80`;
        const imgSrc =
          imageError || !element.source || element.source.includes('placehold.co')
            ? fallbackSrc
            : element.source;

        return (
          <div className="w-full h-full overflow-hidden pointer-events-none rounded-[inherit]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={element.content || 'Design Graphic'}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover pointer-events-none"
              style={{ borderRadius: element.style?.borderRadius || 'inherit' }}
            />
          </div>
        );
      }

      case 'shape':
        return <div className="w-full h-full pointer-events-none rounded-[inherit]" />;

      default:
        return (
          <div className="w-full h-full flex items-center justify-center p-2 text-xs border border-dashed border-red-400">
            {element.content || element.type}
          </div>
        );
    }
  };

  return (
    <div
      style={{
        ...style,
        outline: selectionOutline,
        outlineOffset: '1px',
      }}
      onClick={onClick}
      onMouseDown={handlePointerDown}
      className="group relative select-none"
    >
      {renderContent()}

      {/* Group indicator badge */}
      {element.groupId && isSelected && (
        <div className="absolute -top-4 left-0 px-1.5 py-0.2 bg-blue-600 text-[9px] font-bold tracking-wider text-white rounded-xs uppercase shadow-xs pointer-events-none z-30">
          Group
        </div>
      )}

      {/* Interactive Corner Resize Handles */}
      {isSelected && (
        <>
          <div
            onMouseDown={(e) => handleCornerDown(e, 'tl')}
            className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm cursor-nwse-resize z-30 hover:scale-125 transition-transform"
            title="Resize"
          />
          <div
            onMouseDown={(e) => handleCornerDown(e, 'tr')}
            className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm cursor-nesw-resize z-30 hover:scale-125 transition-transform"
            title="Resize"
          />
          <div
            onMouseDown={(e) => handleCornerDown(e, 'bl')}
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm cursor-nesw-resize z-30 hover:scale-125 transition-transform"
            title="Resize"
          />
          <div
            onMouseDown={(e) => handleCornerDown(e, 'br')}
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm cursor-nwse-resize z-30 hover:scale-125 transition-transform"
            title="Resize"
          />
        </>
      )}
    </div>
  );
}
