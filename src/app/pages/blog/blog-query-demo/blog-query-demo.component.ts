import { Component, ChangeDetectionStrategy, inject, computed, signal, effect, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { BlogService, BlogQueryKeys } from '../blog.service';
import { BlogSearchParams } from '../blog.model';
import { JsonPipe } from '@angular/common';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-blog-query-demo',
  standalone: true,
  imports: [RouterLink, JsonPipe, PaginationComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">TanStack Query Demo</h1>
        <p class="text-gray-600 mb-6">This component demonstrates proper TanStack Query usage in Angular.</p>
        
        <div class="flex gap-4 mb-8">
          <button 
            (click)="refreshPosts()" 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Refresh Posts
          </button>
          <button 
            (click)="prefetchNextPage()" 
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Prefetch Next Page
          </button>
          <a 
            routerLink="/blog" 
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
            Back to Blog
          </a>
        </div>
      </div>

      <!-- Posts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Posts List -->
        <div>
          <h2 class="text-2xl font-semibold mb-4">Posts List</h2>
          
          @if (postsQuery.isLoading()) {
            <div class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p class="mt-2 text-gray-600">Loading posts...</p>
            </div>
          } @else if (postsQuery.error()) {
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-800">Error: {{ postsQuery.error()?.message }}</p>
            </div>
          } @else if (postsQuery.data()) {
            <div class="space-y-4">
              @for (post of postsQuery.data()!.posts; track post.id) {
                <article class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 class="text-xl font-semibold mb-2">
                    <a 
                      [routerLink]="['/blog', post.slug]" 
                      class="text-blue-600 hover:text-blue-800">
                      {{ post.title }}
                    </a>
                  </h3>
                  <p class="text-gray-600 mb-3">{{ post.excerpt }}</p>
                  <div class="flex justify-between items-center text-sm text-gray-500">
                    <span>By {{ post.author }}</span>
                    <span>{{ formatDate(post.publishedAt) }}</span>
                  </div>
                  <div class="mt-3 flex gap-2">
                    @for (tag of post.tags; track tag) {
                      <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {{ tag }}
                      </span>
                    }
                  </div>
                </article>
              }
              
              <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600">
                  Total: {{ postsQuery.data()!.total }} posts | 
                  Page: {{ postsQuery.data()!.page }} | 
                  Page Size: {{ postsQuery.data()!.pageSize }}
                </p>
              </div>

              <!-- Reusable Pagination Component -->
              @if (postsQuery.data()) {
                <app-pagination
                  [currentPage]="postsQuery.data()!.page"
                  [totalItems]="postsQuery.data()!.total"
                  [pageSize]="postsQuery.data()!.pageSize"
                  [availablePageSizes]="[2, 5, 10, 20]"
                  [showResultsInfo]="true"
                  [showPageSizeSelector]="true"
                  [showFirstLast]="true"
                  [showJumpToPage]="true"
                  (pageChange)="onPageChange($event)"
                  (pageSizeChange)="onPageSizeChange($event)"
                />
              }
            </div>
          }
        </div>

        <!-- Tags and Authors -->
        <div class="space-y-8">
          <!-- Tags -->
          <div>
            <h2 class="text-2xl font-semibold mb-4">Tags</h2>
            
            @if (tagsQuery.isLoading()) {
              <div class="text-center py-4">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            } @else if (tagsQuery.data()) {
              <div class="flex flex-wrap gap-2">
                @for (tag of tagsQuery.data()!; track tag) {
                  <button 
                    (click)="filterByTag(tag)"
                    class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">
                    {{ tag }}
                  </button>
                }
              </div>
            }
          </div>

          <!-- Authors -->
          <div>
            <h2 class="text-2xl font-semibold mb-4">Authors</h2>
            
            @if (authorsQuery.isLoading()) {
              <div class="text-center py-4">
                <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            } @else if (authorsQuery.data()) {
              <div class="space-y-2">
                @for (author of authorsQuery.data()!; track author) {
                  <button 
                    (click)="filterByAuthor(author)"
                    class="block w-full text-left px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                    {{ author }}
                  </button>
                }
              </div>
            }
          </div>

          <!-- Query Status -->
          <div>
            <h2 class="text-2xl font-semibold mb-4">Query Status</h2>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Posts Status:</span>
                <span class="font-mono">{{ postsQuery.fetchStatus() }}</span>
              </div>
              <div class="flex justify-between">
                <span>Posts Data:</span>
                <span class="font-mono">{{ postsQuery.data() ? 'Available' : 'None' }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tags Status:</span>
                <span class="font-mono">{{ tagsQuery.fetchStatus() }}</span>
              </div>
              <div class="flex justify-between">
                <span>Authors Status:</span>
                <span class="font-mono">{{ authorsQuery.fetchStatus() }}</span>
              </div>
              <div class="flex justify-between">
                <span>Last Updated:</span>
                <span class="font-mono">{{ lastUpdated() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogQueryDemoComponent {
  private readonly blogService = inject(BlogService);

  // Search parameters as signals
  private readonly searchParams = signal<BlogSearchParams>({
    page: 1,
    pageSize: 2,
    search: '',
    tag: '',
    author: ''
  });

  // Reusable query options for consistency with service
  private readonly demoQueryOptions = {
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  };

  private readonly staticDataQueryOptions = {
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  };

  // Proper TanStack Query usage in field initializer context
  readonly postsQuery = injectQuery(() => ({
    ...this.demoQueryOptions,
    queryKey: BlogQueryKeys.postsList(this.searchParams()),
    queryFn: () => this.blogService['fetchBlogPosts'](this.searchParams())
  }));

  readonly tagsQuery = injectQuery(() => ({
    ...this.staticDataQueryOptions,
    queryKey: BlogQueryKeys.tags(),
    queryFn: () => this.blogService['fetchTags']()
  }));

  readonly authorsQuery = injectQuery(() => ({
    ...this.staticDataQueryOptions,
    queryKey: BlogQueryKeys.authors(),
    queryFn: () => this.blogService['fetchAuthors']()
  }));

  // Computed signal for last updated time
  readonly lastUpdated = computed(() => {
    const postsData = this.postsQuery.data();
    return postsData ? new Date().toLocaleTimeString() : 'Never';
  });

  // Public methods
  refreshPosts(): void {
    this.postsQuery.refetch();
  }

  prefetchNextPage(): void {
    const currentParams = this.searchParams();
    const nextPageParams = {
      ...currentParams,
      page: (currentParams.page || 1) + 1
    };
    
    this.blogService.prefetchPosts(nextPageParams);
  }

  filterByTag(tag: string): void {
    this.searchParams.update(params => ({
      ...params,
      tag: params.tag === tag ? '' : tag,
      page: 1 // Reset to first page when filtering
    }));
  }

  filterByAuthor(author: string): void {
    this.searchParams.update(params => ({
      ...params,
      author: params.author === author ? '' : author,
      page: 1 // Reset to first page when filtering
    }));
  }

  // Utility method
  readonly formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Pagination methods for reusable component
  readonly onPageChange = (page: number): void => {
    this.searchParams.update(params => ({
      ...params,
      page
    }));
  };

  readonly onPageSizeChange = (pageSize: number): void => {
    this.searchParams.update(params => ({
      ...params,
      pageSize,
      page: 1 // Reset to first page when changing page size
    }));
  };
}
