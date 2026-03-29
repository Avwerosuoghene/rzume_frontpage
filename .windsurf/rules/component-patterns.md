---
description: Component development patterns and best practices
trigger: glob
glob: "*.component.*"
---

# Component Development Patterns

## Component Architecture

### Smart vs Presentation Components

#### Smart Components (Container/Page Components)
- Located in `src/app/pages/`
- Handle business logic and state management
- Integrate with services
- Manage routing and navigation
- Coordinate multiple child components
- Example: `AboutComponent`, `FeaturesComponent`

#### Presentation Components (Dumb Components)
- Located in `src/app/components/`
- Pure presentation logic
- Input/Output driven
- No direct service dependencies
- Highly reusable
- Example: `BlogComponent`, `BlogPostComponent`

### Component Structure Template

```typescript
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-feature-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-component.component.html',
  styleUrl: './feature-component.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureComponent implements OnInit, OnDestroy {
  // 1. Inputs (for presentation components)
  @Input() data!: DataType;
  @Input() config?: ConfigType;
  
  // 2. Outputs (for presentation components)
  @Output() actionPerformed = new EventEmitter<ActionType>();
  @Output() dataChanged = new EventEmitter<DataType>();
  
  // 3. Dependency Injection (use inject() function)
  private service = inject(ServiceType);
  private cdr = inject(ChangeDetectorRef);
  
  // 4. Component State
  protected viewData: ViewDataType | null = null;
  protected isLoading = false;
  protected error: string | null = null;
  
  // 5. Subscription Management
  private destroy$ = new Subject<void>();
  
  // 6. Lifecycle Hooks
  ngOnInit(): void {
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // 7. Public Methods (template interactions)
  protected handleAction(event: Event): void {
    // Handle user interaction
    this.actionPerformed.emit({ /* data */ });
  }
  
  // 8. Private Methods (internal logic)
  private loadData(): void {
    this.isLoading = true;
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.viewData = data;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.error = 'Failed to load data';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }
}
```

## Template Patterns

### Modern Control Flow (Angular 20)

```html
<!-- Conditional Rendering -->
@if (isLoading) {
  <div class="loading-spinner">Loading...</div>
} @else if (error) {
  <div class="error-message">{{ error }}</div>
} @else if (data) {
  <div class="content">{{ data.title }}</div>
} @else {
  <div class="empty-state">No data available</div>
}

<!-- List Rendering with Track -->
@for (item of items; track item.id) {
  <div class="item">
    <h3>{{ item.title }}</h3>
    <p>{{ item.description }}</p>
  </div>
} @empty {
  <p>No items to display</p>
}

<!-- Switch Statement -->
@switch (status) {
  @case ('pending') {
    <span class="badge badge-warning">Pending</span>
  }
  @case ('approved') {
    <span class="badge badge-success">Approved</span>
  }
  @case ('rejected') {
    <span class="badge badge-error">Rejected</span>
  }
  @default {
    <span class="badge badge-default">Unknown</span>
  }
}
```

### Event Handling

```html
<!-- Click Events -->
<button (click)="handleClick($event)" [disabled]="isLoading">
  Submit
</button>

<!-- Input Events -->
<input 
  type="text" 
  [value]="searchTerm"
  (input)="onSearchChange($event)"
  placeholder="Search..."
/>

<!-- Custom Events -->
<app-child-component
  [data]="parentData"
  (itemSelected)="onItemSelected($event)"
  (actionCompleted)="onActionCompleted($event)"
></app-child-component>
```

### Class and Style Bindings

```html
<!-- Class Bindings -->
<div 
  [class.active]="isActive"
  [class.disabled]="isDisabled"
  [class.error]="hasError"
>
  Content
</div>

<!-- Style Bindings -->
<div 
  [style.width.px]="width"
  [style.height.px]="height"
  [style.background-color]="backgroundColor"
>
  Styled Content
</div>

<!-- Multiple Classes -->
<div [class]="getClassNames()">
  Dynamic Classes
</div>
```

### Async Pipe Usage

```html
<!-- Observable Data -->
<div class="user-profile">
  @if (user$ | async; as user) {
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  }
</div>

<!-- Multiple Observables -->
<div class="dashboard">
  @if (userData$ | async; as userData) {
    @if (settings$ | async; as settings) {
      <app-dashboard [user]="userData" [settings]="settings"></app-dashboard>
    }
  }
</div>
```

