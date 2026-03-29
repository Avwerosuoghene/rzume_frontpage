---
description: Code quality standards and best practices
trigger: model_decision
---

# Code Quality Standards

## General Principles

### SOLID Principles
- **Single Responsibility**: Each class/component should have one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes must be substitutable for base classes
- **Interface Segregation**: Many specific interfaces are better than one general interface
- **Dependency Inversion**: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)
- Extract repeated code into reusable functions/components
- Use barrel exports for cleaner imports
- Create shared utilities for common operations
- Leverage Angular's dependency injection for shared services

### KISS (Keep It Simple, Stupid)
- Prefer simple, readable solutions over clever ones
- Avoid over-engineering
- Write self-documenting code
- Use clear, descriptive names

## Code Organization

### File Structure
- Maximum 300 lines per file (consider splitting if larger)
- Group related functionality together
- Use barrel exports (`index.ts`) for clean imports
- Keep test files alongside implementation files

### Import Organization
```typescript
// 1. Angular core imports
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Third-party library imports
import { MatButtonModule } from '@angular/material/button';

// 3. Application imports - grouped by type
import { FeatureService } from '../../core/services';
import { FeatureModel, FeatureConstants } from '../../core/models';
import { ChildComponent } from './child/child.component';
```

## Naming Conventions

### Variables and Functions
- Use **camelCase** for variables and functions
- Use **descriptive names** that reveal intent
- Boolean variables should start with `is`, `has`, `should`, `can`
- Avoid abbreviations unless widely understood

```typescript
// Good
const isUserAuthenticated = true;
const hasPermission = false;
const shouldDisplayModal = true;

// Bad
const auth = true;
const perm = false;
const show = true;
```

### Classes and Interfaces
- Use **PascalCase** for classes and interfaces
- Interfaces should describe what they represent
- Avoid prefixing interfaces with `I`

```typescript
// Good
interface UserProfile { }
class UserService { }

// Bad
interface IUser { }
class userService { }
```

### Constants
- Use **UPPER_SNAKE_CASE** for constants
- Group related constants in constant files

```typescript
// Good
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// Bad
const maxRetryAttempts = 3;
const apiBaseUrl = 'https://api.example.com';
```

### Files and Directories
- Use **kebab-case** for file and directory names
- Follow Angular naming conventions: `feature-name.type.ts`

## TypeScript Best Practices

### Type Safety
```typescript
// Good - Explicit types for public APIs
public getUserById(id: string): Observable<User> {
  return this.http.get<User>(`/api/users/${id}`);
}

// Good - Type inference for obvious cases
const count = 5; // number inferred
const items = ['a', 'b', 'c']; // string[] inferred

// Bad - Using any
public getData(): any { } // Avoid!

// Better - Use unknown if type is uncertain
public getData(): unknown { }
```

### Null Safety
```typescript
// Good - Optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Guest';

// Good - Explicit null checks
if (user !== null && user !== undefined) {
  console.log(user.name);
}

// Bad - Unsafe access
const userName = user.profile.name; // May throw error
```

### Enums vs Union Types
```typescript
// Good - Use enums for related constants
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST'
}

// Good - Use union types for simple cases
type Status = 'pending' | 'approved' | 'rejected';
```

## Angular-Specific Quality Standards

### Component Design
```typescript
// Good - Single responsibility, clear purpose
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
  // Inputs first
  @Input() userId!: string;
  
  // Outputs second
  @Output() profileUpdated = new EventEmitter<UserProfile>();
  
  // Injected dependencies
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  
  // Component state
  private destroy$ = new Subject<void>();
  
  // Lifecycle hooks
  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Public methods
  public updateProfile(): void { }
  
  // Private methods
  private loadUserData(): void { }
}
```

### Service Design
```typescript
// Good - Clear responsibility, proper typing
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Service error:', error);
    return throwError(() => new Error('Operation failed'));
  }
}
```

