import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, timeout, catchError, map, firstValueFrom } from 'rxjs';
import { injectQuery, injectMutation, injectQueryClient } from '@tanstack/angular-query-experimental';
import { BlogPost, BlogPostCreateRequest, BlogPostResponse, BlogListResponse, BlogSearchParams } from './blog.model';

// Query Key Factory for consistent key structure
export class BlogQueryKeys {
  static readonly all = ['blog'] as const;
  static readonly posts = () => [...BlogQueryKeys.all, 'posts'] as const;
  static readonly post = (slug: string) => [...BlogQueryKeys.posts(), slug] as const;
  static readonly postsList = (params: BlogSearchParams) => [...BlogQueryKeys.posts(), 'list', params] as const;
  static readonly tags = () => [...BlogQueryKeys.all, 'tags'] as const;
  static readonly authors = () => [...BlogQueryKeys.all, 'authors'] as const;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly queryClient = injectQueryClient();
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/posts';

  // Reusable query options for different query types
  private readonly defaultQueryOptions = {
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  };

  private readonly postsQueryOptions = {
    ...this.defaultQueryOptions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  };

  private readonly postQueryOptions = {
    ...this.defaultQueryOptions,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false // Don't refetch individual posts on window focus
  };

  private readonly staticDataQueryOptions = {
    ...this.defaultQueryOptions,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    refetchOnWindowFocus: false
  };

  // Get all blog posts with pagination and filtering using TanStack Query
  getBlogPosts(params: BlogSearchParams = {}) {
    return injectQuery(() => ({
      ...this.postsQueryOptions,
      queryKey: BlogQueryKeys.postsList(params),
      queryFn: () => this.fetchBlogPosts(params)
    }));
  }

  // Get a single blog post by slug using TanStack Query
  getBlogPost(slug: string) {
    return injectQuery(() => ({
      ...this.postQueryOptions,
      queryKey: BlogQueryKeys.post(slug),
      queryFn: () => this.fetchBlogPost(slug),
      enabled: !!slug
    }));
  }

  // Get all unique tags using TanStack Query
  getTags() {
    return injectQuery(() => ({
      ...this.staticDataQueryOptions,
      queryKey: BlogQueryKeys.tags(),
      queryFn: () => this.fetchTags()
    }));
  }

  // Get all unique authors using TanStack Query
  getAuthors() {
    return injectQuery(() => ({
      ...this.staticDataQueryOptions,
      queryKey: BlogQueryKeys.authors(),
      queryFn: () => this.fetchAuthors()
    }));
  }

  // Mutation for creating blog posts with cache invalidation
  createBlogPostMutation() {
    return injectMutation(() => ({
      mutationFn: (post: BlogPostCreateRequest) => this.createBlogPostPromise(post),
      onSuccess: () => {
        // Invalidate posts list to refetch
        this.queryClient.invalidateQueries({ queryKey: BlogQueryKeys.posts() });
      },
      onError: (error) => {
        console.error('Failed to create blog post:', error);
      }
    }));
  }

  // Mutation for updating blog posts with cache invalidation
  updateBlogPostMutation() {
    return injectMutation(() => ({
      mutationFn: ({ id, post }: { id: string; post: Partial<BlogPostCreateRequest> & { slug?: string } }) => 
        this.updateBlogPostPromise(id, post),
      onSuccess: (_, variables) => {
        // Invalidate both posts list and specific post
        this.queryClient.invalidateQueries({ queryKey: BlogQueryKeys.posts() });
        if (variables.post.slug) {
          this.queryClient.invalidateQueries({ queryKey: BlogQueryKeys.post(variables.post.slug) });
        }
      },
      onError: (error) => {
        console.error('Failed to update blog post:', error);
      }
    }));
  }

  // Mutation for deleting blog posts with cache invalidation
  deleteBlogPostMutation() {
    return injectMutation(() => ({
      mutationFn: (id: string) => this.deleteBlogPostPromise(id),
      onSuccess: () => {
        // Invalidate posts list to refetch
        this.queryClient.invalidateQueries({ queryKey: BlogQueryKeys.posts() });
      },
      onError: (error) => {
        console.error('Failed to delete blog post:', error);
      }
    }));
  }

  // Prefetch posts for better UX
  prefetchPosts(params: BlogSearchParams = {}): void {
    this.queryClient.prefetchQuery({
      queryKey: BlogQueryKeys.postsList(params),
      queryFn: () => this.fetchBlogPosts(params),
      staleTime: 5 * 60 * 1000
    });
  }

  // Prefetch single post
  prefetchPost(slug: string): void {
    this.queryClient.prefetchQuery({
      queryKey: BlogQueryKeys.post(slug),
      queryFn: () => this.fetchBlogPost(slug),
      staleTime: 10 * 60 * 1000
    });
  }

