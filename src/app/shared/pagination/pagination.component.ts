import { 
  Component, 
  ChangeDetectionStrategy, 
  input, 
  output, 
  computed, 
  signal 
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'pagination',
    'role': 'navigation',
    '[attr.aria-label]': 'ariaLabel()'
  },
  template: `
    <!-- Results Info -->
    @if (showResultsInfo()) {
      <div class="pagination-info text-sm text-gray-600 mb-4">
        Showing 
        <span class="font-medium text-gray-900">
          {{ startItem() }}-{{ endItem() }}
        </span>
        of 
        <span class="font-medium text-gray-900">{{ totalItems() }}</span>
        results
      </div>
    }

    <!-- Page Size Selector -->
    @if (showPageSizeSelector()) {
      <div class="pagination-page-size flex items-center gap-2 mb-4">
        <label for="page-size-{{ uniqueId() }}" class="text-sm text-gray-600">
          Show:
        </label>
        <select
          id="page-size-{{ uniqueId() }}"
          [value]="pageSize()"
          (change)="onPageSizeChange($any($event.target).value)"
          class="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          @for (size of availablePageSizes(); track size) {
            <option [value]="size">{{ size }}</option>
          }
        </select>
        <span class="text-sm text-gray-600">per page</span>
      </div>
    }

    <!-- Pagination Controls -->
    @if (totalPages() > 1) {
      <div class="pagination-controls flex justify-center items-center space-x-1">
        <!-- First Page -->
        @if (showFirstLast()) {
          <button
            [disabled]="!hasPrevPage()"
            (click)="goToPage(1)"
            [class]="getButtonClass(!hasPrevPage())"
            title="First page"
            aria-label="Go to first page"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            </svg>
          </button>
        }

        <!-- Previous Button -->
        <button
          [disabled]="!hasPrevPage()"
          (click)="prevPage()"
          [class]="getButtonClass(!hasPrevPage())"
          title="Previous page"
          aria-label="Go to previous page"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <!-- Page Numbers -->
        <div class="pagination-pages flex items-center space-x-1">
          @for (pageNum of visiblePages(); track pageNum) {
            @if (pageNum === '...') {
              <span class="px-3 py-2 text-gray-500">...</span>
            } @else {
              <button
                (click)="goToPage(pageNum)"
                [class]="getPageButtonClass(typeof pageNum === 'number' ? pageNum : 0)"
                [attr.aria-current]="pageNum === currentPage() ? 'page' : null"
                [attr.aria-label]="getPageAriaLabel(typeof pageNum === 'number' ? pageNum : 0)"
              >
                {{ pageNum }}
              </button>
            }
          }
        </div>

        <!-- Next Button -->
        <button
          [disabled]="!hasNextPage()"
          (click)="nextPage()"
          [class]="getButtonClass(!hasNextPage())"
          title="Next page"
          aria-label="Go to next page"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Last Page -->
        @if (showFirstLast()) {
          <button
            [disabled]="!hasNextPage()"
            (click)="goToPage(totalPages())"
            [class]="getButtonClass(!hasNextPage())"
            title="Last page"
            aria-label="Go to last page"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
            </svg>
          </button>
        }
      </div>
    }

    <!-- Quick Jump to Page -->
    @if (showJumpToPage() && totalPages() > 1) {
      <div class="pagination-jump flex justify-center items-center mt-4 gap-2">
        <label for="jump-to-page-{{ uniqueId() }}" class="text-sm text-gray-600">
          Go to page:
        </label>
        <input
          id="jump-to-page-{{ uniqueId() }}"
          type="number"
          [min]="1"
          [max]="totalPages()"
          [value]="currentPage()"
          (change)="onJumpToPage($any($event.target).value)"
          class="w-20 px-3 py-1 border border-gray-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span class="text-sm text-gray-600">of {{ totalPages() }}</span>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    .pagination-controls {
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    button:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .pagination-pages {
      flex-wrap: wrap;
    }

    @media (max-width: 640px) {
      .pagination-controls {
        font-size: 0.875rem;
      }
      
      button {
        padding: 0.5rem 0.75rem;
      }
    }
  `]
})
export class PaginationComponent {
  // Required inputs
  readonly currentPage = input.required<number>();
  readonly totalItems = input.required<number>();
  readonly pageSize = input.required<number>();

  // Optional inputs with defaults
  readonly ariaLabel = input('Pagination navigation');
  readonly showResultsInfo = input(true);
  readonly showPageSizeSelector = input(true);
  readonly showFirstLast = input(true);
  readonly showJumpToPage = input(true);
  readonly availablePageSizes = input([5, 10, 20, 50]);
  readonly maxVisiblePages = input(10);

  // Outputs
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  // Unique ID for form elements
  private readonly uniqueIdValue = signal(Math.random().toString(36).substr(2, 9));
  readonly uniqueId = computed(() => this.uniqueIdValue());

  // Computed properties
  readonly totalPages = computed(() => {
    const total = this.totalItems();
    const size = this.pageSize();
    return Math.max(1, Math.ceil(total / size));
  });

  readonly hasNextPage = computed(() => 
    this.currentPage() < this.totalPages()
  );

  readonly hasPrevPage = computed(() => 
    this.currentPage() > 1
  );

  readonly startItem = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    return this.totalItems() === 0 ? 0 : (page - 1) * size + 1;
  });

  readonly endItem = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const total = this.totalItems();
    return Math.min(page * size, total);
  });

  readonly visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = this.maxVisiblePages();
    
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const delta = Math.floor(maxVisible / 2);
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

  // Button styling methods
  readonly getButtonClass = (disabled: boolean) => 
    disabled 
      ? 'p-2 text-gray-400 cursor-not-allowed rounded-lg transition-colors duration-200'
      : 'p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200';

  readonly getPageButtonClass = (pageNum: number) => 
    pageNum === this.currentPage()
      ? 'px-4 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm'
      : 'px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium';

  readonly getPageAriaLabel = (pageNum: number) => 
    pageNum === this.currentPage()
      ? `Current page, page ${pageNum}`
      : `Go to page ${pageNum}`;

  // Event handlers
  readonly goToPage = (page: number | string): void => {
    const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages() && pageNum !== this.currentPage()) {
      this.pageChange.emit(pageNum);
    }
  };

  readonly nextPage = (): void => {
    if (this.hasNextPage()) {
      this.goToPage(this.currentPage() + 1);
    }
  };

  readonly prevPage = (): void => {
    if (this.hasPrevPage()) {
      this.goToPage(this.currentPage() - 1);
    }
  };

  readonly onPageSizeChange = (newSize: string): void => {
    const size = parseInt(newSize, 10);
    if (size > 0 && size !== this.pageSize()) {
      this.pageSizeChange.emit(size);
    }
  };

  readonly onJumpToPage = (pageString: string): void => {
    this.goToPage(pageString);
  };
}
