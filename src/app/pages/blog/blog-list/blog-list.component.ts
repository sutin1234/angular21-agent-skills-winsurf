import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, linkedSignal, input, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogService } from '../blog.service';
import { BlogPost, BlogSearchParams } from '../blog.model';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-blog-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-blog-list',
    '[class.loading]': 'loading()',
    '[attr.aria-busy]': 'loading()'
  },
  imports: [CommonModule, RouterLink, PaginationComponent],
  templateUrl: './blog-list.component.html'
})
export class BlogListComponent {
  private readonly blogService = inject(BlogService);
  private readonly destroyRef = inject(DestroyRef);
  readonly Math = Math; // Make Math available to template

  // Signal inputs for parent component configuration
  readonly initialSearchParams = input<Partial<BlogSearchParams>>({});
  readonly showSearch = input(true, { transform: (value: unknown) => Boolean(value) });
  readonly showFilters = input(true, { transform: (value: unknown) => Boolean(value) });
  readonly defaultPageSize = input(10, { transform: (value: unknown) => Number(value) });

  // Internal signals for dynamic state
  readonly currentPage = signal(1);
  readonly pageSize = signal(10);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly posts = signal<BlogPost[]>([]);
  readonly totalPosts = signal(0);
  readonly availableTags = signal<string[]>([]);
  readonly availableAuthors = signal<string[]>([]);

  // Search and filter signals - optimized with linkedSignal
  readonly searchQuery = linkedSignal(() => this.initialSearchParams()?.search ?? '');
  readonly selectedTag = linkedSignal(() => this.initialSearchParams()?.tag ?? '');
  readonly selectedAuthor = linkedSignal(() => this.initialSearchParams()?.author ?? '');

  // Memoized search params - optimized computed signal
  readonly searchParams = computed<BlogSearchParams>(() => ({
    page: this.currentPage(),
    pageSize: this.pageSize(),
    search: this.searchQuery() || undefined,
    tag: this.selectedTag() || undefined,
    author: this.selectedAuthor() || undefined,
    published: true
  }));

  // Optimized computed signals
  readonly hasPosts = computed(() => this.posts().length > 0);
  readonly hasNextPage = computed(() => {
    const page = this.currentPage();
    const pageSize = this.pageSize();
    const total = this.totalPosts();
    return page * pageSize < total;
  });
  readonly hasPrevPage = computed(() => this.currentPage() > 1);
  readonly totalPages = computed(() => 
    Math.ceil(this.totalPosts() / this.pageSize())
  );

  constructor() {
    // Load posts when search params change - optimized effect
    effect(() => {
      this.loadPosts();
    });

    // Load filters when component initializes - optimized effect
    effect(() => {
      this.loadFilters();
    });

    // Reset to first page when filters change - optimized effect
    effect(() => {
      const searchParams = this.searchParams();
      // Note: We'll handle page reset in the individual methods for simplicity
    });
  }

  // Search and filter methods - optimized
  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onTagChange(tag: string): void {
    this.selectedTag.set(tag);
  }

  onAuthorChange(author: string): void {
    this.selectedAuthor.set(author);
  }

  // Pagination methods - optimized
  goToPage(page: number | string): void {
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages()) {
      this.currentPage.set(pageNum);
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (this.hasPrevPage()) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  // Additional methods needed by template
  readonly visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2;
    
    const range: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (typeof i === 'number' && typeof l === 'number' && i - l === 2) {
          range.push(l + 1);
        } else if (typeof i === 'number' && typeof l === 'number' && i - l !== 1) {
          range.push('...');
        }
      }
      range.push(i);
      l = i as number;
    });

    return range;
  });

  readonly selectTag = (tag: string): void => {
    this.selectedTag.set(this.selectedTag() === tag ? '' : tag);
    this.currentPage.set(1);
  };

  readonly selectAuthor = (author: string): void => {
    this.selectedAuthor.set(author);
    this.currentPage.set(1);
  };

  readonly clearSearch = (): void => {
    this.searchQuery.set('');
    this.currentPage.set(1);
  };

  // Enhanced pagination methods
  readonly onPageChange = (page: number): void => {
    this.currentPage.set(page);
  };

  readonly onPageSizeChange = (newSize: number): void => {
    this.pageSize.set(newSize);
    this.currentPage.set(1); // Reset to first page when changing page size
  };

  readonly changePageSize = (newSize: string): void => {
    const size = parseInt(newSize, 10);
    if (size > 0) {
      this.onPageSizeChange(size);
    }
  };

  readonly jumpToPage = (pageString: string): void => {
    const page = parseInt(pageString, 10);
    if (!isNaN(page) && page >= 1 && page <= this.totalPages()) {
      this.onPageChange(page);
    }
  };

  // Track function for ngFor
  readonly trackTag = (index: number, tag: string) => tag;

  // Clear filters - optimized
  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedTag.set('');
    this.selectedAuthor.set('');
    this.currentPage.set(1);
  }

  // Data loading methods - using direct HTTP calls
  loadPosts(): void {
    this.loading.set(true);
    this.error.set(null);

    const params = this.searchParams();

    this.blogService.getBlogPostsDirect(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.posts.set(response.posts);
          this.totalPosts.set(response.total);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error.message);
          this.loading.set(false);
        }
      });
  }

  private loadFilters(): void {
    // Load available tags and authors using direct HTTP calls
    this.blogService.getTagsDirect()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tags) => {
          this.availableTags.set(tags);
        },
        error: (error) => {
          console.error('Failed to load tags:', error);
        }
      });

    this.blogService.getAuthorsDirect()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (authors) => {
          this.availableAuthors.set(authors);
        },
        error: (error) => {
          console.error('Failed to load authors:', error);
        }
      });
  }

  // Utility methods - memoized
  readonly formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  readonly getReadingTimeText = (minutes: number): string => {
    return `${minutes} min read`;
  };

  // Optimized pagination generation
  readonly getPaginationPages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const delta = 2; // Number of pages to show around current page
    
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots.filter(page => page !== '...') as number[];
  });
}
