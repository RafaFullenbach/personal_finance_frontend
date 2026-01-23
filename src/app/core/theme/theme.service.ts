import { Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'pf-theme';

  readonly theme = signal<Theme>('light');

  init() {
    const saved =
      (localStorage.getItem(this.STORAGE_KEY) as Theme | null) ?? null;
    const prefersDark =
      window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

    const initial: Theme = saved ?? (prefersDark ? 'dark' : 'light');
    this.set(initial);
  }

  toggle() {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme) {
    this.theme.set(theme);

    const root = document.documentElement; // <html>
    root.classList.toggle('dark', theme === 'dark');

    localStorage.setItem(this.STORAGE_KEY, theme);
  }
}
