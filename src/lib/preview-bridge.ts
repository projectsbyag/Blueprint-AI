import type { DesignLayout } from '@/types/blueprint';

const PREVIEW_DRAFT_STORAGE_KEY = 'blueprint_pending_studio_draft';

export function savePendingStudioDraft(layout: DesignLayout): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREVIEW_DRAFT_STORAGE_KEY, JSON.stringify(layout));
  } catch (err) {
    console.warn('Unable to save preview draft to localStorage:', err);
  }
}

export function consumePendingStudioDraft(): DesignLayout | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PREVIEW_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    localStorage.removeItem(PREVIEW_DRAFT_STORAGE_KEY);
    return JSON.parse(raw) as DesignLayout;
  } catch (err) {
    console.warn('Unable to read preview draft from localStorage:', err);
    return null;
  }
}
