---
description: Complete workflow for adding a new feature to the application
---

# Add Feature Workflow

## Overview
Complete workflow for adding a new feature including:
- Feature planning and architecture
- Component creation
- Service creation
- Routing setup
- Testing
- Documentation

## Workflow Steps

### Step 1: Feature Planning

Ask the user:
1. **Feature name** and description
2. **Feature scope**:
   - What pages/components are needed?
   - What data/APIs are involved?
   - What user interactions are required?
3. **Dependencies**:
   - New services needed?
   - External libraries required?
   - API endpoints needed?

### Step 2: Create Feature Structure

Create directory structure:
```
src/app/
├── pages/[feature-name]/
│   └── [feature-name].component.ts
├── components/[feature-name]/
│   ├── [sub-component-1]/
│   └── [sub-component-2]/
└── core/
    ├── services/
    │   └── [feature-name].service.ts
    └── models/
        ├── interfaces/
        │   └── [feature-name].interface.ts
        └── constants/
            └── [feature-name].constants.ts
```

### Step 3: Define Data Models

Create interfaces in `src/app/core/models/interfaces/[feature-name].interface.ts`:

```typescript
export interface [FeatureName]Data {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Create[FeatureName]Dto {
  name: string;
  description: string;
}

export interface Update[FeatureName]Dto {
  name?: string;
  description?: string;
}
```

Create constants in `src/app/core/models/constants/[feature-name].constants.ts`:

```typescript
export const [FEATURE_NAME]_CONFIG = {
  itemsPerPage: 10,
  maxItems: 100,
  defaultSort: 'createdAt'
} as const;

export const [FEATURE_NAME]_ROUTES = {
  list: '/[feature-name]',
  detail: '/[feature-name]/:id',
  create: '/[feature-name]/new',
  edit: '/[feature-name]/:id/edit'
} as const;
```

Update barrel export in `src/app/core/models/index.ts`:
```typescript
export * from './interfaces/[feature-name].interface';
export * from './constants/[feature-name].constants';
```

### Step 4: Create Services

#### Data Service
Use the **Create Service** workflow to generate:
- `[feature-name]-data.service.ts` - API integration
- `[feature-name]-state.service.ts` - State management
- `[feature-name]-facade.service.ts` - Business logic

### Step 5: Create Page Component

Use the **Create Component** workflow to generate the main page component:
- Location: `src/app/pages/[feature-name]/`
- Type: Page component (container)
- Inject facade service
- Handle routing and navigation

Example:
```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { [FeatureName]FacadeService } from '../../core/services';
import { [FeatureName]Data } from '../../core/models';

@Component({
  selector: 'app-[feature-name]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './[feature-name].component.html',
  styleUrl: './[feature-name].component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class [FeatureName]Component implements OnInit, OnDestroy {
  private facade = inject([FeatureName]FacadeService);
  private router = inject(Router);
  
  protected data$ = this.facade.data$;
  protected isLoading$ = this.facade.isLoading$;
  protected error$ = this.facade.error$;
  
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.facade.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  protected handleItemClick(item: [FeatureName]Data): void {
    this.router.navigate(['/[feature-name]', item.id]);
  }
}
```

### Step 6: Create Presentation Components

Use the **Create Component** workflow for each sub-component:
- Location: `src/app/components/[feature-name]/`
- Type: Presentation component
- Input/Output driven
- No direct service dependencies

Example components:
- `[feature-name]-list` - Display list of items
- `[feature-name]-card` - Display individual item
- `[feature-name]-form` - Create/edit form
- `[feature-name]-detail` - Detail view

### Step 7: Add Routing

Update `src/app/app.routes.ts`:

```typescript
{
  path: '[feature-name]',
  loadComponent: () => import('./pages/[feature-name]/[feature-name].component')
    .then(m => m.[FeatureName]Component)
},
{
  path: '[feature-name]/:id',
  loadComponent: () => import('./pages/[feature-name]-detail/[feature-name]-detail.component')
    .then(m => m.[FeatureName]DetailComponent)
}
```

### Step 8: Add Navigation (if needed)

Update navigation constants in `src/app/core/models/constants/navigation.constants.ts`:

```typescript
export const NAVIGATION_ITEMS = [
  // ... existing items
  {
    label: '[Feature Name]',
    route: '/[feature-name]',
    icon: 'icon-name'
  }
];
```

### Step 9: Create Tests

