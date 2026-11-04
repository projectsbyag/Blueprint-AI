'use client';

import { useState } from 'react';
import {
  Download,
  Zap,
  LogOut,
  LogIn,
  UserPlus,
  Image as ImageIcon,
  Layers,
  ChevronDown,
  FileJson,
  FileText,
  Loader2,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import type { DesignLayout, DesignElement } from '@/types/blueprint';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';

interface AppHeaderProps {
  currentDesign?: DesignLayout | null;
  isRightPanelCollapsed?: boolean;
  onToggleRightPanel?: () => void;
  isLeftPanelCollapsed?: boolean;
  onToggleLeftPanel?: () => void;
}

async function renderSlideToDataUrl(elements: DesignElement[], bgColor: string): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context');

  // 1. Draw Background
  ctx.fillStyle = bgColor || '#FFFFFF';
  ctx.fillRect(0, 0, 1000, 1000);

  // 2. Sort elements by zIndex
  const sorted = [...elements].sort(
    (a, b) => (Number(a.style?.zIndex) || 1) - (Number(b.style?.zIndex) || 1)
  );

  for (const el of sorted) {
    ctx.save();
    ctx.translate(el.position.x, el.position.y);

    if (el.style?.rotation) {
      ctx.rotate((Number(el.style.rotation) * Math.PI) / 180);
    }
    if (typeof el.style?.opacity === 'number') {
      ctx.globalAlpha = el.style.opacity;
    }

    if (el.type === 'shape') {
      ctx.fillStyle = (el.style?.backgroundColor as string) || '#E2E8F0';
      const rad = parseFloat(el.style?.borderRadius as string) || 0;
      if (rad > 0 && typeof (ctx as any).roundRect === 'function') {
        ctx.beginPath();
        (ctx as any).roundRect(0, 0, el.size.width, el.size.height, Math.min(rad, el.size.height / 2));
        ctx.fill();
        if (el.style?.border) {
          ctx.strokeStyle = (el.style?.borderColor as string) || '#FFFFFF';
          ctx.stroke();
        }
      } else {
        ctx.fillRect(0, 0, el.size.width, el.size.height);
      }
    } else if (el.type === 'image' && el.source) {
      try {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = el.source!;
        });
        ctx.drawImage(img, 0, 0, el.size.width, el.size.height);
      } catch {
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(0, 0, el.size.width, el.size.height);
      }
    } else if (el.type === 'text' && el.content) {
      ctx.fillStyle = (el.style?.color as string) || '#0F172A';
      const weight = el.style?.fontWeight || 'bold';
      const size = el.style?.fontSize ? parseFloat(el.style.fontSize as string) : 24;
      const family = el.style?.fontFamily || 'sans-serif';
      ctx.font = `${weight} ${size}px ${family}`;
      ctx.textBaseline = 'top';

      if (el.style?.textAlign === 'center') {
        ctx.textAlign = 'center';
        ctx.fillText(el.content, el.size.width / 2, (el.size.height - size) / 2);
      } else {
        ctx.textAlign = 'left';
        ctx.fillText(el.content, 4, (el.size.height - size) / 2);
      }
    }

    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}

