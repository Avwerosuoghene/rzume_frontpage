---
name: web-architect
description: Enterprise-grade architectural planning and design for Angular features
tags: [architecture, planning, design, enterprise, ddd, angular]
---

# Web Architect Skill

Enterprise-grade architectural planning and documentation for Angular 20 applications. This skill combines strategic design principles with tactical implementation planning to ensure scalable, maintainable solutions aligned with the Rzume Frontpage project standards.

## Overview

The Web Architect skill operates at a high level of abstraction, focusing on:
- **Strategic Design**: Domain-driven design principles and bounded contexts
- **Architectural Patterns**: Layered architecture, abstraction layers, and separation of concerns
- **Technical Documentation**: Comprehensive design documents and implementation guides
- **System Integration**: How new features integrate with existing architecture
- **Quality Assurance**: Architecture validation and best practices enforcement

## Project Context

### Current Architecture
- **Framework**: Angular 20.3.0 with standalone components
- **UI Library**: Angular Material 20.2.10
- **State Management**: BehaviorSubject pattern (no NgRx)
- **Routing**: Lazy-loaded routes with `loadComponent()`
- **Styling**: SCSS with custom theme system
- **Testing**: Jasmine/Karma with 80%+ coverage requirement

### Directory Structure
```
src/app/
├── components/        # Reusable presentation components
├── pages/            # Page-level container components (lazy-loaded)
├── core/             # Core application functionality
│   ├── services/     # Singleton services
│   ├── models/       # Data models, interfaces, enums, constants
│   │   ├── interfaces/
│   │   ├── enums/
│   │   ├── constants/
│   │   └── mocks/
│   ├── helpers/      # Utility functions
│   ├── pipes/        # Custom pipes
│   └── directives/   # Custom directives
├── shared/           # Shared components
└── styles/           # Global styles and theme
```

### Architectural Constraints
- ✅ **Standalone components only** (no NgModules)
- ✅ **OnPush change detection** for all components
- ✅ **Modern control flow** (`@if`, `@for`, `@switch`)
- ✅ **inject() function** for dependency injection
- ✅ **TypeScript strict mode** enabled
- ✅ **Bundle budgets**: 1MB initial, 12kB component styles

---

## Workflow Phases

### Phase 1: Discovery & Analysis

#### 1.1 Understand Feature Requirements
**Objective**: Gather comprehensive understanding of the feature

**Actions**:
1. Review feature request and user stories
2. Identify business objectives and success criteria
3. Determine acceptance criteria
4. Analyze user personas and use cases
5. Identify constraints (technical, business, timeline)

**Questions to Ask**:
- What business problem does this feature solve?
- Who are the primary users of this feature?
- What are the critical user journeys?
- Are there any performance requirements?
- What are the security/privacy considerations?
- Are there any third-party integrations needed?
- How does this align with existing features?

**Deliverable**: Feature Requirements Document
```markdown
# Feature Requirements: [Feature Name]

## Business Objectives
- [Objective 1]
- [Objective 2]

## User Stories
- As a [user type], I want [goal] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Constraints
- Technical: [constraints]
- Business: [constraints]
- Timeline: [constraints]

## Success Metrics
- [Metric 1]: [target]
- [Metric 2]: [target]
```

#### 1.2 System Context Analysis
**Objective**: Understand how the feature fits into the existing system

**Actions**:
1. Review existing architecture documentation in `.windsurf/`
2. Identify affected bounded contexts
3. Map dependencies on existing services
4. Identify potential integration points
5. Analyze impact on current routing structure
6. Review state management implications

**Reference Documents**:
- `.windsurf/memories/angular-core-standards.md`
- `.windsurf/memories/project-context.md`
- `.windsurf/rules/service-patterns.md`
- `.windsurf/rules/testing-standards.md`

**Analysis Checklist**:
- [ ] Review existing components that may be affected
- [ ] Identify reusable services and patterns
- [ ] Check for similar features or patterns
- [ ] Analyze routing hierarchy impact
- [ ] Review theme and styling requirements
- [ ] Identify shared components to leverage

**Deliverable**: System Context Map
```markdown
# System Context: [Feature Name]

## Affected Components
- [Component 1]: [impact description]
- [Component 2]: [impact description]

## Service Dependencies
- [Service 1]: [usage description]
- [Service 2]: [usage description]

## Routing Impact
- New routes: [list]
- Modified routes: [list]
- Route guards needed: [list]

## Integration Points
- [Integration 1]: [description]
- [Integration 2]: [description]

## Potential Conflicts
- [Conflict 1]: [mitigation strategy]
```

#### 1.3 Domain Analysis
**Objective**: Define the domain model and bounded context

**Actions**:
1. Identify domain entities and value objects
2. Define aggregates and their boundaries
3. Map domain events and workflows
4. Identify ubiquitous language terms
5. Define bounded context boundaries
6. Create context mapping with existing contexts

**Domain Modeling Questions**:
- What are the core entities in this feature?
- What are the relationships between entities?
- What business rules govern these entities?
- What events occur in this domain?
- What are the invariants that must be maintained?

**Deliverable**: Domain Model Diagram
```markdown
# Domain Model: [Feature Name]

## Entities
### [Entity Name]
- **Properties**: [list properties with types]
- **Behaviors**: [list key behaviors]
- **Invariants**: [business rules]

## Value Objects
- [Value Object 1]: [description]
- [Value Object 2]: [description]

## Aggregates
- **Root**: [Entity Name]
- **Members**: [list of entities/value objects]
- **Boundaries**: [what's included/excluded]

## Domain Events
- [Event 1]: Triggered when [condition]
- [Event 2]: Triggered when [condition]

## Ubiquitous Language
- **[Term 1]**: [definition]
- **[Term 2]**: [definition]
```

---

### Phase 2: Architectural Design

#### 2.1 High-Level Architecture
**Objective**: Design the feature's architectural structure

