import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ContactFormComponent } from './pages/contact/contact-form/contact-form.component';
import { AboutFormComponent } from './pages/about/about-form/about-form.component';
import { BlogListComponent } from './pages/blog/blog-list/blog-list.component';
import { BlogPostComponent } from './pages/blog/blog-post/blog-post.component';
import { BlogQueryDemoComponent } from './pages/blog/blog-query-demo/blog-query-demo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'about', component: AboutFormComponent },
  { path: 'contact', component: ContactFormComponent },
  { 
    path: 'blog', 
    component: BlogListComponent,
    title: 'Blog - Angular21'
  },
  { 
    path: 'blog/:slug', 
    component: BlogPostComponent,
    title: 'Blog Post - Angular21'
  },
  { 
    path: 'blog-query-demo', 
    component: BlogQueryDemoComponent,
    title: 'TanStack Query Demo - Angular21'
  },
  { path: '**', redirectTo: '/home' }
];
