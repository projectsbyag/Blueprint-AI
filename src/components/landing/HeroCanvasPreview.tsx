'use client';

import React from 'react';
import { PlayableCanvasWorkspace } from './PlayableCanvasWorkspace';

export function HeroCanvasPreview() {
  return (
    <PlayableCanvasWorkspace
      initialTemplateIndex={0}
      figureLabel="FIG. 001 // BLUEPRINT INTERACTIVE SANDBOX"
    />
  );
}
