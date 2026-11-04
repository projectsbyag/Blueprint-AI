'use client';

import { PropertiesEditor } from '@/components/editors/PropertiesEditor';
import type { DesignElement } from '@/types/blueprint';

interface RightPanelProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (updatedElement: DesignElement) => void;
  onDeleteElement?: (elementId: string) => void;
  onDuplicateElement?: (elementId: string) => void;
  canvasBackgroundColor?: string;
  onUpdateCanvasBackgroundColor: (color: string) => void;
}

export function RightPanel({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  canvasBackgroundColor,
  onUpdateCanvasBackgroundColor,
}: RightPanelProps) {
  return (
    <aside className="w-[320px] border-l bg-card flex flex-col h-full min-h-0 overflow-hidden shrink-0 select-none">
      <PropertiesEditor
        selectedElement={selectedElement}
        onUpdateElement={onUpdateElement}
        onDeleteElement={onDeleteElement}
        onDuplicateElement={onDuplicateElement}
        canvasBackgroundColor={canvasBackgroundColor}
        onUpdateCanvasBackgroundColor={onUpdateCanvasBackgroundColor}
      />
    </aside>
  );
}