#### Service Tests
```typescript
// [feature-name]-data.service.spec.ts
// [feature-name]-state.service.spec.ts
// [feature-name]-facade.service.spec.ts
```

#### Component Tests
```typescript
// [feature-name].component.spec.ts
// [feature-name]-list.component.spec.ts
// [feature-name]-card.component.spec.ts
```

#### Integration Tests
Test the complete feature flow:
```typescript
describe('[FeatureName] Integration', () => {
  it('should load and display data', () => {
    // Test complete flow
  });
  
  it('should create new item', () => {
    // Test creation flow
  });
  
  it('should update existing item', () => {
    // Test update flow
  });
});
```

### Step 10: Add Mock Data (for development)

Create mock data in `src/app/core/models/mocks/[feature-name].mock.ts`:

```typescript
import { [FeatureName]Data } from '../interfaces/[feature-name].interface';

export const MOCK_[FEATURE_NAME]_DATA: [FeatureName]Data[] = [
  {
    id: '1',
    name: 'Sample Item 1',
    description: 'Description for item 1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Sample Item 2',
    description: 'Description for item 2',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];
```

### Step 11: Documentation

Create feature documentation:

#### Feature README
Create `src/app/pages/[feature-name]/README.md`:

```markdown
# [Feature Name]

## Overview
Brief description of the feature.

## Components
- **[FeatureName]Component**: Main page component
- **[FeatureName]ListComponent**: List view
- **[FeatureName]CardComponent**: Card display
- **[FeatureName]FormComponent**: Create/edit form

## Services
- **[FeatureName]DataService**: API integration
- **[FeatureName]StateService**: State management
- **[FeatureName]FacadeService**: Business logic

## Routes
- `/[feature-name]` - List view
- `/[feature-name]/:id` - Detail view
- `/[feature-name]/new` - Create new
- `/[feature-name]/:id/edit` - Edit existing

## Data Models
See `src/app/core/models/interfaces/[feature-name].interface.ts`

## Usage Example
\`\`\`typescript
// In a component
private facade = inject([FeatureName]FacadeService);

ngOnInit() {
  this.facade.loadData();
}
\`\`\`

## Testing
Run tests: `ng test --include='**/*[feature-name]*'`
```

### Step 12: Verify Feature

1. **Compile**: `ng build`
2. **Tests**: `ng test`
3. **Dev Server**: `ng serve`
4. **Manual Testing**:
   - Navigate to feature route
   - Test all user interactions
   - Verify error handling
   - Check responsive design
   - Test accessibility

### Step 13: Code Review Checklist

Before completing, verify:
- ✅ All components use OnPush change detection
- ✅ All services have proper error handling
- ✅ All observables are properly unsubscribed
- ✅ Routes are lazy-loaded
- ✅ Tests are written and passing
- ✅ Code follows project conventions
- ✅ SCSS uses theme variables
- ✅ Modern control flow syntax used
- ✅ No TypeScript errors
- ✅ No console errors/warnings
- ✅ Accessibility requirements met
- ✅ Mobile-responsive design
- ✅ Documentation is complete

## Example: Adding a "Products" Feature

### 1. Planning
- Feature: Product catalog with list, detail, and search
- Components: ProductsComponent, ProductListComponent, ProductCardComponent, ProductDetailComponent
- Services: ProductDataService, ProductStateService, ProductFacadeService
- Routes: /products, /products/:id

### 2. Models
```typescript
// product.interface.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}
```

### 3. Services
- ProductDataService: GET /api/products, GET /api/products/:id
- ProductStateService: Manage products array, selected product, filters
- ProductFacadeService: loadProducts(), selectProduct(), searchProducts()

### 4. Components
- ProductsComponent (page): Main container, handles routing
- ProductListComponent: Displays grid of products
- ProductCardComponent: Individual product card
- ProductDetailComponent: Product details page

### 5. Routes
```typescript
{ path: 'products', loadComponent: ... },
{ path: 'products/:id', loadComponent: ... }
```

### 6. Testing
- Unit tests for all services and components
- Integration test for product search flow
- E2E test for product browsing

## Tips

- **Start Small**: Begin with minimal functionality, then iterate
- **Reuse Components**: Check if existing components can be reused
- **Follow Patterns**: Use existing features as reference
- **Test Early**: Write tests as you build, not after
- **Document**: Keep documentation up-to-date
- **Review**: Get code review before merging
