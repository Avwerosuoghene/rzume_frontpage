# Pages Directory Agent

## Context
You are working in the `src/app/pages/` directory, which contains **page components** (also called "smart" or "container" components).

## Component Philosophy

### Page Components
Components in this directory should be:
- **Container components**: Orchestrate presentation components
- **Service integration**: Inject and use services
- **State management**: Manage page-level state
- **Routing**: Handle route parameters and navigation
- **Business logic**: Coordinate data flow and user actions

### Examples in This Project
- `AboutComponent`: About page container
- `FeaturesComponent`: Features page container
- `BlogComponent`: Blog page container
- `FaqComponent`: FAQ page container

## Component Structure

### Standard Template
```typescript
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-page-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-name.component.html',
  styleUrl: './page-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNameComponent implements OnInit, OnDestroy {
  // Services
  private service = inject(ServiceType);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  // State
  protected data: DataType | null = null;
  protected isLoading = false;
  protected error: string | null = null;
  
  // Cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadData();
    this.subscribeToRouteParams();
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
  
  private subscribeToRouteParams(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        // Handle route parameters
      });
  }
  
  protected handleAction(data: ActionData): void {
    // Handle user actions
    this.router.navigate(['/next-page']);
  }
}
```

## Required Patterns

### Always Use
- ✅ `OnInit` and `OnDestroy` lifecycle hooks
- ✅ `takeUntil(destroy$)` for subscription cleanup
- ✅ `ChangeDetectionStrategy.OnPush`
- ✅ `inject()` for dependency injection
- ✅ `cdr.markForCheck()` after async updates
- ✅ Error handling for all async operations

### Subscription Management
```typescript
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.service.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.data = data;
      this.cdr.markForCheck();
    });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## Routing Integration

### Route Parameters
```typescript
ngOnInit(): void {
  this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      const id = params['id'];
      this.loadItem(id);
    });
}
```

### Query Parameters
```typescript
ngOnInit(): void {
  this.route.queryParams
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      const filter = params['filter'];
      this.applyFilter(filter);
    });
}
```

### Navigation
```typescript
protected navigateToDetail(id: string): void {
  this.router.navigate(['/items', id]);
}

protected navigateWithQuery(): void {
  this.router.navigate(['/items'], {
    queryParams: { filter: 'active' }
  });
}
```

## Service Integration

### Injecting Services
```typescript
private dataService = inject(DataService);
private stateService = inject(StateService);
private facadeService = inject(FacadeService);
```

### Using Facade Services
```typescript
export class PageComponent implements OnInit {
  private facade = inject(FeatureFacadeService);
  
  protected data$ = this.facade.data$;
  protected isLoading$ = this.facade.isLoading$;
  protected error$ = this.facade.error$;
  
  ngOnInit(): void {
    this.facade.loadData();
  }
  
  protected handleCreate(data: CreateDto): void {
    this.facade.createItem(data).subscribe({
      next: () => this.router.navigate(['/success']),
      error: (error) => this.handleError(error)
    });
  }
}
```

## State Management

### Component-Level State
```typescript
export class PageComponent {
  // UI State
  protected isLoading = false;
  protected error: string | null = null;
  protected selectedTab = 0;
  
  // Data State
  protected items: Item[] = [];
  protected selectedItem: Item | null = null;
  
  // Form State
  protected isFormDirty = false;
  protected isFormValid = false;
}
```

### Using Observables
```typescript
export class PageComponent {
  private facade = inject(FacadeService);
  
  // Expose observables directly
  protected data$ = this.facade.data$;
  protected loading$ = this.facade.loading$;
  
  // Or combine observables
  protected vm$ = combineLatest({
    data: this.facade.data$,
    loading: this.facade.loading$,
    error: this.facade.error$
  });
}

// Template
@if (vm$ | async; as vm) {
  @if (vm.loading) {
    <div>Loading...</div>
  } @else if (vm.error) {
    <div>{{ vm.error }}</div>
  } @else {
    <div>{{ vm.data }}</div>
  }
}
```

## Template Patterns

### Loading States
```html
<div class="page">
  @if (isLoading) {
    <div class="page__loading">
      <mat-spinner></mat-spinner>
      <p>Loading...</p>
    </div>
  } @else if (error) {
    <div class="page__error">
      <p>{{ error }}</p>
      <button (click)="retry()">Retry</button>
    </div>
  } @else if (data) {
    <div class="page__content">
      <!-- Content -->
    </div>
  }