  // Traditional HTTP methods for direct access (used in components)
  getBlogPostsDirect(params: BlogSearchParams = {}): Observable<BlogListResponse> {
    const httpParams = this.buildHttpParams(params);
    
    return this.http.get<any[]>(this.baseUrl, { params: httpParams }).pipe(
      timeout(10000),
      map(posts => this.transformJsonPlaceholderResponse(posts, params)),
      catchError((error) => {
        console.error('Blog service error:', error);
        return throwError(() => new Error('Failed to fetch blog posts. Please try again.'));
      })
    );
  }

  getBlogPostDirect(slug: string): Observable<BlogPost> {
    const postId = isNaN(Number(slug)) ? this.findPostIdBySlug(slug) : Number(slug);
    
    return this.http.get<any>(`${this.baseUrl}/${postId}`).pipe(
      timeout(10000),
      map(response => this.transformJsonPlaceholderPost(response)),
      catchError((error) => {
        console.error('Blog service error:', error);
        return throwError(() => new Error('Failed to fetch blog post. Please try again.'));
      })
    );
  }

  getTagsDirect(): Observable<string[]> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        const tags = [
          'Angular', 'TypeScript', 'JavaScript', 'Web Development',
          'Frontend', 'Backend', 'RxJS', 'Signals', 'Performance',
          'Architecture', 'Best Practices', 'Tutorial', 'Guide'
        ];
        subscriber.next(tags);
        subscriber.complete();
      }, 300);
    });
  }

  getAuthorsDirect(): Observable<string[]> {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').pipe(
      timeout(10000),
      map(users => users.map(user => user.name)),
      catchError((error) => {
        console.error('Blog service error:', error);
        return throwError(() => new Error('Failed to fetch authors. Please try again.'));
      })
    );
  }

  // Private HTTP methods for TanStack Query
  private async fetchBlogPosts(params: BlogSearchParams = {}): Promise<BlogListResponse> {
    const httpParams = this.buildHttpParams(params);
    console.log('httpParams', httpParams);
    
    try {
      const posts = await firstValueFrom(
        this.http.get<any[]>(this.baseUrl, { params: httpParams }).pipe(
          timeout(10000),
          catchError((error) => {
            console.error('Blog service error:', error);
            throw new Error('Failed to fetch blog posts. Please try again.');
          })
        )
      );
      
      return this.transformJsonPlaceholderResponse(posts, params);
    } catch (error) {
      throw error;
    }
  }

  private async fetchBlogPost(slug: string): Promise<BlogPost> {
    const postId = isNaN(Number(slug)) ? this.findPostIdBySlug(slug) : Number(slug);
    
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.baseUrl}/${postId}`).pipe(
          timeout(10000),
          catchError((error) => {
            console.error('Blog service error:', error);
            throw new Error('Failed to fetch blog post. Please try again.');
          })
        )
      );
      
      return this.transformJsonPlaceholderPost(response);
    } catch (error) {
      throw error;
    }
  }

  private async fetchTags(): Promise<string[]> {
    // JSONPlaceholder doesn't have tags endpoint, so we'll return common tags
    return new Promise((resolve) => {
      setTimeout(() => {
        const tags = [
          'Angular', 'TypeScript', 'JavaScript', 'Web Development',
          'Frontend', 'Backend', 'RxJS', 'Signals', 'Performance',
          'Architecture', 'Best Practices', 'Tutorial', 'Guide'
        ];
        resolve(tags);
      }, 300);
    });
  }

  private async fetchAuthors(): Promise<string[]> {
    try {
      const users = await firstValueFrom(
        this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').pipe(
          timeout(10000),
          catchError((error) => {
            console.error('Blog service error:', error);
            throw new Error('Failed to fetch authors. Please try again.');
          })
        )
      );
      
      return users.map(user => user.name);
    } catch (error) {
      throw error;
    }
  }

  // Traditional HTTP methods for mutations (create, update, delete)
  getBlogPostsTraditional(params: BlogSearchParams = {}): Observable<BlogListResponse> {
    const httpParams = this.buildHttpParams(params);
    
    return this.http.get<any[]>(this.baseUrl, { params: httpParams }).pipe(
      timeout(10000),
      map(posts => this.transformJsonPlaceholderResponse(posts, params)),
      catchError((error) => {
        console.error('Blog service error:', error);
        return throwError(() => new Error('Failed to fetch blog posts. Please try again.'));
      })
    );
  }

  getBlogPostTraditional(slug: string): Observable<BlogPost> {
    const postId = isNaN(Number(slug)) ? this.findPostIdBySlug(slug) : Number(slug);
    
    return this.http.get<any>(`${this.baseUrl}/${postId}`).pipe(
      timeout(10000),
      map(response => this.transformJsonPlaceholderPost(response)),
      catchError((error) => {
        console.error('Blog service error:', error);
        return throwError(() => new Error('Failed to fetch blog post. Please try again.'));
      })
    );
  }

  // Get a single blog post by ID
  getBlogPostById(id: string): Observable<BlogPost> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      timeout(10000),
      map(response => this.transformJsonPlaceholderPost(response)),
      catchError((error) => {
        console.error('Blog service error:', error);
        return throwError(() => new Error('Failed to fetch blog post. Please try again.'));
      })
    );
  }

  // Create a new blog post
  createBlogPost(post: BlogPostCreateRequest): Observable<BlogPost> {
    const request = {
      title: post.title,
      body: post.content,
      userId: 1 // JSONPlaceholder requires userId
    };

    return this.http.post<any>(this.baseUrl, request).pipe(
      timeout(10000),
      map(response => this.transformJsonPlaceholderPost(response)),
      catchError((error) => {
        console.error('Blog service error:', error);
        return throwError(() => new Error('Failed to create blog post. Please try again.'));
      })
    );
  }

  // Promise-based version for mutations
  private async createBlogPostPromise(post: BlogPostCreateRequest): Promise<BlogPost> {
    return firstValueFrom(this.createBlogPost(post));
  }

  // Update an existing blog post
  updateBlogPost(id: string, post: Partial<BlogPostCreateRequest>): Observable<BlogPost> {
    const request = {
      title: post.title,
      body: post.content,
      userId: 1
    };

    return this.http.put<any>(`${this.baseUrl}/${id}`, request).pipe(
      timeout(10000),
      map(response => this.transformJsonPlaceholderPost(response)),
      catchError((error) => {
        console.error('Blog service error:', error);
        return throwError(() => new Error('Failed to update blog post. Please try again.'));
      })
    );
  }

  // Promise-based version for mutations
  private async updateBlogPostPromise(id: string, post: Partial<BlogPostCreateRequest> & { slug?: string }): Promise<BlogPost> {
    return firstValueFrom(this.updateBlogPost(id, post));
  }

  // Delete a blog post
  deleteBlogPost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      timeout(10000),
      catchError((error) => {
        console.error('Blog service error:', error);
        return throwError(() => new Error('Failed to delete blog post. Please try again.'));
      })
    );
  }

  // Promise-based version for mutations
  private async deleteBlogPostPromise(id: string): Promise<void> {
    return firstValueFrom(this.deleteBlogPost(id));
  }

  // Demo methods for development (keeping for fallback)
  getBlogPostsDemo(params: BlogSearchParams = {}): Observable<BlogListResponse> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        const demoPosts: BlogPost[] = [
          {
            id: '1',
            title: 'Getting Started with Angular Signals',
            slug: 'getting-started-with-angular-signals',
            excerpt: 'Learn how to use Angular Signals for reactive state management in your applications.',
            content: `# Getting Started with Angular Signals