**Layered Architecture Pattern**:
```
┌─────────────────────────────────────────┐
│     Presentation Layer (Components)     │
│  - Page Components (Smart/Container)    │
│  - Presentation Components (Dumb)       │
│  - Template Logic & UI Bindings         │
└─────────────────────────────────────────┘
              ↓ (delegates actions)
┌─────────────────────────────────────────┐
│    Abstraction Layer (Facades)          │
│  - Facade Services                      │
│  - Use Case Orchestration               │
│  - Component Interface                  │
└─────────────────────────────────────────┘
              ↓ (orchestrates)
┌─────────────────────────────────────────┐
│  Core Layer (Services, State, API)      │
│  - State Management Services            │
│  - API/Data Services                    │
│  - Business Logic                       │
│  - Utility Services                     │
└─────────────────────────────────────────┘
              ↓ (communicates)
┌─────────────────────────────────────────┐
│         Backend API / External          │
└─────────────────────────────────────────┘
```

**Design Considerations**:
- **Separation of Concerns**: Clear boundaries between layers
- **Unidirectional Data Flow**: Data flows down, events flow up
- **Reactive State Management**: Observable-based state
- **Dependency Inversion**: Depend on abstractions, not concretions

**Architecture Validation**:
- ✅ Follows standalone component architecture
- ✅ Uses OnPush change detection
- ✅ Implements proper dependency injection
- ✅ Maintains clear separation of concerns
- ✅ Supports lazy loading
- ✅ Enables comprehensive testing

**Deliverable**: High-Level Architecture Diagram

#### 2.2 Component Architecture
**Objective**: Design the component hierarchy and structure

**Component Types**:

**1. Page Components (Smart/Container)**
```typescript
// Located in: src/app/pages/[feature]/
@Component({
  selector: 'app-feature-page',
  standalone: true,
  imports: [CommonModule, /* child components */],
  templateUrl: './feature-page.component.html',
  styleUrl: './feature-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturePageComponent implements OnInit, OnDestroy {
  private facade = inject(FeatureFacadeService);
  private destroy$ = new Subject<void>();
  
  // State from facade
  data$ = this.facade.data$;
  loading$ = this.facade.loading$;
  error$ = this.facade.error$;
  
  ngOnInit(): void {
    this.facade.loadData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onAction(payload: ActionPayload): void {
    this.facade.performAction(payload);
  }
}
```

**2. Presentation Components (Dumb)**
```typescript
// Located in: src/app/components/[feature]/
@Component({
  selector: 'app-feature-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureCardComponent {
  @Input({ required: true }) data!: FeatureData;
  @Output() action = new EventEmitter<ActionPayload>();
  
  handleClick(): void {
    this.action.emit({ type: 'click', data: this.data });
  }
}
```

**Component Design Principles**:
- **Smart Components**: Handle routing, state, service orchestration
- **Dumb Components**: Pure UI, Input/Output driven, reusable
- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Build complex UIs from simple components
- **Testability**: Easy to test in isolation

**Deliverable**: Component Hierarchy Diagram
```markdown
# Component Hierarchy: [Feature Name]

## Page Components (src/app/pages/)
- **FeaturePageComponent**
  - Purpose: [description]
  - Route: `/feature`
  - Child Components: [list]
  - Services: [list]

## Presentation Components (src/app/components/)
- **FeatureCardComponent**
  - Purpose: [description]
  - Inputs: [list with types]
  - Outputs: [list with types]
  - Reusable: Yes/No

## Shared Components (src/app/shared/)
- [List any new shared components]

## Component Relationships
[Diagram showing parent-child relationships]
```

#### 2.3 Service Architecture
**Objective**: Design service layer and state management

**Service Types**:

**1. State Management Service**
```typescript
// Located in: src/app/core/services/
@Injectable({ providedIn: 'root' })
export class FeatureStateService {
  // Private state
  private dataSubject = new BehaviorSubject<FeatureData[]>([]);
  private selectedItemSubject = new BehaviorSubject<FeatureData | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  // Public observables with shareReplay
  data$ = this.dataSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  
  selectedItem$ = this.selectedItemSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  
  // Computed observables
  hasData$ = this.data$.pipe(
    map(data => data.length > 0)
  );
  
  // State getters
  get currentData(): FeatureData[] {
    return this.dataSubject.value;
  }
  
  // State setters
  setData(data: FeatureData[]): void {
    this.dataSubject.next(data);
  }
  
  setSelectedItem(item: FeatureData | null): void {
    this.selectedItemSubject.next(item);
  }
  
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
  
  setError(error: string | null): void {
    this.errorSubject.next(error);
  }
  
  // State reset
  reset(): void {
    this.dataSubject.next([]);
    this.selectedItemSubject.next(null);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
  }
}
```

