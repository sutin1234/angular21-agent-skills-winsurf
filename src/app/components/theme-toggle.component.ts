import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../lib/theme.service';

@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-theme-toggle' },
  imports: [CommonModule],
  template: `
    <button 
      type="button" 
      class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
      (click)="toggleTheme()"
      [attr.aria-label]="ariaLabel()"
    >
      @if (isDark()) {
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      } @else {
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      }
    </button>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly isDark = computed(() => this.themeService.actualTheme() === 'dark');
  readonly ariaLabel = computed(() => 
    this.isDark() ? 'Switch to light mode' : 'Switch to dark mode'
  );

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