Angular Signals provide a powerful way to manage reactive state in your applications. In this post, we'll explore the fundamentals and best practices.

## What are Signals?

Signals are reactive primitives that track dependencies and automatically update when their values change. They provide fine-grained reactivity without the overhead of RxJS observables for simple state management.

## Basic Usage

\`\`\`typescript
import { signal, computed } from '@angular/core';

// Create a signal
const count = signal(0);

// Create a computed signal
const doubled = computed(() => count() * 2);

// Update the signal
count.set(1); // doubled() will now return 2
\`\`\`

## Best Practices

1. Use signals for simple state management
2. Use computed signals for derived state
3. Use effects for side effects
4. Prefer signals over BehaviorSubject for component state

## Conclusion

Signals are a powerful addition to Angular's reactivity model. Start using them in your applications today!`,
            author: 'John Doe',
            publishedAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            tags: ['Angular', 'Signals', 'TypeScript'],
            readingTime: 5,
            published: true
          },
          {
            id: '2',
            title: 'Building Scalable Angular Applications',
            slug: 'building-scalable-angular-applications',
            excerpt: 'Discover best practices for building maintainable and scalable Angular applications.',
            content: `# Building Scalable Angular Applications

Scalability is crucial for long-term success. Let's explore how to build Angular applications that can grow with your needs.

## Architecture Patterns

### Clean Architecture
Separate your concerns into distinct layers:
- Domain layer for business logic
- Application layer for use cases
- Infrastructure layer for external dependencies

### Smart/Dumb Components
- Smart components handle logic and state
- Dumb components focus on presentation
- Pass data down through inputs
- Emit events up through outputs

## Performance Optimization

### Lazy Loading
Use lazy loading for feature modules to reduce initial bundle size.

### OnPush Change Detection
Use OnPush change detection strategy for better performance.

## Conclusion

Following these patterns will help you build scalable Angular applications.`,
            author: 'Jane Smith',
            publishedAt: '2024-01-10T14:30:00Z',
            updatedAt: '2024-01-10T14:30:00Z',
            tags: ['Angular', 'Architecture', 'Performance'],
            readingTime: 8,
            published: true
          },
          {
            id: '3',
            title: 'TypeScript Best Practices for Angular Developers',
            slug: 'typescript-best-practices-angular-developers',
            excerpt: 'Essential TypeScript tips and tricks for Angular developers to write better code.',
            content: `# TypeScript Best Practices for Angular Developers

TypeScript adds powerful type safety to Angular applications. Here are the best practices you should follow.

## Strict Type Checking

Always enable strict type checking in tsconfig.json:

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
\`\`\`

## Interface vs Type

Use interfaces for object shapes that might be extended:

\`\`\`typescript
interface User {
  name: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}
\`\`\`

Use types for unions, intersections, and computed types:

\`\`\`typescript
type Status = 'pending' | 'approved' | 'rejected';
type UserWithStatus = User & { status: Status };
\`\`\`

## Conclusion

Following these TypeScript best practices will help you write more maintainable and type-safe Angular applications.`,
            author: 'Mike Johnson',
            publishedAt: '2024-01-05T09:15:00Z',
            updatedAt: '2024-01-05T09:15:00Z',
            tags: ['TypeScript', 'Angular', 'Best Practices'],
            readingTime: 6,
            published: true
          }
        ];

        // Apply filters
        let filteredPosts = demoPosts.filter(post => post.published);
        
        if (params.tag) {
          filteredPosts = filteredPosts.filter(post => post.tags.includes(params.tag!));
        }
        
        if (params.author) {
          filteredPosts = filteredPosts.filter(post => post.author === params.author);
        }
        
        if (params.search) {
          const searchTerm = params.search.toLowerCase();
          filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm)
          );
        }

        // Pagination
        const page = params.page || 1;
        const pageSize = params.pageSize || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

        const response: BlogListResponse = {
          posts: paginatedPosts,
          total: filteredPosts.length,
          page,
          pageSize,
          hasNext: endIndex < filteredPosts.length,
          hasPrev: page > 1
        };

        subscriber.next(response);
        subscriber.complete();
      }, 500);
    });
  }

  getBlogPostDemo(slug: string): Observable<BlogPost> {
    return this.getBlogPostsDemo().pipe(
      map(response => {
        const post = response.posts.find(p => p.slug === slug);
        if (!post) {
          throw new Error('Blog post not found');
        }
        return post;
      })
    );
  }

  // Private helper methods
  private buildHttpParams(params: BlogSearchParams): HttpParams {
    let httpParams = new HttpParams();
    
    // JSONPlaceholder supports _page and _limit for pagination
    if (params.page) {
      httpParams = httpParams.set('_page', params.page.toString());
    }
    
    if (params.pageSize) {
      httpParams = httpParams.set('_limit', params.pageSize.toString());
    }
    
    return httpParams;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private findPostIdBySlug(slug: string): number {
    // For demo purposes, map known slugs to IDs
    const slugToIdMap: { [key: string]: number } = {
      'getting-started-with-angular-signals': 1,
      'building-scalable-angular-applications': 2,
      'typescript-best-practices-angular-developers': 3
    };
    
    return slugToIdMap[slug] || 1; // Default to 1 if not found
  }

  private transformJsonPlaceholderResponse(posts: any[], params: BlogSearchParams): BlogListResponse {
    const transformedPosts = posts.map(post => this.transformJsonPlaceholderPost(post));
    
    // Apply client-side filtering since JSONPlaceholder has limited filtering
    let filteredPosts = transformedPosts;
    
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm)
      );
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    
    return {
      posts: filteredPosts,
      total: filteredPosts.length,
      page,
      pageSize,
      hasNext: false, // JSONPlaceholder doesn't provide total count
      hasPrev: page > 1
    };
  }

  private transformJsonPlaceholderPost(post: any): BlogPost {
    return {
      id: post.id.toString(),
      title: post.title,
      slug: this.generateSlug(post.title),
      excerpt: post.body.substring(0, 150) + '...',
      content: `# ${post.title}

${post.body}

*This post was fetched from JSONPlaceholder API.*`,
      author: 'JSONPlaceholder Author',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['JSONPlaceholder', 'API', 'Demo'],
      readingTime: Math.ceil(post.body.length / 1000), // Rough estimate
      published: true
    };
  }
}