**2. API/Data Service**
```typescript
@Injectable({ providedIn: 'root' })
export class FeatureApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  
  getData(): Observable<FeatureData[]> {
    return this.http.get<FeatureData[]>(`${this.baseUrl}/features`).pipe(
      catchError(this.handleError)
    );
  }
  
  getById(id: string): Observable<FeatureData> {
    return this.http.get<FeatureData>(`${this.baseUrl}/features/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  create(data: CreateFeatureDto): Observable<FeatureData> {
    return this.http.post<FeatureData>(`${this.baseUrl}/features`, data).pipe(
      catchError(this.handleError)
    );
  }
  
  update(id: string, data: UpdateFeatureDto): Observable<FeatureData> {
    return this.http.put<FeatureData>(`${this.baseUrl}/features/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/features/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('API request failed'));
  }
}
```

**3. Facade Service**
```typescript
@Injectable({ providedIn: 'root' })
export class FeatureFacadeService {
  private apiService = inject(FeatureApiService);
  private stateService = inject(FeatureStateService);
  
  // Expose state
  data$ = this.stateService.data$;
  selectedItem$ = this.stateService.selectedItem$;
  loading$ = this.stateService.loading$;
  error$ = this.stateService.error$;
  
  // Use cases
  loadData(): void {
    this.stateService.setLoading(true);
    
    this.apiService.getData().subscribe({
      next: (data) => {
        this.stateService.setData(data);
        this.stateService.setLoading(false);
      },
      error: (error) => {
        this.stateService.setError('Failed to load data');
        this.stateService.setLoading(false);
      }
    });
  }
  
  selectItem(item: FeatureData): void {
    this.stateService.setSelectedItem(item);
  }
  
  createItem(data: CreateFeatureDto): Observable<FeatureData> {
    this.stateService.setLoading(true);
    
    return this.apiService.create(data).pipe(
      tap((newItem) => {
        const currentData = this.stateService.currentData;
        this.stateService.setData([...currentData, newItem]);
        this.stateService.setLoading(false);
      }),
      catchError((error) => {
        this.stateService.setError('Failed to create item');
        this.stateService.setLoading(false);
        return throwError(() => error);
      })
    );
  }
}
```

**Deliverable**: Service Architecture Diagram
```markdown
# Service Architecture: [Feature Name]

## State Management Services
- **FeatureStateService**
  - Purpose: Manage feature state
  - State: [list state properties]
  - Observables: [list public observables]

## API Services
- **FeatureApiService**
  - Purpose: HTTP communication
  - Endpoints: [list endpoints]
  - Error Handling: [strategy]

## Facade Services
- **FeatureFacadeService**
  - Purpose: Orchestrate use cases
  - Use Cases: [list use cases]
  - Dependencies: [list services]

## Utility Services
- [List any utility services needed]

## Service Dependencies
[Diagram showing service relationships]
```

#### 2.4 Data Model Design
**Objective**: Define interfaces, types, and data structures

**Model Organization**:
```
src/app/core/models/
├── interfaces/
│   └── feature.interface.ts
├── enums/
│   └── feature.enums.ts
├── constants/
│   └── feature.constants.ts
└── mocks/
    └── mock-feature.ts
```

**Interface Design**:
```typescript
// src/app/core/models/interfaces/feature.interface.ts

// Domain Model
export interface Feature {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata?: FeatureMetadata;
}

// DTOs (Data Transfer Objects)
export interface CreateFeatureDto {
  name: string;
  description: string;
}

export interface UpdateFeatureDto {
  name?: string;
  description?: string;
  status?: FeatureStatus;
}

export interface FeatureResponseDto {
  data: Feature[];
  total: number;
  page: number;
  pageSize: number;
}

// View Models
export interface FeatureViewModel extends Feature {
  displayName: string;
  statusLabel: string;
  isActive: boolean;
}

// Supporting Interfaces
export interface FeatureMetadata {
  tags: string[];
  category: string;
  priority: number;
}

export interface FeatureFilter {
  status?: FeatureStatus;
  search?: string;
  category?: string;
}
```

**Enum Design**:
```typescript
// src/app/core/models/enums/feature.enums.ts

export enum FeatureStatus {
  Draft = 'draft',
  Active = 'active',
  Inactive = 'inactive',
  Archived = 'archived'
}

export enum FeatureCategory {
  Core = 'core',
  Premium = 'premium',
  Experimental = 'experimental'
}
```

**Constants Design**:
```typescript
// src/app/core/models/constants/feature.constants.ts

export const FEATURE_CONFIG = {
  maxNameLength: 100,
  maxDescriptionLength: 500,
  defaultPageSize: 20,
  cacheTimeout: 5 * 60 * 1000 // 5 minutes
} as const;

export const FEATURE_STATUS_LABELS: Record<FeatureStatus, string> = {
  [FeatureStatus.Draft]: 'Draft',
  [FeatureStatus.Active]: 'Active',
  [FeatureStatus.Inactive]: 'Inactive',
  [FeatureStatus.Archived]: 'Archived']
};
```

**Mock Data**:
```typescript
// src/app/core/models/mocks/mock-feature.ts

export const MOCK_FEATURES: Feature[] = [
  {
    id: '1',
    name: 'Feature 1',
    description: 'Description 1',
    status: FeatureStatus.Active,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  // ... more mock data
];
```

**Barrel Export**:
```typescript
// src/app/core/models/index.ts
export * from './interfaces/feature.interface';
export * from './enums/feature.enums';
export * from './constants/feature.constants';
export * from './mocks/mock-feature';
```

**Deliverable**: Data Model Documentation

#### 2.5 Routing & Navigation
**Objective**: Design routing structure and navigation flows

**Routing Pattern**:
```typescript
// src/app/app.routes.ts

export const routes: Routes = [
  // ... existing routes
  {
    path: 'feature',
    loadComponent: () => import('./pages/feature/feature.component')
      .then(m => m.FeatureComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/feature/feature-list/feature-list.component')
          .then(m => m.FeatureListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/feature/feature-detail/feature-detail.component')
          .then(m => m.FeatureDetailComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/feature/feature-create/feature-create.component')
          .then(m => m.FeatureCreateComponent),
        canActivate: [AuthGuard]
      }
    ]
  }
];
```

**Route Guards** (if needed):
```typescript
// src/app/core/guards/auth.guard.ts

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
```

**Navigation Flows**:
```markdown
# Navigation Flows

## Primary Flow
1. User lands on `/feature` (list view)
2. User clicks item → Navigate to `/feature/:id` (detail view)
3. User clicks edit → Navigate to `/feature/:id/edit`
4. User saves → Navigate back to `/feature/:id`

## Create Flow
1. User clicks "Create" → Navigate to `/feature/create`
2. User fills form and submits
3. On success → Navigate to `/feature/:newId`
4. On error → Stay on create page with error message

## Delete Flow
1. User clicks delete on `/feature/:id`
2. Confirm dialog appears
3. On confirm → Delete and navigate to `/feature`
4. On cancel → Stay on current page
```

**Deliverable**: Routing Diagram & Navigation Flows

---

### Phase 3: Technical Specification

#### 3.1 API Integration Design
**Objective**: Define API contracts and integration patterns

**API Specification**:
```markdown
# API Integration: [Feature Name]

## Base URL
`${environment.apiUrl}/api/v1`

## Endpoints

### GET /features
**Purpose**: Retrieve list of features
**Query Parameters**:
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 20)
- `status` (string): Filter by status
- `search` (string): Search term

**Response**: 200 OK
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### GET /features/:id
**Purpose**: Retrieve single feature
**Path Parameters**:
- `id` (string): Feature ID

**Response**: 200 OK
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### POST /features
**Purpose**: Create new feature
**Request Body**:
```json
{
  "name": "string",
  "description": "string"
}
```

**Response**: 201 Created
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "draft",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### PUT /features/:id
**Purpose**: Update existing feature
**Path Parameters**:
- `id` (string): Feature ID

**Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "status": "active"
}
```

**Response**: 200 OK
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### DELETE /features/:id
**Purpose**: Delete feature
**Path Parameters**:
- `id` (string): Feature ID

**Response**: 204 No Content

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Name is required",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required",
  "statusCode": 401
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Feature not found",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred",
  "statusCode": 500
}
```

## Authentication
- **Type**: Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Token Source**: AuthService

## Caching Strategy
- **List endpoint**: Cache for 5 minutes
- **Detail endpoint**: Cache for 10 minutes
- **Invalidation**: On create, update, delete operations

## Error Handling
- Network errors: Retry 3 times with exponential backoff
- 401 errors: Redirect to login
- 403 errors: Show permission denied message
- 404 errors: Show not found message
- 500 errors: Show generic error message
```

**Deliverable**: API Integration Specification

#### 3.2 State Management Design
**Objective**: Define state structure and management strategy

**State Structure**:
```typescript
interface FeatureState {
  // Data
  items: Feature[];
  selectedItem: Feature | null;
  
  // UI State
  filters: FeatureFilter;
  pagination: PaginationState;
  sorting: SortingState;
  
  // Loading States
  loading: boolean;
  loadingItem: boolean;
  saving: boolean;
  deleting: boolean;
  
  // Error States
  error: string | null;
  itemError: string | null;
  
  // Metadata
  lastUpdated: Date | null;
  totalCount: number;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
}

interface SortingState {
  field: string;
  direction: 'asc' | 'desc';
}
```

**State Update Patterns**:
```typescript
// Optimistic Update
updateItemOptimistic(id: string, updates: UpdateFeatureDto): void {
  // 1. Update UI immediately
  const currentItems = this.stateService.currentData;
  const updatedItems = currentItems.map(item =>
    item.id === id ? { ...item, ...updates } : item
  );
  this.stateService.setData(updatedItems);
  
  // 2. Send API request
  this.apiService.update(id, updates).subscribe({
    next: (updated) => {
      // 3. Update with server response
      const items = this.stateService.currentData;
      const finalItems = items.map(item =>
        item.id === id ? updated : item
      );
      this.stateService.setData(finalItems);
    },
    error: (error) => {
      // 4. Rollback on error
      this.stateService.setData(currentItems);
      this.stateService.setError('Update failed');
    }
  });
}

// Pessimistic Update
updateItemPessimistic(id: string, updates: UpdateFeatureDto): void {
  this.stateService.setLoading(true);
  
  this.apiService.update(id, updates).subscribe({
    next: (updated) => {
      const currentItems = this.stateService.currentData;
      const updatedItems = currentItems.map(item =>
        item.id === id ? updated : item
      );
      this.stateService.setData(updatedItems);
      this.stateService.setLoading(false);
    },
    error: (error) => {
      this.stateService.setError('Update failed');
      this.stateService.setLoading(false);
    }
  });
}
```

**State Synchronization**:
```typescript
// Multi-component coordination
class FeatureFacadeService {
  // Shared state across components
  items$ = this.stateService.data$;
  selectedItem$ = this.stateService.selectedItem$;
  
  // Component A selects item
  selectItem(item: Feature): void {
    this.stateService.setSelectedItem(item);
    // Component B automatically receives update via selectedItem$
  }
  
  // Component B updates item
  updateItem(id: string, updates: UpdateFeatureDto): void {
    // Update affects both Component A and Component B
    this.updateItemOptimistic(id, updates);
  }
}
```

**State Persistence** (if needed):
```typescript
class FeatureStateService {
  private readonly STORAGE_KEY = 'feature_state';
  
  constructor() {
    this.loadFromStorage();
    this.setupAutoSave();
  }
  
  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored);
      this.dataSubject.next(state.items);
      this.filtersSubject.next(state.filters);
    }
  }
  
  private setupAutoSave(): void {
    combineLatest([this.data$, this.filters$])
      .pipe(debounceTime(1000))
      .subscribe(([items, filters]) => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
          items,
          filters
        }));
      });
  }
}
```

**Deliverable**: State Management Specification

#### 3.3 UI/UX Design Guidelines
**Objective**: Define user interface and experience patterns

**Design System Integration**:
```scss
// Use theme variables from src/app/styles/theme.scss
@import 'src/app/styles/theme.scss';

.feature-card {
  background: $white;
  border: 1px solid rgba($gray, 0.2);
  border-radius: 8px;
  
  &:hover {
    border-color: $rzume-blue;
  }
  
  &.active {
    border-color: $basic-green;
  }
}
```

**Button Styles**:
```html
<!-- Use reusable button classes from general_styles.scss -->
<button class="rzume-button-primary">Primary Action</button>
<button class="rzume-button-secondary">Secondary Action</button>
<button class="rzume-button-outline">Outlined Button</button>
<button class="rzume-button-outline-text">Text Button</button>
```

**Responsive Design**:
```scss
// Mobile-first approach
.feature-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  // Tablet
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  // Desktop
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
```

**Accessibility Requirements**:
- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Sufficient color contrast (4.5:1 minimum)
- ✅ Focus indicators
- ✅ ARIA labels and roles

**Loading States**:
```html
<!-- Loading skeleton -->
@if (loading$ | async) {
  <div class="skeleton-loader">
    <div class="skeleton-card"></div>
    <div class="skeleton-card"></div>
  </div>
} @else {
  <div class="feature-grid">
    @for (item of items$ | async; track item.id) {
      <app-feature-card [data]="item" />
    }
  </div>
}
```

**Error States**:
```html
<!-- Error message -->
@if (error$ | async; as error) {
  <div class="error-message" role="alert">
    <mat-icon>error</mat-icon>
    <p>{{ error }}</p>
    <button class="rzume-button-primary" (click)="retry()">
      Retry
    </button>
  </div>
}
```

**Empty States**:
```html
<!-- Empty state -->
@if ((items$ | async)?.length === 0) {
  <div class="empty-state">
    <mat-icon>inbox</mat-icon>
    <h3>No items found</h3>
    <p>Get started by creating your first item</p>
    <button class="rzume-button-primary" (click)="create()">
      Create Item
    </button>
  </div>
}
```

**Deliverable**: UI/UX Design Guidelines

#### 3.4 Security & Performance
**Objective**: Define security measures and performance requirements

**Security Measures**:

**1. Authentication & Authorization**
```typescript
// Route protection
{
  path: 'feature/create',
  loadComponent: () => import('./feature-create.component'),
  canActivate: [AuthGuard, RoleGuard],
  data: { roles: ['admin', 'editor'] }
}

// Component-level checks
@Component({...})
export class FeatureComponent {
  private authService = inject(AuthService);
  
  canEdit$ = this.authService.hasPermission('feature.edit');
  canDelete$ = this.authService.hasPermission('feature.delete');
}
```

**2. Input Validation**
```typescript
// Form validation
createForm = new FormGroup({
  name: new FormControl('', [
    Validators.required,
    Validators.maxLength(100),
    Validators.pattern(/^[a-zA-Z0-9\s-]+$/)
  ]),
  description: new FormControl('', [
    Validators.required,
    Validators.maxLength(500)
  ])
});

// Sanitization
import { DomSanitizer } from '@angular/platform-browser';

sanitizeInput(input: string): string {
  return this.sanitizer.sanitize(SecurityContext.HTML, input) || '';
}
```

**3. XSS Protection**
```html
<!-- Safe property binding -->
<div [innerHTML]="trustedHtml"></div>

<!-- Avoid dangerous bindings -->
<!-- NEVER: <div [innerHTML]="userInput"></div> -->
```

**4. CSRF Protection**
```typescript
// HTTP interceptor for CSRF token
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const csrfToken = getCsrfToken();
  
  if (csrfToken && req.method !== 'GET') {
    const clonedRequest = req.clone({
      setHeaders: {
        'X-CSRF-Token': csrfToken
      }
    });
    return next(clonedRequest);
  }
  
  return next(req);
};
```

**Performance Requirements**:

**1. Bundle Size**
- Initial bundle: < 500kB (warning), < 1MB (error)
- Component styles: < 8kB (warning), < 12kB (error)
- Lazy load all feature routes

**2. Load Times**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**3. Runtime Performance**
```typescript
// OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// TrackBy for loops
@Component({
  template: `
    @for (item of items; track item.id) {
      <app-item [data]="item" />
    }
  `
})

// Subscription management
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.handleData(data));
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

**4. Network Optimization**
```typescript
// Request caching
private cache = new Map<string, Observable<Data>>();

getData(id: string): Observable<Data> {
  if (!this.cache.has(id)) {
    this.cache.set(id, this.http.get<Data>(`/api/data/${id}`).pipe(
      shareReplay({ bufferSize: 1, refCount: true })
    ));
  }
  return this.cache.get(id)!;
}

// Request debouncing
searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.search(term))
).subscribe(results => this.handleResults(results));
```

**5. Memory Management**
```typescript
// Proper cleanup
ngOnDestroy(): void {
  // Unsubscribe from observables
  this.destroy$.next();
  this.destroy$.complete();
  
  // Clear caches
  this.cache.clear();
  
  // Remove event listeners
  this.removeEventListeners();
}
```

**Deliverable**: Security & Performance Specification

---

### Phase 4: Implementation Planning

#### 4.1 Task Breakdown
**Objective**: Create detailed implementation tasks

**Epic Structure**:
```markdown
# Epic: [Feature Name]

