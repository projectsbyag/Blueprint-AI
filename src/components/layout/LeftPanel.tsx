'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiDesignTool } from '@/components/tools/AiDesignTool';
import { TemplateLibrary } from '@/components/tools/TemplateLibrary';
import { ElementLibrary } from '@/components/tools/ElementLibrary';
import { LayersPanel } from '@/components/tools/LayersPanel';
import type { DesignLayout, DesignElement } from '@/types/blueprint';
import { Wand2, LayoutDashboard, Puzzle, Layers } from 'lucide-react';

interface LeftPanelProps {
  currentDesign: DesignLayout | null;
  selectedElementId: string | null;
  onLayoutSelect: (layout: DesignLayout | null) => void;
  onAddElement: (elementSchema: Omit<DesignElement, 'id'>) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (element: DesignElement) => void;
  onDeleteElement: (id: string) => void;
}

export function LeftPanel({
  currentDesign,
  selectedElementId,
  onLayoutSelect,
  onAddElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
}: LeftPanelProps) {
  return (
    <aside className="w-[360px] border-r bg-card flex flex-col h-full min-h-0 overflow-hidden shrink-0 select-none">
      <Tabs defaultValue="ai-tool" className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <TabsList className="grid w-full grid-cols-4 rounded-none border-b shrink-0 h-12 bg-muted/40 p-1">
          <TabsTrigger value="ai-tool" className="text-xs gap-1 data-[state=active]:bg-background">
            <Wand2 className="h-3.5 w-3.5 text-primary" />
            <span>AI</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs gap-1 data-[state=active]:bg-background">
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="elements" className="text-xs gap-1 data-[state=active]:bg-background">
            <Puzzle className="h-3.5 w-3.5" />
            <span>Elements</span>
          </TabsTrigger>
          <TabsTrigger value="layers" className="text-xs gap-1 data-[state=active]:bg-background">
            <Layers className="h-3.5 w-3.5" />
            <span>Layers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-tool" className="flex-1 min-h-0 overflow-y-auto mt-0 focus-visible:outline-none">
          <AiDesignTool onLayoutSelect={onLayoutSelect} />
        </TabsContent>
        <TabsContent value="templates" className="flex-1 min-h-0 overflow-y-auto mt-0 focus-visible:outline-none">
          <TemplateLibrary onLayoutSelect={onLayoutSelect} />
        </TabsContent>
        <TabsContent value="elements" className="flex-1 min-h-0 overflow-y-auto mt-0 focus-visible:outline-none">
          <ElementLibrary onAddElement={onAddElement} />
        </TabsContent>
        <TabsContent value="layers" className="flex-1 min-h-0 overflow-y-auto mt-0 focus-visible:outline-none">
          <LayersPanel
            currentDesign={currentDesign}
            selectedElementId={selectedElementId}
            onSelectElement={onSelectElement}
            onUpdateElement={onUpdateElement}
            onDeleteElement={onDeleteElement}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
