# Angular21 Agent Skills & Code Review System

<div align="center">
  <img src="https://raw.githubusercontent.com/angular/angular/main/adev/src/assets/images/press-kit/angular_icon_gradient.gif" alt="Angular Modern Logo" width="120" height="120" style="filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));">
  <h3>🚀 Modern Angular Development with AI-Assisted Code Review</h3>
  <p>Comprehensive development tools and code review system for Angular 21+ applications</p>
  
  [![Angular Version](https://img.shields.io/badge/Angular-21.1.4-red.svg)](https://angular.io/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
  [![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154.svg)](https://tanstack.com/query/latest)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4.svg)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 🎯 What This Repository Contains

### 🤖 **Agent Skills**
- **🔥 Angular Best Practices (v20+)** - 35+ rules for performance optimization
- **🎯 Angular Component Patterns** - Standalone component architecture
- **📊 TanStack Query Integration** - Modern data fetching patterns
- **🎨 Tailwind CSS Best Practices** - Responsive design utilities
- **🏗️ Clean Architecture** - Scalable application structure

### 📋 **Code Review System**
- **Comprehensive Checklist** - Skill-based review criteria
- **Problems & Solutions Guide** - Detailed fix examples
- **Priority-Based Issues** - High/Medium/Low classification
- **Type Safety Focus** - TypeScript best practices

### 🏪 **Demo Components**
- **Blog System** - Complete CRUD with pagination
- **TanStack Query Demo** - Data fetching patterns
- **Pagination Component** - Accessible & reusable
- **Theme Toggle** - Modern UI patterns

---

## 🌟 **Feature Showcase**

<div align="center">

### 🤖 **AI-Powered Code Review**
```typescript
// Automated review with skill-based analysis
"review code src/app/components/user-card.component.ts"
// → Grade: B+ (ดีมาก) + Detailed feedback
```

### 🚀 **Modern Angular Patterns**
```typescript
// Signals + Computed + Host Bindings
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.loading]': 'loading()' }
})
export class ModernComponent {
  readonly data = input.required<T>();
  readonly computed = computed(() => process(this.data()));
}
```

### 📊 **TanStack Query Integration**
```typescript
// Optimized data fetching
readonly postsQuery = injectQuery(() => ({
  queryKey: BlogQueryKeys.postsList(params),
  queryFn: () => blogService.getPosts(params)
}));
```

</div>

---

## 🚀 Getting Started

### Development Server
```bash
ng serve
```
Navigate to `http://localhost:4200/`

### Build Project
```bash
ng build
```

### Run Tests
```bash
ng test          # Unit tests
ng e2e           # End-to-end tests
```

---

## 📖 Usage Examples

### 🤖 **Using Agent Skills**

#### 1. **Angular Best Practices Review**
```bash
# Ask the agent to review your component
"โปรด review code user-profile.component.ts ตามเกณฑ์ Angular 21"
```

#### 2. **Component Creation**
```bash
# Generate a new component with best practices
"สร้าง component user-card ตาม angular-component skill"
```

#### 3. **TanStack Query Integration**
```bash
# Get help with data fetching
"แนะนำการใช้ TanStack Query สำหรับ blog service"
```

### 📋 **Code Review Process**

#### 1. **Basic Review**
```bash
"review code src/app/components/user-form.component.ts"
```

#### 2. **Comprehensive Review with Checklist**
```bash
"review code src/app/pages/blog/blog-list.component.ts 
ตาม checklist ใน .windsurf/prompts/ng-review-checklist.md"
```

#### 3. **Problems & Solutions Review**
```bash
"review code src/app/shared/pagination/pagination.component.ts 
พร้อมบอกปัญหาและวิธีแก้ไขตาม .windsurf/prompts/ng-review-with-solutions.md"
```

---

## 🎯 **Feature Examples**

### 📊 **TanStack Query Integration**
```typescript
// From blog-query-demo.component.ts
readonly postsQuery = injectQuery(() => ({
  ...this.createQueryOptions(),
  queryKey: BlogQueryKeys.postsList(this.searchParams()),
  queryFn: () => this.blogService.getBlogPosts(this.searchParams())
}));
```

### 🎨 **Modern Component Architecture**
```typescript
// From blog-list.component.ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'app-blog-list',
    '[class.loading]': 'loading()',
    '[attr.aria-busy]': 'loading()'
  }
})
export class BlogListComponent {
  readonly currentPage = input.required<number>();
  readonly posts = signal<BlogPost[]>([]);
  readonly hasPosts = computed(() => this.posts().length > 0);
}
```

### 🎯 **Accessible Pagination**
```typescript
// From pagination.component.ts
<button
  [disabled]="!hasPrevPage()"
  (click)="prevPage()"
  [attr.aria-label]="getPageAriaLabel(currentPage() - 1)"
  class="pagination-button"
>
  Previous
</button>
```

---

## 📁 **Project Structure**

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Feature pages
│   │   ├── blog/          # Blog system with TanStack Query
│   │   ├── about/         # About pages
│   │   └── contact/       # Contact forms
│   ├── shared/            # Shared utilities
│   │   └── pagination/    # Accessible pagination
│   └── lib/               # Core services
├── .windsurf/
│   ├── prompts/           # Code review prompts
│   │   ├── ng-review.md
│   │   ├── ng-review-checklist.md
│   │   └── ng-review-with-solutions.md
│   └── skills/            # Agent skills
│       ├── angular-best-practices-v20/
│       ├── angular-component/
│       ├── angular-best-practices-tanstack/
│       └── frontend-tailwind-best-practices/
└── .agent/                # Additional agent configurations
```

---

## 🔧 **Available Skills**

### 🔥 **Angular Best Practices (v20+)**
- Change Detection Optimization
- Signals & Computed Properties
- Template Performance (@if/@for/@switch)
- RxJS Optimization
- HTTP & Caching Strategies
- Bundle & Lazy Loading

### 🎯 **Angular Component Patterns**
- Standalone Components
- Signal Inputs/Outputs
- Host Bindings
- Content Projection
- Accessibility (WCAG AA)
- Lifecycle Hooks

### 📊 **TanStack Query Integration**
- Query Key Factories
- Cache Management
- Data Fetching Patterns
- Error Handling
- Prefetching Strategies

### 🎨 **Tailwind CSS Best Practices**
- Layout Utilities (v-stack/h-stack)
- Responsive Design
- Color Schemes
- className Merging (cn utility)

---

## 🎯 **Code Review Examples**

### Example 1: Basic Component Review
```bash
User: "review code src/app/components/user-card.component.ts"

Agent: 
# Code Review: UserCardComponent
## 🔴 HIGH PRIORITY Issues
❌ **no-any-types** (Line 15) - ใช้ $any() ใน template
✅ **change-onpush** (Line 8) - ใช้ OnPush ถูกต้อง
...
## 🎯 Grade: B+ (ดีมาก)
```

### Example 2: Comprehensive Review
```bash
User: "review code src/app/pages/blog/blog-list.component.ts ตาม checklist"

Agent:
# Code Review: BlogListComponent (Checklist Format)
## 🔴 HIGH PRIORITY Issues
- [ ] **no-any-types** - Template ใช้ $any($event.target).value
- [x] **change-onpush** - ใช้ ChangeDetectionStrategy.OnPush
## 📊 สรุปคะแนน: 72% → Grade B
```

---

## 🌟 **Key Features**

### ✅ **Modern Angular 21+ Features**
- Signals & Computed Properties
- Linked Signals
- Native Control Flow (@if/@for/@switch)
- Standalone Components (default)
- Functional Interceptors

### ✅ **Performance Optimized**
- OnPush Change Detection
- Lazy Loading Routes
- Virtual Scrolling Ready
- Bundle Optimization
- Memory Leak Prevention

### ✅ **Fully Accessible**
- WCAG AA Compliant
- ARIA Attributes
- Keyboard Navigation
- Focus Management
- Screen Reader Support

### ✅ **Type Safe**
- Strict TypeScript
- No Any Types
- Proper Type Assertions
- Input Validation
- Error Boundaries

---

## 🤝 **How to Use This Repository**

1. **Clone the repository**
   ```bash
   git clone https://github.com/sutin1234/angular21-agent-skills-winsurf.git
   cd angular21-agent-skills-winsurf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ng serve
   ```

4. **Use agent skills for development**
   - Ask for code reviews
   - Generate components with best practices
   - Get help with TanStack Query
   - Request accessibility improvements

5. **Explore demo components**
   - Visit `/blog` for blog system demo
   - Visit `/blog/query-demo` for TanStack Query demo
   - Check pagination component usage

---

## 📚 **Additional Resources**

- [Angular 21 Documentation](https://angular.io/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎯 **Contributing**

This repository demonstrates:
- ✨ Modern Angular development patterns
- 🤖 AI-assisted code review workflows
- 📋 Comprehensive quality standards
- 🚀 Performance optimization techniques
- ♿ Accessibility-first development

Perfect for learning Angular 21+ best practices and implementing AI-assisted development workflows!

---

<div align="center">

### 🙏 **Made with ❤️ using**

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

### 🌟 **Star this repository if it helps you!**

[![GitHub stars](https://img.shields.io/github/stars/sutin1234/angular21-agent-skills-winsurf?style=social)](https://github.com/sutin1234/angular21-agent-skills-winsurf/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sutin1234/angular21-agent-skills-winsurf?style=social)](https://github.com/sutin1234/angular21-agent-skills-winsurf/network)

</div>