## Story 1: Data Models & Interfaces
**Description**: Create all data models, interfaces, enums, and constants

**Tasks**:
- [ ] Create feature.interface.ts with domain models and DTOs
- [ ] Create feature.enums.ts with status and category enums
- [ ] Create feature.constants.ts with configuration constants
- [ ] Create mock-feature.ts with test data
- [ ] Update models/index.ts barrel export
- [ ] Write unit tests for type guards (if any)

**Acceptance Criteria**:
- All interfaces properly typed
- Enums cover all possible values
- Constants are immutable (as const)
- Mock data matches interface structure

## Story 2: Core Services
**Description**: Implement state management, API, and facade services

**Tasks**:
- [ ] Create feature-state.service.ts
- [ ] Create feature-api.service.ts
- [ ] Create feature-facade.service.ts
- [ ] Implement error handling
- [ ] Add caching strategy
- [ ] Write comprehensive unit tests (80%+ coverage)
- [ ] Update services/index.ts barrel export

**Acceptance Criteria**:
- State service manages all feature state
- API service handles all HTTP operations
- Facade service orchestrates use cases
- All services have proper error handling
- Tests cover success and error scenarios

## Story 3: Presentation Components
**Description**: Create reusable presentation components

**Tasks**:
- [ ] Create feature-card.component.ts
- [ ] Create feature-list-item.component.ts
- [ ] Create feature-form.component.ts
- [ ] Implement OnPush change detection
- [ ] Add proper Input/Output decorators
- [ ] Style components with SCSS
- [ ] Write component unit tests

