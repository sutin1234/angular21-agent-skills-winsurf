import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogService } from '../blog.service';
import { BlogPost } from '../blog.model';

@Component({
  selector: 'app-blog-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-blog-post',
    '[class.loading]': 'loading()',
    '[attr.aria-busy]': 'loading()'
  },
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-post.component.html'
})
export class BlogPostComponent {
  private readonly blogService = inject(BlogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // State signals
  readonly post = signal<BlogPost | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  // Computed signals
  readonly hasPost = computed(() => this.post() !== null);
  readonly formattedDate = computed(() => {
    const currentPost = this.post();
    if (!currentPost) return '';
    return new Date(currentPost.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  readonly readingTimeText = computed(() => {
    const currentPost = this.post();
    if (!currentPost) return '';
    return `${currentPost.readingTime} min read`;
  });

  constructor() {
    // Load post when slug parameter changes
    effect(() => {
      const slug = this.route.snapshot.paramMap.get('slug');
      if (slug) {
        this.loadPost(slug);
      } else {
        this.error.set('No blog post specified');
        this.loading.set(false);
      }
    });
  }

  private loadPost(slug: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.blogService.getBlogPostDirect(slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (post) => {
          this.post.set(post);
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set(error.message);
          this.loading.set(false);
        }
      });
  }

  // Navigation methods - optimized
  readonly goBack = (): void => {
    this.router.navigate(['/blog']);
  };

  // Memoized utility methods
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

  // Table of contents generation (for future enhancement) - memoized
  readonly tableOfContents = computed(() => {
    const currentPost = this.post();
    if (!currentPost) return [];

    const headings = currentPost.content.match(/^#{1,3}\s+(.+)$/gm) || [];
    return headings.map((heading: string, index: number) => {
      const level = (heading.match(/^#+/) || [''])[0].length;
      const text = heading.replace(/^#+\s+/, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { id, text, level };
    });
  });

  // Share methods - optimized with proper error handling
  readonly shareOnTwitter = (): void => {
    const currentPost = this.post();
    if (!currentPost) return;

    const text = `Check out this article: ${currentPost.title}`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  readonly shareOnLinkedIn = (): void => {
    const currentPost = this.post();
    if (!currentPost) return;

    const url = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  readonly copyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Could show a toast notification here
      console.log('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };
}
