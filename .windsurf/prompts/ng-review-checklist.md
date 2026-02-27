# Angular 21 Code Review Checklist

## 🔴 HIGH PRIORITY (ต้องแก้ไขทันที)

### Change Detection & Performance
- [ ] **change-onpush**: ใช้ `ChangeDetectionStrategy.OnPush` ทุก component
  - 📚 **Source**: `angular-best-practices-v20` → `change-onpush`
- [ ] **change-signals**: ใช้ signals แทน BehaviorSubject สำหรับ reactive state
  - 📚 **Source**: `angular-best-practices-v20` → `change-signals`
- [ ] **signal-computed-pure**: computed() ต้องไม่มี side effects
  - 📚 **Source**: `angular-best-practices-v20` → `signal-computed-pure`
- [ ] **template-trackby**: ใช้ track function ใน @for loops (required ใน v20+)
  - 📚 **Source**: `angular-best-practices-v20` → `template-trackby`

### Type Safety
- [ ] **no-any-types**: ห้ามใช้ `$any()` หรือ `any` types
  - 📚 **Source**: `angular-best-practices-v20` → General TypeScript best practices
- [ ] **proper-type-assertions**: ใช้ type assertions ที่ถูกต้อง `(target as HTMLInputElement)`
  - 📚 **Source**: `angular-best-practices-v20` → General TypeScript best practices
- [ ] **input-validation**: มี validation และ transform สำหรับ inputs
  - 📚 **Source**: `angular-component` → Input with transform functions

### Component Architecture
- [ ] **component-signal-io**: ใช้ `input()`/`output()` แทน decorators
  - 📚 **Source**: `angular-best-practices-v20` → `component-signal-io`
- [ ] **host-bindings**: ใช้ host object แทน @HostBinding/@HostListener
  - 📚 **Source**: `angular-component` → Host Bindings
- [ ] **standalone-default**: ไม่ต้อง设置 `standalone: true` (default ใน v20+)
  - 📚 **Source**: `angular-best-practices-v20` → `bundle-standalone`

