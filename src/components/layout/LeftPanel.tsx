'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateLibrary } from '@/components/tools/TemplateLibrary';
import { ElementLibrary } from '@/components/tools/ElementLibrary';
import { LayersPanel } from '@/components/tools/LayersPanel';
import type { DesignLayout, DesignElement } from '@/types/blueprint';
import {
  LayoutDashboard,
  Puzzle,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface LeftPanelProps {
  currentDesign: DesignLayout | null;
  selectedElementId: string | null;
  selectedElementIds?: string[];
  onLayoutSelect: (layout: DesignLayout | null) => void;
  onAddElement: (elementSchema: Omit<DesignElement, 'id'>) => void;
  onSelectElement: (id: string | null) => void;
  onSelectElements?: (ids: string[]) => void;
  onToggleSelectElement?: (id: string) => void;
  onUpdateElement: (element: DesignElement) => void;
  onDeleteElement: (id: string) => void;
  // Resizing & Collapsing
  width?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function LeftPanel({
  currentDesign,
  selectedElementId,
  selectedElementIds = [],
  onLayoutSelect,
  onAddElement,
  onSelectElement,
  onSelectElements,
  onToggleSelectElement,
  onUpdateElement,
  onDeleteElement,
  width = 360,
  isCollapsed = false,
  onToggleCollapse,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState('templates');

  // When collapsed: show slim 48px icon rail
  if (isCollapsed) {
    return (
      <aside className="w-[50px] border-r bg-card flex flex-col items-center py-2 h-full min-h-0 shrink-0 select-none z-10 transition-all duration-200">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="h-8 w-8 text-primary hover:bg-primary/10 mb-3"
                title="Expand Side Panel"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand Panel</TooltipContent>
          </Tooltip>

          <div className="flex flex-col gap-2 w-full px-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === 'templates' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => {
                    setActiveTab('templates');
                    onToggleCollapse?.();
                  }}
                  className="h-9 w-9 rounded-lg"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Templates</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === 'elements' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => {
                    setActiveTab('elements');
                    onToggleCollapse?.();
                  }}
                  className="h-9 w-9 rounded-lg"
                >
                  <Puzzle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Elements</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === 'layers' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => {
                    setActiveTab('layers');
                    onToggleCollapse?.();
                  }}
                  className="h-9 w-9 rounded-lg"
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Layers ({currentDesign?.elements.length || 0})</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </aside>
    );
  }

  return (
    <aside
      style={{ width: `${width}px` }}
      className="border-r bg-card flex flex-col h-full min-h-0 overflow-hidden shrink-0 select-none relative transition-all duration-75"
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 min-h-0 overflow-hidden"
      >
        <div className="flex items-center border-b shrink-0 h-12 bg-muted/40 pr-1">
          <TabsList className="grid flex-1 grid-cols-3 rounded-none bg-transparent p-1 h-full">
            <TabsTrigger value="templates" className="text-xs gap-1.5 data-[state=active]:bg-background font-semibold">
              <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="elements" className="text-xs gap-1.5 data-[state=active]:bg-background font-semibold">
              <Puzzle className="h-3.5 w-3.5" />
              <span>Elements</span>
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-xs gap-1.5 data-[state=active]:bg-background font-semibold">
              <Layers className="h-3.5 w-3.5" />
              <span>Layers</span>
            </TabsTrigger>
          </TabsList>

          {/* Collapse Button */}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 ml-1"
              title="Collapse Left Panel (larger canvas area)"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

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
            selectedElementIds={selectedElementIds}
            onSelectElement={onSelectElement}
            onSelectElements={onSelectElements}
            onToggleSelectElement={onToggleSelectElement}
            onUpdateElement={onUpdateElement}
            onDeleteElement={onDeleteElement}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
