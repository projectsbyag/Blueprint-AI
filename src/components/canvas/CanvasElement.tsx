'use client';

import type { DesignElement } from '@/types/blueprint';
import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | 'top' | 'bottom' | 'left' | 'right';

interface CanvasElementProps {
  element: DesignElement;
  scale: number;
  isSelected: boolean;
  isGroupMember?: boolean;
  onClick: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onResizeStart?: (event: React.MouseEvent, handle: ResizeHandle) => void;
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

  const isLocked = Boolean(element.style?.locked);

  // Compute composite transform: rotation + flipX + flipY
  const transforms: string[] = [];
  if (element.style?.rotation) {
    transforms.push(`rotate(${element.style.rotation}deg)`);
  }
  if (element.style?.flipX) {
    transforms.push('scaleX(-1)');
  }
  if (element.style?.flipY) {
    transforms.push('scaleY(-1)');
  }

  // Decompose any border property into separate non-shorthand values:
  // borderWidth, borderStyle, and borderColor
  let borderWidthVal = element.style?.borderWidth as string | undefined;
  let borderStyleVal = element.style?.borderStyle as string | undefined;
  let borderColorVal = element.style?.borderColor as string | undefined;

  // If a legacy shorthand border exists (e.g. "1px solid #E2E8F0"), parse it into separate values
  if (element.style?.border && typeof element.style.border === 'string') {
    const parts = element.style.border.trim().split(/\s+/);
    if (!borderWidthVal && parts[0]) borderWidthVal = parts[0];
    if (!borderStyleVal && parts[1]) borderStyleVal = parts[1];
    if (!borderColorVal && parts.length >= 3) borderColorVal = parts.slice(2).join(' ');
  }

  // Ensure borderStyle defaults to solid if width is set but style is missing
  if (borderWidthVal && borderWidthVal !== '0px' && (!borderStyleVal || borderStyleVal === 'none')) {
    borderStyleVal = 'solid';
  }

