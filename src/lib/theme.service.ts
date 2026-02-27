import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  
  private readonly STORAGE_KEY = 'angular21-ui-theme';
  
  readonly theme = signal<Theme>('system');
  readonly actualTheme = signal<'dark' | 'light'>('light');

  constructor() {
    // Initialize theme from localStorage (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
      if (stored && this.isValidTheme(stored)) {
        this.theme.set(stored);
      }
    }

    // Apply theme whenever it changes
    effect(() => {
      this.applyTheme(this.theme());
    });

    // Listen for system theme changes (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this.theme() === 'system') {
          this.applyTheme('system');
        }
      });
    }
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    
    // Save to localStorage (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }

  toggleTheme(): void {
    const current = this.actualTheme();
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(theme: Theme): void {
    const root = this.document.documentElement;
    const actualTheme = this.getActualTheme(theme);
    
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
    this.actualTheme.set(actualTheme);
  }

  private getActualTheme(theme: Theme): 'dark' | 'light' {
    if (theme === 'system') {
      // Check system preference (only in browser)
      if (isPlatformBrowser(this.platformId)) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      // Default to light for SSR
      return 'light';
    }
    return theme;
  }

  private isValidTheme(theme: string): theme is Theme {
    return ['dark', 'light', 'system'].includes(theme);
  }
}
