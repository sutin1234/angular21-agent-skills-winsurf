import { Component, signal, inject, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../components/theme-toggle.component';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeToggleComponent],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar implements OnDestroy {
  private readonly router = inject(Router);

  // Signal for dropdown state - public for template access
  isDropdownOpen = signal(false);

  constructor() {
    // Close dropdown when navigating away
    effect(() => {
      this.router.events.subscribe(() => {
        this.isDropdownOpen.set(false);
      });
    });

    // Close dropdown when clicking outside
    effect((onCleanup) => {
      if (this.isDropdownOpen()) {
        document.addEventListener('click', this.handleDocumentClick);
        onCleanup(() => {
          document.removeEventListener('click', this.handleDocumentClick);
        });
      }
    });
  }

  // Toggle dropdown - public method for template access
  toggleDropdown(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  // Close dropdown - public method for template access
  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  // Handle clicks outside dropdown
  private handleDocumentClick = (event: MouseEvent): void => {
    const target = event.target as Element;
    const dropdown = target.closest('.dropdown');
    
    if (!dropdown) {
      this.closeDropdown();
    }
  };

  // Cleanup on destroy
  ngOnDestroy(): void {
    this.closeDropdown();
  }
}