</div>
```

### Using Presentation Components
```html
<div class="page">
  <app-page-header
    [title]="pageTitle"
    [subtitle]="pageSubtitle"
  ></app-page-header>
  
  <app-item-list
    [items]="items"
    [loading]="isLoading"
    (itemSelected)="handleItemSelect($event)"
    (itemDeleted)="handleItemDelete($event)"
  ></app-item-list>
  
  <app-pagination
    [currentPage]="currentPage"
    [totalPages]="totalPages"
    (pageChanged)="handlePageChange($event)"
  ></app-pagination>
</div>
```

## Testing

### Page Component Test Template
```typescript
describe('PageNameComponent', () => {
  let component: PageNameComponent;
  let fixture: ComponentFixture<PageNameComponent>;
  let mockService: jasmine.SpyObj<ServiceType>;
  let router: Router;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('ServiceType', ['getData', 'updateData']);
    
    await TestBed.configureTestingModule({
      imports: [PageNameComponent, RouterTestingModule],
      providers: [
        { provide: ServiceType, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PageNameComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should load data on init', () => {
    const mockData = { id: '1', name: 'Test' };
    mockService.getData.and.returnValue(of(mockData));

    fixture.detectChanges();

    expect(mockService.getData).toHaveBeenCalled();
    expect(component.data).toEqual(mockData);
  });

  it('should handle errors', () => {
    mockService.getData.and.returnValue(throwError(() => new Error('Test error')));

    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  it('should navigate on action', () => {
    spyOn(router, 'navigate');
    
    component.handleAction({ id: '1' });
    
    expect(router.navigate).toHaveBeenCalledWith(['/next-page']);
  });
});
```

## Lazy Loading

### Route Configuration
All page components should be lazy-loaded in `app.routes.ts`:

```typescript
{
  path: 'page-name',
  loadComponent: () => import('./pages/page-name/page-name.component')
    .then(m => m.PageNameComponent)
}
```

## Best Practices

### Do's
- ✅ Implement OnInit and OnDestroy
- ✅ Use takeUntil for subscription cleanup
- ✅ Handle loading and error states
- ✅ Use facade services for complex logic
- ✅ Delegate presentation to child components
- ✅ Use OnPush change detection
- ✅ Manually trigger change detection after async updates

### Don'ts
- ❌ Don't forget to unsubscribe
- ❌ Don't put presentation logic in page components
- ❌ Don't make HTTP calls directly (use services)
- ❌ Don't forget error handling
- ❌ Don't skip loading states
- ❌ Don't manipulate DOM directly

## Common Patterns

### Master-Detail Pattern
```typescript
export class ListPageComponent {
  protected items: Item[] = [];
  protected selectedItem: Item | null = null;
  
  protected selectItem(item: Item): void {
    this.selectedItem = item;
  }
}
```

### Form Handling
```typescript
export class FormPageComponent {
  private fb = inject(FormBuilder);
  protected form!: FormGroup;
  
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  protected submit(): void {
    if (this.form.valid) {
      this.service.create(this.form.value).subscribe({
        next: () => this.router.navigate(['/success']),
        error: (error) => this.handleError(error)
      });
    }
  }
}
```

### Search and Filter
```typescript
export class SearchPageComponent {
  protected searchTerm = '';
  protected filters: Filters = {};
  
  protected search(term: string): void {
    this.searchTerm = term;
    this.loadData();
  }
  
  protected applyFilter(filter: Filters): void {
    this.filters = filter;
    this.loadData();
  }
  
  private loadData(): void {
    this.service.search(this.searchTerm, this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.items = data;
        this.cdr.markForCheck();
      });
  }
}
```

## Related Documentation
- See `.windsurf/rules/component-patterns.md` for detailed patterns
- See `.windsurf/workflows/create-component.md` for creation workflow
- See `src/app/components/AGENTS.md` for presentation component patterns
- See `src/app/core/services/AGENTS.md` for service patterns
