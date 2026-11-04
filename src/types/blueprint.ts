import type React from 'react';

export interface ElementStyle extends React.CSSProperties {
  zIndex?: number;
  rotation?: number; // in degrees
  borderRadius?: string;
  borderColor?: string;
  borderWidth?: string;
  opacity?: number;
  textShadow?: string;
  letterSpacing?: string;
  lineHeight?: string | number;
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