## Styling Patterns

### SCSS Structure (BEM-like)

```scss
@use '../../../styles/theme' as *;

.feature-component {
  padding: 16px;
  background-color: $white;
  
  &__header {
    margin-bottom: 24px;
    
    &-title {
      font-size: 24px;
      font-weight: 600;
      color: $black;
    }
    
    &-subtitle {
      font-size: 14px;
      color: $gray;
    }
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  &__footer {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  &--loading {
    opacity: 0.6;
    pointer-events: none;
  }
  
  &--error {
    border: 1px solid $warning;
  }
}
```

### Responsive Design (Mobile-First)

```scss
.feature-component {
  // Mobile styles (default)
  padding: 12px;
  
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  // Tablet (480px+)
  @media (min-width: 480px) {
    padding: 16px;
    
    &__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
  
  // Desktop (768px+)
  @media (min-width: 768px) {
    padding: 24px;
    
    &__grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
  }
}
```

### Using Theme Variables

```scss
@use '../../../styles/theme' as *;

.feature-component {
  // Use theme colors
  background-color: $white;
  color: $black;
  border: 1px solid $light-gray;
  
  &__button {
    // Extend button styles from general_styles.scss
    @extend .rzume-button-primary;
  }
  
  &__link {
    color: $rzume-blue;
    
    &:hover {
      color: darken($rzume-blue, 10%);
    }
  }
  
  &__success {
    background-color: $basic-green-light;
    color: $basic-green;
  }
  
  &__warning {
    background-color: $warning-light;
    color: $warning;
  }
}
```

## Component Communication

### Parent to Child (Input)

```typescript
// Parent Component
@Component({
  template: `
    <app-child 
      [data]="parentData"
      [config]="configuration"
    ></app-child>
  `
})
export class ParentComponent {
  parentData = { id: 1, name: 'Test' };
  configuration = { theme: 'dark' };
}

// Child Component
@Component({
  selector: 'app-child'
})
export class ChildComponent {
  @Input() data!: DataType;
  @Input() config?: ConfigType;
}
```

### Child to Parent (Output)

```typescript
// Child Component
@Component({
  selector: 'app-child'
})
export class ChildComponent {
  @Output() itemSelected = new EventEmitter<Item>();
  
  selectItem(item: Item): void {
    this.itemSelected.emit(item);
  }
}

// Parent Component
@Component({
  template: `
    <app-child (itemSelected)="onItemSelected($event)"></app-child>
  `
})
export class ParentComponent {
  onItemSelected(item: Item): void {
    console.log('Selected:', item);
  }
}
```

### Service-Based Communication

```typescript
// Shared Service
@Injectable({ providedIn: 'root' })
export class DataSharingService {
  private dataSubject = new BehaviorSubject<Data | null>(null);
  data$ = this.dataSubject.asObservable();
  
  updateData(data: Data): void {
    this.dataSubject.next(data);
  }
}

// Component A (Publisher)
export class ComponentA {
  private dataService = inject(DataSharingService);
  
  publishData(): void {
    this.dataService.updateData({ id: 1, value: 'test' });
  }
}

// Component B (Subscriber)
export class ComponentB implements OnInit, OnDestroy {
  private dataService = inject(DataSharingService);
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.dataService.data$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => console.log('Received:', data));
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Animation Integration

### Using AnimationService

```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AnimationService } from '../../core/services/animation.service';