  // Strip conflicting shorthand 'border' from the spread element.style
  const { border: _discardBorder, ...restElementStyle } = (element.style || {}) as any;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${element.position.x * scale}px`,
    top: `${element.position.y * scale}px`,
    width: `${element.size.width * scale}px`,
    height: `${element.size.height * scale}px`,
    boxSizing: 'border-box',
    cursor: isLocked ? 'not-allowed' : isSelected ? 'move' : 'pointer',
    zIndex: element.style?.zIndex ?? 1,
    ...restElementStyle,
  };

  if (transforms.length > 0) {
    style.transform = transforms.join(' ');
  }

  // Strictly use separate non-shorthand border properties on the DOM style
  if (borderWidthVal && borderWidthVal !== '0px' && borderStyleVal && borderStyleVal !== 'none') {
    style.borderWidth = borderWidthVal;
    style.borderStyle = borderStyleVal;
    style.borderColor = borderColorVal || '#94A3B8';
  } else {
    style.borderWidth = '0px';
    style.borderStyle = 'none';
    style.borderColor = 'transparent';
  }
  delete (style as any).border;
  if (element.style?.borderRadius) {
    style.borderRadius = element.style.borderRadius as string;
  }
  if (element.style?.boxShadow) {
    style.boxShadow = element.style.boxShadow;
  }
  if (element.style?.filter) {
    style.filter = element.style.filter;
  }
  if (element.style?.backdropFilter) {
    style.backdropFilter = element.style.backdropFilter;
  }

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
  if (element.style?.textTransform) style.textTransform = element.style.textTransform;
  if (element.style?.textDecoration) style.textDecoration = element.style.textDecoration;

  if (typeof element.style?.opacity === 'number') style.opacity = element.style.opacity;

  const selectionOutline = isSelected
    ? isLocked
      ? '2px solid #EF4444'
      : '2px solid #3B82F6'
    : isGroupMember
    ? '2px dashed #60A5FA'
    : '1px dashed rgba(150, 150, 150, 0.25)';

  const handlePointerDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    onMouseDown?.(e);
  };

  const handleResizeDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    if (isLocked) return;
    onResizeStart?.(e, handle);
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
                textTransform: element.style?.textTransform,
                textDecoration: element.style?.textDecoration,
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
              style={{
                borderRadius: element.style?.borderRadius || 'inherit',
                filter: element.style?.filter,
              }}
            />
          </div>
        );
      }

      case 'shape': {
        const shapeType = element.style?.shapeType;
        const fillColor = (element.style?.backgroundColor as string) || '#3B82F6';
        const strokeColor = borderColorVal || 'transparent';
        const strokeW = parseFloat(borderWidthVal || '0') || 0;
        const isDashed = borderStyleVal === 'dashed';

        // Render vector SVG for specialized shapes and arrows
        if (shapeType === 'arrow-right') {
          return (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full pointer-events-none"
            >
              <polygon
                points="0,35 65,35 65,10 100,50 65,90 65,65 0,65"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeDasharray={isDashed ? '6 4' : undefined}
              />
            </svg>
          );
        }

        if (shapeType === 'arrow-left') {
          return (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full pointer-events-none"
            >
              <polygon
                points="100,35 35,35 35,10 0,50 35,90 35,65 100,65"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeDasharray={isDashed ? '6 4' : undefined}
              />
            </svg>
          );
        }

        if (shapeType === 'double-arrow') {
          return (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full pointer-events-none"
            >
              <polygon
                points="30,15 0,50 30,85 30,62 70,62 70,85 100,50 70,15 70,38 30,38"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeDasharray={isDashed ? '6 4' : undefined}
              />
            </svg>
          );
        }

        if (shapeType === 'triangle') {
          return (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full pointer-events-none"
            >
              <polygon
                points="50,5 98,95 2,95"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeDasharray={isDashed ? '6 4' : undefined}
              />
            </svg>
          );
        }

        if (shapeType === 'star') {
          return (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full pointer-events-none"
            >
              <polygon
                points="50,2 63,35 98,38 72,62 79,97 50,78 21,97 28,62 2,38 37,35"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeDasharray={isDashed ? '6 4' : undefined}
              />
            </svg>
          );
        }

        if (shapeType === 'badge-ribbon') {
          return (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full pointer-events-none"
            >
              <polygon
                points="50,0 65,12 85,7 88,28 100,45 88,62 85,83 65,78 50,90 35,78 15,83 12,62 0,45 12,28 15,7 35,12"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeDasharray={isDashed ? '6 4' : undefined}
              />
            </svg>
          );
        }

        if (shapeType === 'quote-bubble') {
          return (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full pointer-events-none"
            >
              <path
                d="M 10 10 L 90 10 Q 98 10 98 18 L 98 62 Q 98 70 90 70 L 40 70 L 15 95 L 20 70 L 10 70 Q 2 70 2 62 L 2 18 Q 2 10 10 10 Z"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeW}
                strokeDasharray={isDashed ? '6 4' : undefined}
              />
            </svg>
          );
        }

        // Standard rounded/pill/rectangle shape
        return <div className="w-full h-full pointer-events-none rounded-[inherit]" />;
      }

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

      {/* Lock indicator */}
      {isLocked && isSelected && (
        <div className="absolute -top-5 right-0 px-1.5 py-0.5 bg-red-600 text-[9px] font-bold tracking-wider text-white rounded-xs uppercase shadow-xs pointer-events-none z-30 flex items-center gap-1">
          <Lock className="w-2.5 h-2.5" />
          Locked
        </div>
      )}

      {/* Group indicator badge */}
      {element.groupId && isSelected && (
        <div className="absolute -top-4 left-0 px-1.5 py-0.2 bg-blue-600 text-[9px] font-bold tracking-wider text-white rounded-xs uppercase shadow-xs pointer-events-none z-30">
          Group
        </div>
      )}

      {/* Interactive 8-Point Resize Handles (Corners + Mid-Sides) */}
      {isSelected && !isLocked && (
        <>
          {/* 4 Corners */}
          <div
            onMouseDown={(e) => handleResizeDown(e, 'tl')}
            className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm cursor-nwse-resize z-30 hover:scale-125 transition-transform"
            title="Resize Diagonal"
          />
          <div
            onMouseDown={(e) => handleResizeDown(e, 'tr')}
            className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm cursor-nesw-resize z-30 hover:scale-125 transition-transform"
            title="Resize Diagonal"
          />
          <div
            onMouseDown={(e) => handleResizeDown(e, 'bl')}
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm cursor-nesw-resize z-30 hover:scale-125 transition-transform"
            title="Resize Diagonal"
          />
          <div
            onMouseDown={(e) => handleResizeDown(e, 'br')}
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm cursor-nwse-resize z-30 hover:scale-125 transition-transform"
            title="Resize Diagonal"
          />

          {/* 4 Mid-Sides */}
          {/* Top Center */}
          <div
            onMouseDown={(e) => handleResizeDown(e, 'top')}
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-3 bg-white border-2 border-blue-600 rounded-xs shadow-sm cursor-ns-resize z-30 hover:scale-115 transition-transform flex items-center justify-center"
            title="Resize Height (Top)"
          />
          {/* Bottom Center */}
          <div
            onMouseDown={(e) => handleResizeDown(e, 'bottom')}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-3 bg-white border-2 border-blue-600 rounded-xs shadow-sm cursor-ns-resize z-30 hover:scale-115 transition-transform flex items-center justify-center"
            title="Resize Height (Bottom)"
          />
          {/* Left Center */}
          <div
            onMouseDown={(e) => handleResizeDown(e, 'left')}
            className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-5 bg-white border-2 border-blue-600 rounded-xs shadow-sm cursor-ew-resize z-30 hover:scale-115 transition-transform flex items-center justify-center"
            title="Resize Width (Left)"
          />
          {/* Right Center */}
          <div
            onMouseDown={(e) => handleResizeDown(e, 'right')}
            className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-5 bg-white border-2 border-blue-600 rounded-xs shadow-sm cursor-ew-resize z-30 hover:scale-115 transition-transform flex items-center justify-center"
            title="Resize Width (Right)"
          />
        </>
      )}
    </div>
  );
}