**Acceptance Criteria**:
- Components are pure and reusable
- All inputs are properly typed
- All outputs emit correct payloads
- Components follow design system
- Accessibility requirements met

## Story 4: Page Components
**Description**: Create page-level container components

**Tasks**:
- [ ] Create feature-list-page.component.ts
- [ ] Create feature-detail-page.component.ts
- [ ] Create feature-create-page.component.ts
- [ ] Implement routing and navigation
- [ ] Connect to facade service
- [ ] Add loading and error states
- [ ] Write integration tests

**Acceptance Criteria**:
- Pages handle routing correctly
- State management works properly
- Loading states display correctly
- Error states display correctly
- Navigation flows work as designed

## Story 5: Routing & Guards
**Description**: Implement routing configuration and guards

**Tasks**:
- [ ] Add routes to app.routes.ts
- [ ] Implement route guards (if needed)
- [ ] Configure lazy loading
- [ ] Add route parameters
- [ ] Test navigation flows
- [ ] Write guard unit tests

**Acceptance Criteria**:
- All routes lazy load correctly
- Guards protect routes properly
- Route parameters work correctly
- Navigation flows are smooth

## Story 6: Testing & Documentation
**Description**: Comprehensive testing and documentation

**Tasks**:
- [ ] Write unit tests for all components
- [ ] Write unit tests for all services
- [ ] Write integration tests
- [ ] Achieve 80%+ code coverage
- [ ] Create feature documentation
- [ ] Update README if needed
- [ ] Create usage examples