@Component({
  selector: 'app-animated-component',
  standalone: true,
  templateUrl: './animated-component.component.html',
  styleUrl: './animated-component.component.scss'
})
export class AnimatedComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;
  @ViewChild('heroImage') heroImage!: ElementRef<HTMLElement>;
  
  private animationService = inject(AnimationService);
  
  ngAfterViewInit(): void {
    // Hero scroll animation
    this.animationService.initHeroScrollAnimation(
      this.heroSection.nativeElement,
      this.heroImage.nativeElement
    );
    
    // Staggered card animation
    const cards = Array.from(
      this.heroSection.nativeElement.querySelectorAll('.card')
    ) as HTMLElement[];
    this.animationService.initStaggeredCardAnimation(cards, 150);
  }
  
  ngOnDestroy(): void {
    this.animationService.cleanupElement(this.heroSection.nativeElement);
  }
}
```

## Testing Patterns

### Component Test Template

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureComponent } from './feature.component';
import { FeatureService } from '../../core/services/feature.service';
import { of, throwError } from 'rxjs';

describe('FeatureComponent', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;
  let mockService: jasmine.SpyObj<FeatureService>;
  
  beforeEach(async () => {
    mockService = jasmine.createSpyObj('FeatureService', ['getData', 'updateData']);
    
    await TestBed.configureTestingModule({
      imports: [FeatureComponent],
      providers: [
        { provide: FeatureService, useValue: mockService }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load data on init', () => {
    const mockData = { id: 1, name: 'Test' };
    mockService.getData.and.returnValue(of(mockData));
    
    fixture.detectChanges();
    
    expect(mockService.getData).toHaveBeenCalled();
    expect(component.viewData).toEqual(mockData);
  });
  
  it('should handle errors', () => {
    mockService.getData.and.returnValue(throwError(() => new Error('Test error')));
    
    fixture.detectChanges();
    
    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });
  
  it('should emit event on action', () => {
    spyOn(component.actionPerformed, 'emit');
    
    component.handleAction(new Event('click'));
    
    expect(component.actionPerformed.emit).toHaveBeenCalled();
  });
});
```

### Testing Input/Output

```typescript
it('should accept input data', () => {
  const testData = { id: 1, name: 'Test' };
  component.data = testData;
  fixture.detectChanges();
  
  expect(component.data).toEqual(testData);
});

it('should emit output event', () => {
  let emittedValue: any;
  component.itemSelected.subscribe((value: any) => {
    emittedValue = value;
  });
  
  const testItem = { id: 1, name: 'Test' };
  component.selectItem(testItem);
  
  expect(emittedValue).toEqual(testItem);
});
```

## Performance Optimization

### OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizedComponent {
  private cdr = inject(ChangeDetectorRef);
  
  updateData(newData: Data): void {
    this.data = newData;
    // Manually trigger change detection
    this.cdr.markForCheck();
  }
}
```

### TrackBy Functions

```typescript
export class ListComponent {
  items: Item[] = [];
  
  trackById(index: number, item: Item): string {
    return item.id;
  }
  
  trackByIndex(index: number): number {
    return index;
  }
}

// Template
@for (item of items; track item.id) {
  <div class="item">{{ item.name }}</div>
}
```

### Lazy Loading Child Components

```typescript
// Dynamic component loading
import { Component, ViewContainerRef, inject } from '@angular/core';

export class ParentComponent {
  private viewContainer = inject(ViewContainerRef);
  
  async loadChildComponent(): Promise<void> {
    const { ChildComponent } = await import('./child/child.component');
    this.viewContainer.createComponent(ChildComponent);
  }
}
```

## Accessibility

### ARIA Attributes

```html
<button 
  aria-label="Close dialog"
  aria-pressed="false"
  (click)="closeDialog()"
>
  <span aria-hidden="true">&times;</span>
</button>

<div 
  role="alert" 
  aria-live="polite"
  [attr.aria-busy]="isLoading"
>
  @if (error) {
    <p>{{ error }}</p>
  }
</div>
```

### Keyboard Navigation

```typescript
export class AccessibleComponent {
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.performAction();
    }
    
    if (event.key === 'Escape') {
      this.closeDialog();
    }
  }
}
```

## Best Practices Checklist

Before completing a component, verify:
- ✅ Uses `ChangeDetectionStrategy.OnPush`
- ✅ Proper subscription management with `takeUntil`
- ✅ Modern control flow (`@if`, `@for`, `@switch`)
- ✅ Singular `styleUrl` (not `styleUrls`)
- ✅ Uses `inject()` for dependency injection
- ✅ Implements `OnDestroy` for cleanup
- ✅ TrackBy functions for lists
- ✅ Proper error handling
- ✅ Accessibility attributes
- ✅ Responsive design
- ✅ Theme variables for colors
- ✅ Unit tests written
- ✅ Clear component responsibility (smart vs presentation)
