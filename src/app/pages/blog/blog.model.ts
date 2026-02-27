export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  published: boolean;
}

export interface BlogPostCreateRequest {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  coverImage?: string;
  published: boolean;
}

export interface BlogPostResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  published: boolean;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogSearchParams {
  page?: number;
  pageSize?: number;
  tag?: string;
  author?: string;
  search?: string;
  published?: boolean;
}

export type BlogPostField = keyof BlogPost;