**Acceptance Criteria**:
- All tests pass
- Code coverage > 80%
- Documentation is complete
- Examples are clear and working
```

**Deliverable**: Implementation Task List

#### 4.2 Implementation Order
**Objective**: Define optimal development sequence

**Phase 1: Foundation (Days 1-2)**
```markdown
1. **Data Models** (4 hours)
   - Create all interfaces
   - Create enums and constants
   - Create mock data
   - Update barrel exports

2. **Core Services** (8 hours)
   - State service implementation
   - API service implementation
   - Facade service implementation
   - Service unit tests
```

**Phase 2: Core Functionality (Days 3-5)**
```markdown
3. **Presentation Components** (8 hours)
   - Feature card component
   - Feature list item component
   - Feature form component
   - Component unit tests

4. **Page Components** (12 hours)
   - List page component
   - Detail page component
   - Create page component
   - Page integration tests
```

**Phase 3: Integration (Days 6-7)**
```markdown
5. **Routing & Navigation** (4 hours)
   - Route configuration
   - Route guards
   - Navigation flows
   - Guard tests

6. **API Integration** (8 hours)
   - Connect to backend API
   - Error handling
   - Loading states
   - Integration tests
```

**Phase 4: Polish (Days 8-9)**
```markdown
7. **UI Refinement** (6 hours)
   - Responsive design
   - Accessibility improvements
   - Animation and transitions
   - Visual polish

8. **Performance Optimization** (4 hours)
   - Bundle size optimization
   - Lazy loading verification
   - Memory leak prevention
   - Performance testing
```

**Phase 5: Quality Assurance (Day 10)**
```markdown
9. **Testing & Documentation** (8 hours)
   - Comprehensive test coverage
   - Documentation updates
   - Code review
   - Final QA
```

**Deliverable**: Implementation Roadmap

#### 4.3 Risk Assessment
**Objective**: Identify and mitigate potential risks

**Risk Matrix**:

**Technical Risks**:
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API integration complexity | Medium | High | Create API mock service for development |
| State management complexity | Low | Medium | Use proven BehaviorSubject pattern |
| Performance issues | Low | High | Implement OnPush, lazy loading, caching |
| Browser compatibility | Low | Low | Use Angular's built-in polyfills |

**Timeline Risks**:
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Underestimated complexity | Medium | Medium | Add 20% buffer to estimates |
| Dependency delays | Low | High | Identify critical path, parallel work |
| Testing takes longer | Medium | Low | Write tests alongside implementation |
| Code review delays | Low | Medium | Schedule review time in advance |

**Resource Risks**:
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Team member unavailable | Low | Medium | Cross-train team members |
| Skill gaps | Medium | Low | Provide training, pair programming |
| Competing priorities | Medium | High | Secure stakeholder commitment |

**Business Risks**:
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Requirement changes | High | High | Agile approach, regular reviews |
| Stakeholder misalignment | Low | High | Regular demos, clear communication |
| Scope creep | Medium | Medium | Strict change management process |

**Mitigation Strategies**:

**1. Technical Mitigation**
- Create proof of concept for complex features
- Use established patterns from project
- Regular code reviews
- Automated testing

**2. Timeline Mitigation**
- Break work into small, deliverable chunks
- Daily standups to identify blockers
- Parallel work streams where possible
- Buffer time for unknowns

**3. Resource Mitigation**
- Knowledge sharing sessions
- Pair programming for complex tasks
- Documentation as you go
- Backup resources identified

**4. Business Mitigation**
- Weekly stakeholder demos
- Clear acceptance criteria
- Change request process
- Regular priority alignment

**Deliverable**: Risk Assessment & Mitigation Plan

---

### Phase 5: Documentation & Communication

#### 5.1 Architecture Decision Records (ADRs)
**Objective**: Document important architectural decisions

**ADR Template**:
```markdown
# ADR-001: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
What is the issue we're facing? What factors are influencing this decision?

## Decision
What is the change we're proposing or have agreed to implement?

## Consequences
What becomes easier or more difficult because of this change?

### Positive Consequences
- [Benefit 1]
- [Benefit 2]

### Negative Consequences
- [Drawback 1]
- [Drawback 2]

## Alternatives Considered
What other options did we consider?

### Alternative 1: [Name]
- **Pros**: [list]
- **Cons**: [list]
- **Why not chosen**: [reason]

### Alternative 2: [Name]
- **Pros**: [list]
- **Cons**: [list]
- **Why not chosen**: [reason]

## References
- [Link to related documentation]
- [Link to discussion]
```

**Example ADR**:
```markdown
# ADR-001: Use BehaviorSubject for State Management

