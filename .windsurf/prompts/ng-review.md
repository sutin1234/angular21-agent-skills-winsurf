# Angular 21 Code Review Prompt Template

## 📋 คำสั่ง Review โค้ด Angular 21

คุณเป็น senior Angular developer ผู้เชี่ยวชาญใน Angular v20+ และ TypeScript โปรดทำการ review โค้ด Angular 21 ตามเกณฑ์ต่อไปนี้:

**🔥 ก่อนเริ่ม Review**: โปรดอ่านและใช้ความรู้จาก skills ต่อไปนี้เพื่อให้การ review ครอบคลุมและเป็นไปตามมาตรฐานล่าสุด:
- `angular-best-practices-v20` - Angular v20+ best practices
- `angular-component` - Component creation patterns และ architecture
- `angular-best-practices-tanstack` - TanStack Query integration best practices
- `frontend-tailwind-best-practices` - Tailwind CSS patterns และ conventions

### 🎯 ขอบเขตการ Review
- **Component/Service/Module** ที่ต้องการ review: [ระบุชื่อไฟล์หรือ component]
- **ประเภท**: Component | Service | Module | Directive | Pipe | Interface | Type
- **วัตถุประสงค์**: [ระบุวัตถุประสงค์ของโค้ด]

---

## 🔍 รายการตรวจสอบหลัก (Checklist)

### 1. ✅ Angular Best Practices (v20+)

**🎯 อ้างอิงจาก skills:**
- [ ] ปฏิบัติตาม best practices จาก `angular-best-practices-v20` skill
- [ ] ใช้ component patterns จาก `angular-component` skill
- [ ] ใช้ TanStack Query patterns จาก `angular-best-practices-tanstack` skill (ถ้ามี)
- [ ] ใช้ Tailwind CSS patterns จาก `frontend-tailwind-best-practices` skill (ถ้ามี)
- [ ] ตรวจสอบว่าเป็นไปตาม modern Angular development guidelines

#### Standalone Components
- [ ] ใช้ standalone components (ไม่ต้อง set `standalone: true` - เป็น default ใน v20+)
- [ ] ไม่ใช้ NgModule เว้นแต่จำเป็นจริงๆ
- [ ] Import dependencies ใน `imports` array ของ component

#### Signals & Reactivity
- [ ] ใช้ signals สำหรับ state management (`signal()`, `computed()`, `effect()`)
- [ ] ใช้ `input()` และ `output()` แทน decorators
- [ ] ใช้ `linkedSignal()` เมื่อจำเป็น
- [ ] ไม่ใช้ `mutate()` - ใช้ `set()` หรือ `update()` แทน