function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function AppHeader({
  currentDesign,
  isRightPanelCollapsed,
  onToggleRightPanel,
  isLeftPanelCollapsed,
  onToggleLeftPanel,
}: AppHeaderProps) {
  const { toast } = useToast();
  const { user, logout, loading, isDemoMode } = useAuth();
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  const totalPages = currentDesign?.pages?.length || 1;
  const activeSlideNum = (currentDesign?.activePageIndex ?? 0) + 1;
  const baseSlug = currentDesign?.description?.replace(/\s+/g, '_').toLowerCase() || 'blueprint_carousel';

  const handleDownloadJSON = () => {
    if (!currentDesign) {
      toast({
        title: 'No Design to Download',
        description: 'There is no active design to download.',
        variant: 'destructive',
      });
      return;
    }
    try {
      const designJson = JSON.stringify(currentDesign, null, 2);
      const blob = new Blob([designJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `${baseSlug}.json`);
      URL.revokeObjectURL(url);
      toast({
        title: 'Project Downloaded',
        description: `Exported full carousel (${totalPages} ${totalPages === 1 ? 'slide' : 'slides'}) as JSON.`,
      });
    } catch (error) {
      console.error('Error downloading design:', error);
      toast({
        title: 'Download Failed',
        description: 'Could not download the design.',
        variant: 'destructive',
      });
    }
  };

  const handleExportActiveSlide = async () => {
    if (!currentDesign) return;
    setIsExporting(true);
    toast({
      title: `Exporting Slide ${activeSlideNum}...`,
      description: 'Rendering 1000×1000 high-resolution graphic.',
    });

    try {
      const dataUrl = await renderSlideToDataUrl(
        currentDesign.elements || [],
        currentDesign.canvasBackgroundColor || '#FFFFFF'
      );
      triggerDownload(dataUrl, `${baseSlug}_slide_${activeSlideNum}.png`);
      toast({
        title: 'Export Complete!',
        description: `Slide ${activeSlideNum} saved as high-res PNG.`,
      });
    } catch (err) {
      console.error('PNG export error:', err);
      toast({
        title: 'Export Failed',
        description: 'Could not export slide to image.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAllSlides = async () => {
    if (!currentDesign || !currentDesign.pages || currentDesign.pages.length === 0) {
      handleExportActiveSlide();
      return;
    }

    setIsExporting(true);
    const pages = currentDesign.pages;
    toast({
      title: 'Exporting Carousel PNGs...',
      description: `Rendering all ${pages.length} slides sequentially...`,
    });

    try {
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const dataUrl = await renderSlideToDataUrl(
          page.elements || [],
          page.canvasBackgroundColor || currentDesign.canvasBackgroundColor || '#FFFFFF'
        );
        triggerDownload(dataUrl, `${baseSlug}_slide_${i + 1}.png`);
        if (i < pages.length - 1) {
          await new Promise((r) => setTimeout(r, 350));
        }
      }

      toast({
        title: 'Carousel Export Complete!',
        description: `Successfully downloaded all ${pages.length} slides as PNG images.`,
      });
    } catch (err) {
      console.error('Carousel export error:', err);
      toast({
        title: 'Export Failed',
        description: 'Could not export all slides.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // PDF Export Handlers
  const handleExportSlidePDF = async () => {
    if (!currentDesign) return;
    setIsExporting(true);
    toast({
      title: `Compiling Slide ${activeSlideNum} PDF...`,
      description: 'Rendering high-resolution document...',
    });

    try {
      const dataUrl = await renderSlideToDataUrl(
        currentDesign.elements || [],
        currentDesign.canvasBackgroundColor || '#FFFFFF'
      );
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1000, 1000],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 1000, 1000);
      pdf.save(`${baseSlug}_slide_${activeSlideNum}.pdf`);
      toast({
        title: 'PDF Export Complete!',
        description: `Slide ${activeSlideNum} saved as PDF document.`,
      });
    } catch (err) {
      console.error('PDF export error:', err);
      toast({
        title: 'PDF Export Failed',
        description: 'Could not export slide to PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAllSlidesPDF = async () => {
    if (!currentDesign || !currentDesign.pages || currentDesign.pages.length === 0) {
      handleExportSlidePDF();
      return;
    }

    setIsExporting(true);
    const pages = currentDesign.pages;
    toast({
      title: 'Compiling Multi-Page PDF...',
      description: `Merging all ${pages.length} carousel slides into PDF...`,
    });

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1000, 1000],
      });

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) {
          pdf.addPage([1000, 1000], 'portrait');
        }
        const page = pages[i];
        const dataUrl = await renderSlideToDataUrl(
          page.elements || [],
          page.canvasBackgroundColor || currentDesign.canvasBackgroundColor || '#FFFFFF'
        );
        pdf.addImage(dataUrl, 'PNG', 0, 0, 1000, 1000);
      }

      pdf.save(`${baseSlug}_presentation.pdf`);
      toast({
        title: 'Multi-Page PDF Ready!',
        description: `Successfully compiled ${pages.length} slides into a single PDF document.`,
      });
    } catch (err) {
      console.error('Multi-page PDF export error:', err);
      toast({
        title: 'PDF Export Failed',
        description: 'Could not generate multi-page PDF.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: 'Logged Out', description: 'You have been logged out.' });
      router.push('/');
    } catch {
      toast({ title: 'Logout Failed', description: 'Could not log out.', variant: 'destructive' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" aria-label="Go to Homepage">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-headline text-foreground leading-none">Blueprint</h1>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                AI Graphics & Carousel Studio
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {currentDesign !== undefined && (
            <>
              {/* Export Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={isExporting}
                    className="gap-1.5 shadow-sm text-xs font-semibold"
                  >
                    {isExporting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    <span>Export</span>
                    {totalPages > 1 && (
                      <span className="bg-primary-foreground/20 text-[10px] px-1 py-0.2 rounded font-bold">
                        {totalPages}
                      </span>
                    )}
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="text-xs">Document & Image Export</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* PDF Export Section */}
                  <DropdownMenuItem onClick={handleExportSlidePDF} className="text-xs cursor-pointer">
                    <FileText className="mr-2 h-4 w-4 text-rose-500" />
                    <div className="flex flex-col">
                      <span className="font-medium">Export Current Slide (PDF)</span>
                      <span className="text-[10px] text-muted-foreground">High-res print-ready PDF</span>
                    </div>
                  </DropdownMenuItem>

                  {totalPages > 1 && (
                    <DropdownMenuItem onClick={handleExportAllSlidesPDF} className="text-xs cursor-pointer">
                      <FileText className="mr-2 h-4 w-4 text-rose-500 font-bold" />
                      <div className="flex flex-col">
                        <span className="font-medium text-rose-600 dark:text-rose-400">
                          Export All {totalPages} Slides (Multi-Page PDF)
                        </span>
                        <span className="text-[10px] text-muted-foreground">Single document for LinkedIn / Deck</span>
                      </div>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {/* PNG Image Export Section */}
                  <DropdownMenuItem onClick={handleExportActiveSlide} className="text-xs cursor-pointer">
                    <ImageIcon className="mr-2 h-4 w-4 text-blue-500" />
                    <span>Export Current Slide (PNG)</span>
                  </DropdownMenuItem>

                  {totalPages > 1 && (
                    <DropdownMenuItem onClick={handleExportAllSlides} className="text-xs cursor-pointer font-medium">
                      <Layers className="mr-2 h-4 w-4 text-blue-500" />
                      <span>Export All {totalPages} Slides (PNGs)</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDownloadJSON} className="text-xs cursor-pointer">
                    <FileJson className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Download Project (JSON)</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={handleDownloadJSON}
                size="sm"
                className="gap-1.5 text-xs hidden sm:flex"
              >
                <Download className="h-3.5 w-3.5" />
                Save JSON
              </Button>

              {/* Panel Toggle Toolbar in AppHeader */}
              <div className="flex items-center gap-1 border-l pl-2 ml-1">
                {onToggleLeftPanel && (
                  <Button
                    variant={isLeftPanelCollapsed ? 'default' : 'ghost'}
                    size="sm"
                    onClick={onToggleLeftPanel}
                    className="h-8 px-2 text-xs gap-1.5"
                    title={isLeftPanelCollapsed ? 'Expand Toolbox Panel' : 'Collapse Toolbox Panel'}
                  >
                    {isLeftPanelCollapsed ? (
                      <PanelLeftOpen className="h-3.5 w-3.5" />
                    ) : (
                      <PanelLeftClose className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="hidden xl:inline">Tools</span>
                  </Button>
                )}

                {onToggleRightPanel && (
                  <Button
                    variant={isRightPanelCollapsed ? 'default' : 'outline'}
                    size="sm"
                    onClick={onToggleRightPanel}
                    className="h-8 px-2.5 text-xs gap-1.5 shadow-xs"
                    title={isRightPanelCollapsed ? 'Open Properties Inspector (or click the vertical sidebar button)' : 'Collapse Properties Inspector'}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>{isRightPanelCollapsed ? 'Open Properties' : 'Properties'}</span>
                  </Button>
                )}
              </div>
            </>
          )}

          {!loading && user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <span className="text-xs text-muted-foreground hidden md:inline max-w-[140px] truncate">
                {user.email} {isDemoMode && <span className="text-[10px] font-semibold text-primary">(Guest)</span>}
              </span>
              <Button variant="ghost" onClick={handleLogout} size="sm" className="h-8 text-xs">
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : !loading ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild size="sm" className="text-xs">
                <Link href="/login">
                  <LogIn className="mr-1.5 h-3.5 w-3.5" />
                  Login
                </Link>
              </Button>
              <Button variant="default" asChild size="sm" className="text-xs">
                <Link href="/signup">
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Sign Up
                </Link>
              </Button>
            </div>
          ) : (
            <div className="h-8 w-20 animate-pulse bg-muted rounded-md"></div>
          )}
        </div>
      </div>
    </header>
  );
}