## Status
Accepted

## Context
We need a state management solution for the feature module. The application currently uses service-based state management with BehaviorSubject pattern. We need to decide whether to continue this pattern or adopt a different approach (e.g., NgRx, Akita).

## Decision
We will use BehaviorSubject pattern for state management in this feature.

## Consequences

### Positive Consequences
- Consistent with existing codebase
- Simpler learning curve for team
- Less boilerplate code
- Easier to test
- No additional dependencies

### Negative Consequences
- Less structured than NgRx
- No time-travel debugging
- Manual implementation of patterns
- Potential for inconsistent implementations

## Alternatives Considered

### Alternative 1: NgRx
- **Pros**: 
  - Structured state management
  - Time-travel debugging
  - DevTools support
  - Well-documented patterns
- **Cons**: 
  - Significant boilerplate
  - Steeper learning curve
  - Additional bundle size
  - Overkill for current needs
- **Why not chosen**: Too complex for current requirements, team not familiar with NgRx

### Alternative 2: Akita
- **Pros**: 
  - Less boilerplate than NgRx
  - Good DevTools
  - Active community
- **Cons**: 
  - Additional dependency
  - Team not familiar
  - Inconsistent with existing code
- **Why not chosen**: Would create inconsistency in codebase

## References
- Project Context: .windsurf/memories/project-context.md
- Service Patterns: .windsurf/rules/service-patterns.md
```

**Deliverable**: Architecture Decision Records

#### 5.2 Implementation Guide
**Objective**: Create comprehensive implementation documentation

**Implementation Guide Structure**:
```markdown
# [Feature Name] Implementation Guide

## Overview
Brief description of the feature and its purpose.

## Prerequisites
- Angular 20.3.0+
- Node.js 18+
- Required dependencies installed

## Project Structure
```
src/app/
├── pages/feature/
│   ├── feature-list/
│   ├── feature-detail/
│   └── feature-create/
├── components/feature/
│   ├── feature-card/
│   ├── feature-form/
│   └── feature-list-item/
├── core/
│   ├── services/
│   │   ├── feature-state.service.ts
│   │   ├── feature-api.service.ts
│   │   └── feature-facade.service.ts
│   └── models/
│       ├── interfaces/feature.interface.ts
│       ├── enums/feature.enums.ts
│       └── constants/feature.constants.ts
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1'
};
```

### 3. Run Development Server
```bash
npm start
```

## Implementation Steps

### Step 1: Create Data Models
[Detailed instructions with code examples]

### Step 2: Implement Services
[Detailed instructions with code examples]

### Step 3: Create Components
[Detailed instructions with code examples]

### Step 4: Configure Routing
[Detailed instructions with code examples]

### Step 5: Add Tests
[Detailed instructions with code examples]

## Code Examples

### Creating a New Feature Item
```typescript
// In component
onCreateFeature(data: CreateFeatureDto): void {
  this.facade.createItem(data).subscribe({
    next: (created) => {
      this.router.navigate(['/feature', created.id]);
    },
    error: (error) => {
      this.showError('Failed to create feature');
    }
  });
}
```

### Displaying Feature List
```html
<div class="feature-grid">
  @if (loading$ | async) {
    <app-loading-skeleton />
  } @else if (error$ | async; as error) {
    <app-error-message [message]="error" />
  } @else {
    @for (item of items$ | async; track item.id) {
      <app-feature-card 
        [data]="item"
        (action)="handleAction($event)"
      />
    }
  }
</div>
```

## Best Practices

### Component Development
- Always use OnPush change detection
- Implement proper subscription cleanup
- Use modern control flow syntax
- Follow single responsibility principle

### Service Development
- Use inject() for dependency injection
- Implement proper error handling
- Use shareReplay for shared observables
- Write comprehensive unit tests

### Styling
- Use theme variables from theme.scss
- Follow mobile-first approach
- Use reusable button classes
- Maintain accessibility standards

## Troubleshooting

### Common Issues

**Issue**: Component not updating
**Solution**: Ensure OnPush change detection is triggered properly

**Issue**: Memory leaks
**Solution**: Implement proper subscription cleanup with takeUntil

**Issue**: Route not loading
**Solution**: Verify lazy loading configuration in app.routes.ts

## Testing

### Running Tests
```bash
# Unit tests
npm test

# With coverage
npm test -- --code-coverage

# Specific file
npm test -- --include='**/feature.service.spec.ts'
```

### Test Examples
[Include test examples]

## Maintenance

### Adding New Features
[Guidelines for extending the feature]

### Updating Dependencies
[Guidelines for dependency updates]

### Performance Monitoring
[Guidelines for monitoring performance]

## References
- Angular Documentation: https://angular.dev
- Project Standards: .windsurf/memories/angular-core-standards.md
- Service Patterns: .windsurf/rules/service-patterns.md
```

**Deliverable**: Implementation Guide

#### 5.3 Stakeholder Communication
**Objective**: Ensure clear communication with all stakeholders

**Communication Plan**:

**Development Team**:
- **Frequency**: Daily standups, weekly planning
- **Content**: Technical progress, blockers, code reviews
- **Format**: In-person/video, Slack, GitHub PRs
- **Deliverables**: Code, tests, technical documentation

**Product Team**:
- **Frequency**: Weekly demos, bi-weekly planning
- **Content**: Feature progress, user stories, acceptance criteria
- **Format**: Demo sessions, Jira updates
- **Deliverables**: Working features, user documentation

**Management**:
- **Frequency**: Weekly status reports
- **Content**: Milestone progress, risks, timeline
- **Format**: Email reports, monthly presentations
- **Deliverables**: Status reports, risk assessments

**QA Team**:
- **Frequency**: Continuous integration, sprint reviews
- **Content**: Test requirements, bug reports, quality metrics
- **Format**: Test plans, bug tracking system
- **Deliverables**: Test cases, quality reports

**Communication Templates**:

**Weekly Status Report**:
```markdown
# Weekly Status Report: [Feature Name]
**Week of**: [Date]