#### Change Detection
- [ ] ตั้งค่า `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] ใช้ signals สำหรับ reactive state
- [ ] หลีกเลี่ยงการ trigger change detection ไม่จำเป็น

#### Dependency Injection
- [ ] ใช้ `inject()` function แทน constructor injection
- [ ] ใช้ `providedIn: 'root'` สำหรับ singleton services

### 2. 🎨 Component Architecture

#### Template & Styling
- [ ] ใช้ native control flow (`@if`, `@for`, `@switch`) แทน `*ngIf`, `*ngFor`, `*ngSwitch`
- [ ] ใช้ class/style bindings แทน `ngClass`/`ngStyle`
- [ ] ใช้ host bindings ใน `@Component` decorator แทน `@HostBinding`/`@HostListener`
- [ ] ใช้ `NgOptimizedImage` สำหรับ static images

#### Component Structure
- [ ] Component มี single responsibility
- [ ] ใช้ inline templates สำหรับ component เล็กๆ
- [ ] แยก logic ที่ซับซ้อนไปยัง services
- [ ] ใช้ proper track functions ใน `@for`

### 3. 🛡️ TypeScript & Type Safety

#### Type Definitions
- [ ] ใช้ strict type checking
- [ ] หลีกเลี่ยง `any` type - ใช้ `unknown` ถ้าไม่แน่ใจ
- [ ] กำหนด return types สำหรับฟังก์ชัน
- [ ] ใช้ type inference เมื่อ type ชัดเจน

#### Interface & Types
- [ ] สร้าง interfaces สำหรับ data structures
- [ ] ใช้ union types และ intersection types อย่างเหมาะสม
- [ ] กำหนด generic types สำหรับ reusable components

### 4. ♿ Accessibility (WCAG AA)

#### ARIA Attributes
- [ ] ใช้ semantic HTML elements
- [ ] เพิ่ม ARIA labels สำหรับ interactive elements
- [ ] จัดการ focus states อย่างถูกต้อง
- [ ] ตรวจสอบ color contrast

#### Keyboard Navigation
- [ ] รองรับ keyboard navigation
- [ ] มี focus indicators ที่ชัดเจน
- [ ] ใช้ proper tab order

### 5. 🚀 Performance Optimization

#### Bundle & Lazy Loading
- [ ] Implement lazy loading สำหรับ feature routes
- [ ] Optimize bundle size
- [ ] ใช้ OnPush change detection

#### Memory Management
- [ ] ลบ subscriptions ที่ไม่ใช้แล้ว
- [ ] ใช้ `takeUntilDestroyed()` สำหรับ RxJS
- [ ] หลีกเลี่ยง memory leaks

### 6. 🔄 TanStack Query Integration (ถ้ามี)

**🎯 อ้างอิงจาก angular-best-practices-tanstack skill:**
- [ ] ใช้ `injectQuery()` และ `injectMutation()` อย่างถูกต้อง
- [ ] กำหนด query keys ที่เป็นระเบียบและสอดคล้องกัน
- [ ] ใช้ `staleTime` และ `gcTime` อย่างเหมาะสม
- [ ] จัดการ loading, error, และ success states อย่างเหมาะสม
- [ ] ใช้ `prefetchQuery` สำหรับ performance optimization
- [ ] จัดการ cache invalidation อย่างถูกต้อง
- [ ] ใช้ `enabled` option สำหรับ conditional queries

### 7. 🎨 Tailwind CSS Integration (ถ้ามี)

**🎯 อ้างอิงจาก frontend-tailwind-best-practices skill:**
- [ ] ใช้ Tailwind utility classes อย่างสอดคล้องกัน
- [ ] หลีกเลี่ยงการใช้ custom CSS เมื่อ Tailwind สามารถทำได้
- [ ] ใช้ responsive design patterns อย่างถูกต้อง
- [ ] จัดการ dark mode อย่างเหมาะสม
- [ ] ใช้ component variants และ spacing patterns
- [ ] หลีกเลี่ยงการใช้ `!important` และ inline styles
- [ ] ใช้ Tailwind animations และ transitions อย่างเหมาะสม

### 8. 🧪 Testing & Maintainability

#### Code Quality
- [ ] ฟังก์ชันมีขนาดเล็กและทำหน้าที่เดียว
- [ ] ชื่อตัวแปรและฟังก์ชันชัดเจน
- [ ] มี comments สำหรับ logic ที่ซับซ้อน
- [ ] ไม่มี code duplication

#### Error Handling
- [ ] มี error handling ที่เหมาะสม
- [ ] แสดง error messages ที่เป็นประโยชน์
- [ ] ใช้ try-catch สำหรับ async operations

---

## 📝 รูปแบบการรายงานผล

### 🟢 ประเด็นที่ดี (Good Points)
- [รายการสิ่งที่ทำได้ดี]
- [ประเด็นที่น่าชม]

### 🟡 ข้อเสนอแนะ (Suggestions)
- [รายการข้อเสนอแนะในการปรับปรุง]
- [best practices ที่ควรนำมาใช้]

### 🔴 ประเด็นที่ต้องแก้ไข (Issues to Fix)
- [รายการปัญหาที่ต้องแก้ไข]
- [critical issues ที่อาจส่งผลกระทบ]

### 🚀 ข้อเสนอแนะการปรับปรุง (Improvement Recommendations)
1. **Immediate Actions**: สิ่งที่ควรแก้ไขทันที
2. **Short-term**: การปรับปรุงในระยะสั้น
3. **Long-term**: การพัฒนาในระยะยาว

### 📊 คะแนนการ Review
- **Angular Best Practices**: ⭐⭐⭐⭐⭐ (1-5)
- **Component Architecture**: ⭐⭐⭐⭐⭐ (1-5)
- **Type Safety**: ⭐⭐⭐⭐⭐ (1-5)
- **Performance**: ⭐⭐⭐⭐⭐ (1-5)
- **Accessibility**: ⭐⭐⭐⭐⭐ (1-5)
- **TanStack Query**: ⭐⭐⭐⭐⭐ (1-5) (ถ้ามี)
- **Tailwind CSS**: ⭐⭐⭐⭐⭐ (1-5) (ถ้ามี)
- **Code Quality**: ⭐⭐⭐⭐⭐ (1-5)
- **Overall**: ⭐⭐⭐⭐⭐ (1-5)

---

## 💡 เคล็ดลับเพิ่มเติม

### สิ่งที่ควรตรวจสอบเป็นพิเศษสำหรับ Angular 21:
1. **การใช้ Signals**: ตรวจสอบว่าใช้ signals อย่างถูกต้องและมีประสิทธิภาพ
2. **Standalone Components**: ตรวจสอบวไม่มีการใช้ NgModule ที่ไม่จำเป็น
3. **Modern Template Syntax**: ตรวจสอบการใช้ native control flow
4. **Dependency Injection**: ตรวจสอบการใช้ `inject()` function
5. **Type Safety**: ตรวจสอบ TypeScript types อย่างละเอียด
6. **Component Patterns**: ตรวจสอบตาม `angular-component` skill
7. **TanStack Query**: ตรวจสอบ data fetching patterns ตาม `angular-best-practices-tanstack` skill
8. **Tailwind CSS**: ตรวจสอบ styling patterns ตาม `frontend-tailwind-best-practices` skill

### รูปแบบการให้ข้อเสนอแนะ:
- **เฉพาะเจาะจง**: ระบุตำแหน่งในโค้ด (line number)
- **ให้เหตุผล**: อธิบายว่าทำไมต้องแก้ไข
- **ตัวอย่าง**: แสดงตัวอย่างโค้ดที่ดีกว่า
- **ประโยชน์**: อธิบายประโยชน์ที่จะได้รับจากการแก้ไข

---

## 🎯 ตัวอย่างการใช้งาน

### คำสั่ง Review:
```
โปรด review component ต่อไปนี้ตามเกณฑ์ Angular 21:
- ไฟล์: user-profile.component.ts
- วัตถุประสงค์: Component สำหรับแสดงข้อมูลผู้ใช้
- ให้คะแนนและข้อเสนอแนะตาม checklist ข้างต้น
- ใช้ความรู้จากทุก skills (angular-best-practices-v20, angular-component, angular-best-practices-tanstack, frontend-tailwind-best-practices) ในการ review
```

### การวิเคราะห์โค้ด:
1. **อ่านความรู้จากทุก skills ก่อนเริ่ม**:
   - `angular-best-practices-v20` - Core Angular best practices
   - `angular-component` - Component patterns และ architecture
   - `angular-best-practices-tanstack` - TanStack Query patterns (ถ้ามี)
   - `frontend-tailwind-best-practices` - Tailwind CSS patterns (ถ้ามี)
2. อ่านโค้ดทั้งหมด
3. ตรวจสอบตาม checklist ข้างต้น
4. เปรียบเทียบกับ best practices จากทุก skills
5. ระบุประเด็นที่ดี ข้อเสนอแนะ และปัญหา
6. ให้คะแนนและสรุปผล
7. เสนอแนะการปรับปรุง

### รูปแบบการให้ข้อเสนอแนะที่ดี:
```
❌ **ปัญหา (Line 15):** ใช้ @Input() decorator แทน input() function
📋 **Best Practice:** จาก angular-best-practices-v20 skill ควรใช้ input() function
✅ **แก้ไข:**
  // Before
  @Input() userName: string = '';
  
  // After  
  readonly userName = input.required<string>();