### Template Syntax
- [ ] **native-control-flow**: ใช้ @if/@for/@switch แทน *ngIf/*ngFor/*ngSwitch
  - 📚 **Source**: `angular-component` → Template Syntax
- [ ] **no-function-calls**: ห้ามเรียก function ใน template
  - 📚 **Source**: `angular-best-practices-v20` → `template-no-function-calls`
- [ ] **class-style-bindings**: ใช้ [class]/[style] bindings แทน ngClass/ngStyle
  - 📚 **Source**: `angular-component` → Class and Style Bindings

---

## 🟡 MEDIUM PRIORITY (ควรปรับปรุง)

### RxJS & Data Fetching
- [ ] **rxjs-takeuntil**: ใช้ takeUntilDestroyed สำหรับ subscription cleanup
  - 📚 **Source**: `angular-best-practices-v20` → `rxjs-takeuntil`
- [ ] **rxjs-async-pipe**: ใช้ async pipe แทน manual subscriptions (ถ้าเป็นไปได้)
  - 📚 **Source**: `angular-best-practices-v20` → `rxjs-async-pipe`
- [ ] **http-resource**: พิจารณาใช้ httpResource สำหรับ signal-based data fetching
  - 📚 **Source**: `angular-best-practices-v20` → `http-resource`
- [ ] **rxjs-no-nested-subscribe**: ห้ามใช้ nested subscriptions
  - 📚 **Source**: `angular-best-practices-v20` → `rxjs-no-nested-subscribe`

### Bundle & Lazy Loading
- [ ] **bundle-lazy-routes**: ใช้ lazy loading สำหรับ routes
  - 📚 **Source**: `angular-best-practices-v20` → `bundle-lazy-routes`
- [ ] **bundle-defer**: ใช้ @defer blocks สำหรับ heavy components
  - 📚 **Source**: `angular-best-practices-v20` → `bundle-defer`
- [ ] **bundle-no-barrel-imports**: หลีกเลี่ยง barrel files
  - 📚 **Source**: `angular-best-practices-v20` → `bundle-no-barrel-imports`

### Forms & Validation
- [ ] **forms-reactive**: ใช้ reactive forms พร้อม TypeScript types
  - 📚 **Source**: `angular-best-practices-v20` → `forms-reactive`
- [ ] **form-validation**: มี validation logic ที่ชัดเจน
  - 📚 **Source**: `angular-component` → Forms Optimization

### Accessibility
- [ ] **wcag-aa-compliance**: ผ่าน WCAG AA standards
  - 📚 **Source**: `angular-component` → Accessibility Requirements
- [ ] **aria-attributes**: มี ARIA attributes ที่เหมาะสม
  - 📚 **Source**: `angular-component` → Accessibility Requirements
- [ ] **keyboard-navigation**: รองรับ keyboard navigation
  - 📚 **Source**: `angular-component` → Accessibility Requirements
- [ ] **focus-management**: มี focus management ที่ถูกต้อง
  - 📚 **Source**: `angular-component` → Accessibility Requirements

---

## 🟢 LOW PRIORITY (เพิ่มเติมเมื่อมีเวลา)

### Code Quality & Maintainability
- [ ] **no-magic-numbers**: สร้าง constants สำหรับ magic numbers
  - 📚 **Source**: `angular-best-practices-v20` → General best practices
- [ ] **consistent-naming**: ใช้ naming conventions ที่สม่ำเสมอ
  - 📚 **Source**: `angular-best-practices-v20` → General best practices
- [ ] **code-duplication**: ลบ code duplication
  - 📚 **Source**: `angular-best-practices-v20` → General best practices
- [ ] **single-responsibility**:  components มี single responsibility
  - 📚 **Source**: `angular-component` → Component Structure

### Performance Optimization
- [ ] **template-virtual-scroll**: ใช้ virtual scrolling สำหรับ large lists
  - 📚 **Source**: `angular-best-practices-v20` → `template-virtual-scroll`
- [ ] **run-outside-zone**: รัน heavy operations นอก NgZone
  - 📚 **Source**: `angular-best-practices-v20` → `change-run-outside-zone`
- [ ] **memory-leaks-prevention**: ป้องกัน memory leaks (timers, listeners)
  - 📚 **Source**: `angular-best-practices-v20` → `perf-memory-leaks`

### Tailwind CSS & Styling
- [ ] **layout-stack-utilities**: ใช้ v-stack/h-stack แทน flex classes
  - 📚 **Source**: `frontend-tailwind-best-practices` → `layout-stack-utilities`
- [ ] **layout-prefer-gaps**: ใช้ gap-* บน parent แทน child margins
  - 📚 **Source**: `frontend-tailwind-best-practices` → `layout-prefer-gaps`
- [ ] **classname-cn-utility**: ใช้ cn() สำหรับ className merging
  - 📚 **Source**: `frontend-tailwind-best-practices` → `classname-cn-utility`
- [ ] **responsive-design**: มี responsive design ที่เหมาะสม
  - 📚 **Source**: `frontend-tailwind-best-practices` → `responsive-breakpoints`

### Testing & Documentation
- [ ] **unit-tests**: มี unit tests ครบถ้วน
  - 📚 **Source**: General software engineering best practices
- [ ] **integration-tests**: มี integration tests สำหรับ critical flows
  - 📚 **Source**: General software engineering best practices
- [ ] **component-documentation**: มี documentation สำหรับ component APIs
  - 📚 **Source**: General software engineering best practices

---

## 📚 ที่มาของ Skills ที่ใช้ใน Checklist

### 🔥 **angular-best-practices-v20** (35+ rules)
- **Focus**: Angular 20+ performance optimization
- **หัวข้อหลัก**: Change Detection, Bundle & Lazy Loading, RxJS, Template Performance, DI, HTTP & Caching, Forms, SSR
- **Rules ที่ใช้**: change-onpush, change-signals, signal-computed-pure, template-trackby, component-signal-io, bundle-standalone, template-no-function-calls, rxjs-takeuntil, rxjs-async-pipe, http-resource, rxjs-no-nested-subscribe, bundle-lazy-routes, bundle-defer, bundle-no-barrel-imports, forms-reactive, template-virtual-scroll, change-run-outside-zone, perf-memory-leaks

### 🎯 **angular-component** (Component patterns)
- **Focus**: Standalone component creation & architecture
- **หัวข้อหลัก**: Component Structure, Signal Inputs/Outputs, Host Bindings, Template Syntax, Accessibility, Forms
- **Rules ที่ใช้**: Input with transform functions, Host Bindings, Template Syntax, Class and Style Bindings, Forms Optimization, Accessibility Requirements, Component Structure

### 🎨 **frontend-tailwind-best-practices** (CSS patterns)
- **Focus**: Tailwind CSS conventions & layout utilities
- **หัวข้อหลัก**: Layout Utilities, Color Schemes, className Handling, Affordances, Responsive Design
- **Rules ที่ใช้**: layout-stack-utilities, layout-prefer-gaps, classname-cn-utility, responsive-breakpoints

### 📊 **angular-best-practices-tanstack** (Data fetching)
- **Focus**: TanStack Query integration (ถ้ามีการใช้งาน)
- **หัวข้อหลัก**: Query Key Factories, Cache Management, Data Fetching Patterns
- **Rules ที่ใช้**: (ไม่ได้ใช้ใน BlogListComponent แต่มีใน checklist)

---

## 🎯 การให้คะแนน

### Grade A (90-100%)
- ✅ ผ่านทุก HIGH priority items
- ✅ ผ่าน 80%+ ของ MEDIUM priority items
- ✅ ผ่าน 60%+ ของ LOW priority items

### Grade B (80-89%)
- ✅ ผ่าน 90%+ ของ HIGH priority items
- ✅ ผ่าน 60%+ ของ MEDIUM priority items
- ⚠️ มีบาง LOW priority items ที่ต้องปรับ

### Grade C (70-79%)
- ⚠️ มี HIGH priority items บางรายการที่ต้องแก้
- ✅ ผ่าน 50%+ ของ MEDIUM priority items
- ❌ มี LOW priority items หลายรายการ

### Grade D (60-69%)
- ❌ มี HIGH priority items หลายรายการที่ต้องแก้
- ⚠️ ผ่านน้อยกว่า 50% ของ MEDIUM priority items
- ❌ ขาด LOW priority items หลายรายการ

### Grade F (0-59%)
- ❌ ผ่านน้อยกว่า 70% ของ HIGH priority items
- ❌ มีปัญหาด้าน performance หรือ security ร้ายแรง

---

## 📋 การใช้งาน Checklist

### สำหรับ Reviewer
1. **ตรวจสอบ HIGH priority ก่อน** - ถ้าไม่ผ่านควร reject และขอให้แก้
2. **ให้คะแนนตามเกณฑ์** - ใช้การให้คะแนนข้างต้น
3. **ระบุ line numbers** - ชี้ตำแหน่งที่ต้องแก้ไขทั้งหมด
4. **ให้ตัวอย่างโค้ด** - แสดงวิธีการแก้ไขที่ถูกต้อง
5. **อธิบายประโยชน์** - บอกว่าทำไมต้องแก้ไข

### สำหรับ Developer
1. **แก้ไข HIGH priority ก่อน** - ต้องผ่านทุกรายการ
2. **ทดสอบการเปลี่ยนแปลง** - ตรวจสอบว่าไม่ break functionality
3. **รัน automated tests** - ตรวจสอบว่า tests ผ่านทั้งหมด
4. **ตรวจสอบ accessibility** - ใช้ tools เช่น AXE extension
5. **ทำ manual testing** - ทดสอบ critical flows ด้วยตนเอง

---

## 🔗 References
- **angular-best-practices-v20** - Angular v20+ best practices
- **angular-component** - Component creation patterns
- **angular-best-practices-tanstack** - TanStack Query patterns
- **frontend-tailwind-best-practices** - Tailwind CSS patterns
- [Angular 21 Documentation](https://angular.io/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
