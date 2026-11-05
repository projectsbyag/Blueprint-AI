import type React from 'react';

export interface ElementStyle extends React.CSSProperties {
  zIndex?: number;
  rotation?: number; // in degrees (-180 to 180)
  flipX?: boolean;
  flipY?: boolean;
  locked?: boolean;
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  boxShadow?: string;
  opacity?: number;
  textShadow?: string;
  letterSpacing?: string;
  lineHeight?: string | number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  shapeType?:
    | 'rectangle'
    | 'circle'
    | 'pill'
    | 'arrow-right'
    | 'arrow-left'
    | 'arrow-up'
    | 'arrow-down'
    | 'double-arrow'
    | 'triangle'
    | 'star'
    | 'badge-ribbon'
    | 'quote-bubble'
    | 'divider-solid'
    | 'divider-dashed'
    | 'divider-gradient';
  filter?: string;
  backdropFilter?: string;
  [key: string]: any;
}

export interface DesignElement {
  id: string;
  type: 'text' | 'image' | 'shape' | string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  content?: string;
  source?: string;
  style?: ElementStyle;
  groupId?: string;
}

export interface DesignPage {
  id: string;
  title?: string;
  elements: DesignElement[];
  canvasBackgroundColor?: string;
}

export interface DesignLayout {
  id: string;
  description: string;
  elements: DesignElement[]; // active page elements
  canvasBackgroundColor?: string; // active page background color
  pages?: DesignPage[]; // carousel slides
  activePageIndex?: number;
}