🎯 **ประโยชน์:** เข้ากับ Angular v20+ signals และมี performance ดีกว่า

---

❌ **ปัญหา (Line 32):** ใช้ custom CSS class แทน Tailwind utilities
📋 **Best Practice:** จาก frontend-tailwind-best-practices skill ควรใช้ Tailwind utilities
✅ **แก้ไข:**
  // Before
  <div class="custom-button">
  
  // After  
  <div class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
🎯 **ประโยชน์:** Consistent design system และ smaller bundle size

---

❌ **ปัญหา (Line 45):** ไม่มี query key factory สำหรับ TanStack Query
📋 **Best Practice:** จาก angular-best-practices-tanstack skill ควรใช้ query key factory
✅ **แก้ไข:**
  // Before
  queryKey: ['posts', this.searchParams()]
  
  // After  
  queryKey: BlogQueryKeys.postsList(this.searchParams())
🎯 **ประโยชน์:** Better cache management และ consistency
```

---

## 📚 อ้างอิงเพิ่มเติม
- **🔥 angular-best-practices-v20 skill** - Angular v20+ best practices
- **🔥 angular-component skill** - Component creation patterns และ architecture
- **🔥 angular-best-practices-tanstack skill** - TanStack Query integration best practices
- **🔥 frontend-tailwind-best-practices skill** - Tailwind CSS patterns และ conventions
- [Angular 21 Documentation](https://angular.io/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🔄 ขั้นตอนการ Review แบบบูรณาการ
1. **เรียกใช้ทุก skills** ที่เกี่ยวข้องก่อนเริ่ม:
   - `angular-best-practices-v20` (สำหรับทุกการ review)
   - `angular-component` (สำหรับ component review)
   - `angular-best-practices-tanstack` (สำหรับ TanStack Query review)
   - `frontend-tailwind-best-practices` (สำหรับ Tailwind CSS review)
2. **ทบทวน checklist** ใน prompt template นี้
3. **อ่านโค้ดที่ต้องการ review**
4. **เปรียบเทียบกับ best practices** จากทุก skills ที่เกี่ยวข้อง
5. **บันทึกผลการ review** ตามรูปแบบที่กำหนด
6. **ให้คะแนนและข้อเสนอแนะ** อย่างมีเหตุผล