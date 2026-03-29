---
description: Generate a complete Angular component with tests and proper structure
---

# Create Component Workflow

## Overview
Generates a complete Angular component following project standards with:
- Standalone component structure
- OnPush change detection
- Template with modern control flow
- SCSS with theme variables
- Unit tests
- Proper imports and exports

## Workflow Steps

### Step 1: Gather Requirements
Ask the user for:
1. **Component name** (e.g., user-profile, blog-card)
2. **Component type**:
   - Page component (container) → `src/app/pages/`
   - Presentation component → `src/app/components/`
3. **Parent directory** (if nested under existing feature)
4. **Specific features**:
   - Inputs needed
   - Outputs needed
   - Services to inject
   - Special functionality

### Step 2: Create Component Directory
Create directory structure:
```
src/app/[pages|components]/[component-name]/
├── [component-name].component.ts
├── [component-name].component.html
├── [component-name].component.scss
└── [component-name].component.spec.ts
```

### Step 3: Generate Component TypeScript File

**For Presentation Components:**
```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-[component-name]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[component-name].component.html',
  styleUrl: './[component-name].component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [ComponentName]Component {
  @Input() data!: DataType;
  @Output() actionPerformed = new EventEmitter<ActionType>();
  
  protected handleAction(): void {
    this.actionPerformed.emit({ /* data */ });
  }
}
```

**For Page Components:**
```typescript
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-[component-name]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[component-name].component.html',
  styleUrl: './[component-name].component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [ComponentName]Component implements OnInit, OnDestroy {
  private service = inject(ServiceType);
  private cdr = inject(ChangeDetectorRef);
  
  protected data: DataType | null = null;
  protected isLoading = false;
  protected error: string | null = null;
  
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadData(): void {
    this.isLoading = true;
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.data = data;
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

### Step 4: Generate Component HTML Template

```html
<div class="[component-name]">
  @if (isLoading) {
    <div class="[component-name]__loading">Loading...</div>
  } @else if (error) {
    <div class="[component-name]__error">{{ error }}</div>
  } @else if (data) {
    <div class="[component-name]__content">
      <h2 class="[component-name]__title">{{ data.title }}</h2>
      <p class="[component-name]__description">{{ data.description }}</p>
    </div>
  }
</div>
```

### Step 5: Generate Component SCSS File

```scss
@use '../../../styles/theme' as *;

.[component-name] {
  padding: $spacing-md;
  
  &__loading {
    text-align: center;
    color: $gray;
  }
  
  &__error {
    padding: 12px;
    background-color: $warning-light;
    color: $warning;
    border-radius: 4px;
  }
  
  &__content {
    // Content styles
  }
  
  &__title {
    font-size: 24px;
    font-weight: 600;
    color: $black;
    margin-bottom: 12px;
  }
  
  &__description {
    font-size: 16px;
    color: $gray;
    line-height: 1.6;
  }
  
  // Responsive
  @media (min-width: 768px) {
    padding: $spacing-lg;
    
    &__title {
      font-size: 32px;
    }
  }
}
```

### Step 6: Generate Component Spec File

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { [ComponentName]Component } from './[component-name].component';

describe('[ComponentName]Component', () => {
  let component: [ComponentName]Component;
  let fixture: ComponentFixture<[ComponentName]Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [[ComponentName]Component]
    }).compileComponents();

    fixture = TestBed.createComponent([ComponentName]Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  // Add more tests based on component functionality
});
```

### Step 7: Update Routing (if Page Component)

If creating a page component, add route to `app.routes.ts`:

```typescript
{
  path: '[route-path]',
  loadComponent: () => import('./pages/[component-name]/[component-name].component')
    .then(m => m.[ComponentName]Component)
}
```

### Step 8: Verify and Test

1. **Compile check**: Ensure no TypeScript errors
2. **Run tests**: `ng test`
3. **Visual check**: Run dev server and verify component renders
4. **Accessibility**: Check focus states and ARIA attributes

## Customization Options

### Adding Material Components
```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatButtonModule, MatIconModule],
  // ...
})
```

### Adding Forms
```typescript
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected form!: FormGroup;
  
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
}
```

### Adding Animations
```typescript
import { AnimationService } from '../../core/services/animation.service';

export class AnimatedComponent implements AfterViewInit, OnDestroy {
  @ViewChild('element') element!: ElementRef<HTMLElement>;
  private animationService = inject(AnimationService);
  
  ngAfterViewInit(): void {
    this.animationService.initStaggeredCardAnimation([this.element.nativeElement]);
  }
  
  ngOnDestroy(): void {
    this.animationService.cleanupElement(this.element.nativeElement);
  }
}
```

## Checklist

Before completing, verify:
- ✅ Component uses `ChangeDetectionStrategy.OnPush`
- ✅ Uses singular `styleUrl` (not `styleUrls`)
- ✅ Uses `inject()` for dependency injection
- ✅ Implements `OnDestroy` with cleanup if using subscriptions
- ✅ Uses modern control flow (`@if`, `@for`, `@switch`)
- ✅ SCSS uses theme variables
- ✅ SCSS follows BEM naming
- ✅ Unit tests created
- ✅ Component is properly exported
- ✅ No TypeScript errors
- ✅ Follows mobile-first responsive design