## Progress This Week
- ✅ Completed: [list completed tasks]
- 🚧 In Progress: [list in-progress tasks]
- 📅 Planned Next Week: [list upcoming tasks]

## Metrics
- Code Coverage: [percentage]
- Tests Passing: [number/total]
- Bundle Size: [size]
- Performance: [metrics]

## Risks & Issues
- 🔴 High Priority: [list]
- 🟡 Medium Priority: [list]
- 🟢 Low Priority: [list]

## Blockers
- [List any blockers]

## Next Steps
- [List next steps]
```

**Demo Agenda**:
```markdown
# Feature Demo: [Feature Name]
**Date**: [Date]
**Attendees**: [List]

## Agenda
1. Feature Overview (5 min)
2. Live Demo (15 min)
   - User Story 1
   - User Story 2
   - User Story 3
3. Technical Highlights (5 min)
4. Q&A (10 min)
5. Next Steps (5 min)

## Demo Script
[Detailed demo script with screenshots]

## Feedback Collection
[Template for collecting feedback]
```

**Deliverable**: Communication Plan

---

## Deliverables Summary

### Documentation Deliverables
1. ✅ **Feature Requirements Document**
2. ✅ **System Context Map**
3. ✅ **Domain Model Diagram**
4. ✅ **High-Level Architecture Diagram**
5. ✅ **Component Hierarchy Diagram**
6. ✅ **Service Architecture Diagram**
7. ✅ **Data Model Documentation**
8. ✅ **Routing Diagram & Navigation Flows**
9. ✅ **API Integration Specification**
10. ✅ **State Management Specification**
11. ✅ **UI/UX Design Guidelines**
12. ✅ **Security & Performance Specification**
13. ✅ **Implementation Task List**
14. ✅ **Implementation Roadmap**
15. ✅ **Risk Assessment & Mitigation Plan**
16. ✅ **Architecture Decision Records (ADRs)**
17. ✅ **Implementation Guide**
18. ✅ **Communication Plan**

### Technical Deliverables
1. ✅ **Model Interfaces** (TypeScript interfaces and types)
2. ✅ **Service Skeletons** (Service class templates)
3. ✅ **Component Templates** (Component class templates)
4. ✅ **Routing Configuration** (Route definitions)
5. ✅ **Test Templates** (Unit and integration test templates)

---

## Usage Examples

### Example 1: Planning a New Feature
```
@web-architect

I need to plan a user profile management feature with:
- View and edit user profiles
- Upload profile pictures
- Update user preferences
- Change password functionality
- Email notification settings

Please provide a complete architectural plan following all phases.
```

### Example 2: Architectural Review
```
@web-architect

Review the current dashboard architecture in src/app/pages/dashboard/ and suggest improvements for:
- Performance optimization (current load time is 3s)
- Code organization (components are getting large)
- Maintainability (difficult to add new widgets)
- Scalability (need to support 10+ widget types)

Provide detailed recommendations with implementation plan.
```

### Example 3: Integration Planning
```
@web-architect

Plan the integration of Stripe payment gateway with:
- PCI compliance requirements
- Support for one-time and recurring payments
- Webhook handling for payment events
- Error handling and retry strategies
- User experience considerations (loading states, errors)
- Security measures (token handling, data encryption)

Include API specification, state management, and security considerations.
```

### Example 4: Refactoring Planning
```
@web-architect

Plan a refactoring of the authentication module:
- Current: Mixed NgModule and standalone components
- Target: Pure standalone architecture
- Requirements: Zero downtime, backward compatibility
- Scope: Login, register, password reset, 2FA

Provide migration strategy with risk assessment.
```

---

## Best Practices

### When to Use Web Architect
✅ **Use for**:
- Complex features requiring architectural planning
- New bounded contexts or domains
- Major refactoring or restructuring
- Integration with external systems
- Performance or security critical features
- Cross-team coordination requirements
- Features with unclear requirements
- Long-term strategic initiatives

❌ **Don't use for**:
- Simple bug fixes
- Minor UI tweaks
- Adding a single component
- Quick prototypes
- Urgent hotfixes

### Expected Outcomes
✅ **You will receive**:
- Clear architectural vision and direction
- Comprehensive documentation for implementation
- Identified risks and mitigation strategies
- Defined quality standards and requirements
- Implementation roadmap with clear milestones
- Stakeholder alignment and communication plan
- Technical specifications and code templates
- Testing strategy and requirements

### Quality Standards
All architectural plans must meet:
- ✅ Alignment with project standards
- ✅ Standalone component architecture
- ✅ OnPush change detection strategy
- ✅ Modern Angular patterns (inject(), control flow)
- ✅ TypeScript strict mode compliance
- ✅ Comprehensive testing strategy (80%+ coverage)
- ✅ Security best practices
- ✅ Performance requirements
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Documentation completeness

---

## Integration with Development Workflow

### Step 1: Architecture Phase
Use `@web-architect` to create comprehensive architectural plan

### Step 2: Review & Approval
Review architectural plan with team and stakeholders

### Step 3: Implementation
Use `/add-feature` workflow to implement the architecture

### Step 4: Code Review
Use `@code-reviewer` to review implementation

### Step 5: Testing
Follow testing standards from `.windsurf/rules/testing-standards.md`

### Step 6: Deployment
Follow deployment workflow

---

## Continuous Improvement

### Feedback Loop
- Collect feedback after each feature implementation
- Update architectural patterns based on lessons learned
- Refine estimation accuracy
- Improve documentation templates

### Knowledge Sharing
- Document architectural decisions in ADRs
- Share learnings in team meetings
- Update project standards as needed
- Maintain architecture documentation

### Metrics Tracking
- Implementation time vs estimates
- Code quality metrics
- Performance benchmarks
- Test coverage trends
- Bug rates by feature

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-01  
**Maintained By**: Development Team