### Template Quality
```html
<!-- Good - Modern control flow, clear structure -->
<div class="user-profile">
  @if (user) {
    <h2>{{ user.name }}</h2>
    
    @if (user.isActive) {
      <span class="status-badge">Active</span>
    }
    
    @for (item of user.items; track item.id) {
      <div class="item">{{ item.name }}</div>
    }
  } @else {
    <p>Loading...</p>
  }
</div>

<!-- Bad - Old syntax, unclear structure -->
<div class="user-profile">
  <h2 *ngIf="user">{{ user.name }}</h2>
  <span *ngIf="user && user.isActive">Active</span>
  <div *ngFor="let item of user?.items">{{ item.name }}</div>
</div>
```

## Performance Best Practices

### Change Detection
- Always use `OnPush` change detection strategy
- Manually trigger detection only when necessary
- Use immutable data patterns

### Observable Management
```typescript
// Good - Proper subscription management
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.dataService.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.handleData(data));
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

// Good - Use async pipe in templates (auto-unsubscribe)
// Template: {{ data$ | async }}
```

### TrackBy Functions
```typescript
// Good - Implement trackBy for lists
trackById(index: number, item: Item): string {
  return item.id;
}

// Template
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```

## Error Handling

### Comprehensive Error Handling
```typescript
// Good - Specific error handling
this.userService.getUser(id).pipe(
  catchError((error: HttpErrorResponse) => {
    if (error.status === 404) {
      return of(null); // Handle gracefully
    }
    console.error('Error loading user:', error);
    return throwError(() => new Error('Failed to load user'));
  })
).subscribe();
```

### User-Friendly Messages
```typescript
// Good - Provide context to users
private handleError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Unable to connect. Please check your internet connection.';
  }
  if (error.status === 404) {
    return 'The requested resource was not found.';
  }
  if (error.status >= 500) {
    return 'Server error. Please try again later.';
  }
  return 'An unexpected error occurred. Please try again.';
}
```

## Accessibility (a11y)

### Semantic HTML
```html
<!-- Good - Semantic elements -->
<nav aria-label="Main navigation">
  <button aria-label="Open menu">Menu</button>
</nav>

<!-- Bad - Non-semantic elements -->
<div class="nav">
  <div class="button">Menu</div>
</div>
```

### ARIA Attributes
- Use ARIA labels for screen readers
- Ensure keyboard navigation works
- Maintain proper focus management
- Test with screen readers

## Security Best Practices

### Input Sanitization
- Never trust user input
- Use Angular's built-in sanitization
- Validate data on both client and server

### XSS Prevention
```typescript
// Good - Angular sanitizes by default
// Template: {{ userInput }}

// Bad - Bypassing sanitization unnecessarily
// this.sanitizer.bypassSecurityTrustHtml(userInput)
```

## Documentation

### Code Comments
```typescript
// Good - Explain WHY, not WHAT
// Retry 3 times because API is occasionally unreliable
const maxRetries = 3;

// Bad - Obvious comment
// Set max retries to 3
const maxRetries = 3;
```

### JSDoc for Public APIs
```typescript
/**
 * Retrieves user profile by ID
 * @param userId - Unique identifier for the user
 * @returns Observable of user profile data
 * @throws Error if user not found
 */
public getUserProfile(userId: string): Observable<UserProfile> {
  // Implementation
}
```

## Testing Quality

### Test Coverage
- Aim for 80%+ code coverage
- Test critical paths thoroughly
- Test edge cases and error conditions
- Mock external dependencies

### Test Structure
```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpTestingController()]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should retrieve user by id', () => {
    const mockUser = { id: '1', name: 'Test User' };
    
    service.getUser('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });
    
    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
```

## Code Review Checklist

Before submitting code, verify:
- ✅ TypeScript strict mode compliance
- ✅ No `any` types used
- ✅ Proper error handling implemented
- ✅ Subscriptions properly managed
- ✅ OnPush change detection used
- ✅ Tests written and passing
- ✅ No console.log statements (use proper logging)
- ✅ Accessibility considerations addressed
- ✅ Performance optimizations applied
- ✅ Code follows project conventions
- ✅ Documentation updated if needed
