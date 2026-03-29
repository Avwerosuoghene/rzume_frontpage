---
name: code-reviewer
description: Enterprise-grade security-focused code review for Angular applications
tags: [code-review, security, quality, best-practices, angular]
---

# Code Reviewer Skill

Comprehensive security-focused code review for Angular 20 applications. This skill provides enterprise-grade code review processes that ensure code quality, security, performance, and adherence to project standards.

## Overview

The Code Reviewer skill focuses on:
- **Security Analysis**: OWASP Top 10, XSS, CSRF, authentication, authorization
- **Code Quality**: TypeScript best practices, Angular patterns, maintainability
- **Performance**: Bundle size, runtime performance, memory management
- **Testing**: Test coverage, test quality, edge cases
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen readers
- **Best Practices**: Project standards, Angular conventions, industry standards

## Project Context

### Technology Stack
- **Framework**: Angular 20.3.0 with standalone components
- **Language**: TypeScript 5.9.2 (strict mode)
- **UI Library**: Angular Material 20.2.10
- **Testing**: Jasmine 5.9.0, Karma 6.4.0
- **Build**: Angular Build System (@angular/build)

### Project Standards
- Standalone components only (no NgModules)
- OnPush change detection for all components
- Modern control flow (`@if`, `@for`, `@switch`)
- `inject()` function for dependency injection
- BehaviorSubject pattern for state management
- TypeScript strict mode enabled
- 80%+ test coverage requirement

### Code Quality Requirements
- No `any` types (use `unknown` when needed)
- Explicit return types for public APIs
- Proper subscription cleanup with `takeUntil`
- Error handling in all observables
- Accessibility compliance (WCAG 2.1 AA)
- Bundle budgets: 1MB initial, 12kB component styles

---

## Review Workflow

### Phase 1: Pre-Review Preparation

#### 1.1 Understand the Change
**Objective**: Gather context about the code changes

**Actions**:
1. Read the PR/commit description
2. Identify the type of change (feature, bug fix, refactor)
3. Review linked issues or user stories
4. Understand the business context
5. Identify affected areas of the codebase

**Questions to Consider**:
- What problem does this change solve?
- What is the scope of the change?
- Are there any breaking changes?
- What are the acceptance criteria?
- Are there any security implications?

#### 1.2 Review Checklist Preparation
**Objective**: Prepare appropriate review checklist

**Checklist Selection**:
- **New Feature**: Full review (all categories)
- **Bug Fix**: Focus on root cause, testing, regression
- **Refactoring**: Focus on maintainability, testing, backward compatibility
- **Performance**: Focus on performance metrics, profiling
- **Security**: Focus on security analysis, vulnerability assessment
- **UI/UX**: Focus on accessibility, responsive design, user experience

---

### Phase 2: Security Review

#### 2.1 Authentication & Authorization
**Objective**: Ensure proper authentication and authorization

**Review Checklist**:

**Authentication**:
```typescript
// ✅ GOOD: Proper token handling
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';
  
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey); // Use sessionStorage, not localStorage for sensitive tokens
  }
  
  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }
  
  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}

// ❌ BAD: Token in localStorage, exposed globally
export class AuthService {
  token: string; // Exposed as public property
  
  setToken(token: string): void {
    localStorage.setItem('token', token); // localStorage persists across sessions
    this.token = token; // Stored in memory
  }
}
```

**Authorization**:
```typescript
// ✅ GOOD: Proper route guard with role checking
export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as string[];
  const userRoles = authService.getUserRoles();
  
  const hasRole = requiredRoles.some(role => userRoles.includes(role));
  
  if (!hasRole) {
    router.navigate(['/unauthorized']);
    return false;
  }
  
  return true;
};

// ❌ BAD: Client-side only authorization
@Component({...})
export class AdminComponent {
  // No route guard, only UI hiding
  isAdmin = this.authService.isAdmin(); // Can be bypassed
}
```

**Security Checks**:
- [ ] Authentication tokens stored securely (sessionStorage, not localStorage)
- [ ] Tokens not exposed in URLs or logs
- [ ] Proper token expiration handling
- [ ] Route guards protect sensitive routes
- [ ] Role-based access control implemented correctly
- [ ] Authorization checked on both client and server
- [ ] No hardcoded credentials or API keys
- [ ] Sensitive data not logged to console

#### 2.2 Input Validation & Sanitization
**Objective**: Prevent injection attacks (XSS, SQL injection, etc.)

**Review Checklist**:

**Input Validation**:
```typescript
// ✅ GOOD: Comprehensive validation
export class UserFormComponent {
  userForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(255)
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9_-]+$/) // Whitelist allowed characters
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(150)
    ])
  });
  
  onSubmit(): void {
    if (this.userForm.invalid) {
      return; // Don't submit invalid data
    }
    
    const sanitizedData = this.sanitizeInput(this.userForm.value);
    this.userService.createUser(sanitizedData).subscribe();
  }
  
  private sanitizeInput(data: any): any {
    // Additional sanitization if needed
    return {
      email: data.email.trim().toLowerCase(),
      username: data.username.trim(),
      age: parseInt(data.age, 10)
    };
  }
}

// ❌ BAD: No validation
export class UserFormComponent {
  onSubmit(data: any): void {
    this.userService.createUser(data).subscribe(); // Direct submission without validation
  }
}
```

**XSS Prevention**:
```typescript
// ✅ GOOD: Safe HTML rendering
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({...})
export class ContentComponent {
  private sanitizer = inject(DomSanitizer);
  
  trustedHtml: SafeHtml;
  
  setContent(html: string): void {
    // Sanitize before rendering
    this.trustedHtml = this.sanitizer.sanitize(SecurityContext.HTML, html);
  }
}

// Template
<div [innerHTML]="trustedHtml"></div>

// ❌ BAD: Unsafe HTML rendering
@Component({
  template: `<div [innerHTML]="userContent"></div>` // Direct user input
})
export class ContentComponent {
  userContent: string; // Unsanitized user input
}
```

**Security Checks**:
- [ ] All user inputs validated (client and server-side)
- [ ] Whitelist validation used (not just blacklist)
- [ ] Input length limits enforced
- [ ] Special characters properly handled
- [ ] HTML content sanitized before rendering
- [ ] No use of `bypassSecurityTrust*` without justification
- [ ] File uploads validated (type, size, content)
- [ ] SQL injection prevented (parameterized queries on backend)

#### 2.3 CSRF Protection
**Objective**: Prevent Cross-Site Request Forgery attacks

**Review Checklist**:

```typescript
// ✅ GOOD: CSRF token in HTTP interceptor
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next(req);
  }
  
  const csrfToken = getCsrfTokenFromCookie();
  
  if (csrfToken) {
    const clonedRequest = req.clone({
      setHeaders: {
        'X-CSRF-Token': csrfToken
      }
    });
    return next(clonedRequest);
  }
  
  return next(req);
};

function getCsrfTokenFromCookie(): string | null {
  const name = 'CSRF-TOKEN=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }
  
  return null;
}

// ❌ BAD: No CSRF protection
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req); // No CSRF token
};
```

**Security Checks**:
- [ ] CSRF tokens used for state-changing operations
- [ ] CSRF tokens validated on backend
- [ ] SameSite cookie attribute set
- [ ] Origin/Referer headers validated on backend
- [ ] No sensitive operations via GET requests

#### 2.4 Data Protection
**Objective**: Protect sensitive data in transit and at rest

**Review Checklist**:

```typescript
// ✅ GOOD: Sensitive data handling
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  
  updatePassword(userId: string, oldPassword: string, newPassword: string): Observable<void> {
    // Don't log sensitive data
    console.log('Updating password for user:', userId); // Only log user ID
    
    return this.http.put<void>('/api/users/password', {
      userId,
      oldPassword, // Sent over HTTPS only
      newPassword
    }).pipe(
      catchError(error => {
        // Don't expose sensitive error details
        console.error('Password update failed'); // Generic message
        return throwError(() => new Error('Failed to update password'));
      })
    );
  }
}

// ❌ BAD: Exposing sensitive data
@Injectable({ providedIn: 'root' })
export class UserService {
  updatePassword(userId: string, oldPassword: string, newPassword: string): Observable<void> {
    console.log('Updating password:', oldPassword, newPassword); // Logged to console
    
    return this.http.put<void>('/api/users/password', {
      userId,
      oldPassword,
      newPassword
    }).pipe(
      catchError(error => {
        console.error('Password update failed:', error.error); // Exposes backend error
        return throwError(() => error);
      })
    );
  }
}
```

**Security Checks**:
- [ ] HTTPS used for all API calls (no HTTP)
- [ ] Sensitive data not logged to console
- [ ] Sensitive data not stored in localStorage
- [ ] Passwords never stored in plain text
- [ ] Credit card data handled according to PCI DSS
- [ ] Personal data handled according to GDPR/privacy laws
- [ ] Sensitive data cleared from memory when no longer needed
- [ ] Error messages don't expose sensitive information

#### 2.5 Dependency Security
**Objective**: Ensure dependencies are secure and up-to-date

**Review Checklist**:

```bash
# Check for vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Fix vulnerabilities
npm audit fix
```

**Security Checks**:
- [ ] No known vulnerabilities in dependencies (`npm audit`)
- [ ] Dependencies are up-to-date
- [ ] No unused dependencies
- [ ] Dependencies from trusted sources only
- [ ] Lock file (package-lock.json) committed
- [ ] No dependencies with restrictive licenses
- [ ] Regular dependency updates scheduled

---

### Phase 3: Code Quality Review

#### 3.1 TypeScript Best Practices
**Objective**: Ensure type safety and code quality

**Review Checklist**:

**Type Safety**:
```typescript
// ✅ GOOD: Proper typing
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest'
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
  
  updateUser(id: string, updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, updates);
  }
}

// ❌ BAD: Using 'any'
@Injectable({ providedIn: 'root' })
export class UserService {
  getUser(id: any): Observable<any> { // 'any' types
    return this.http.get(`/api/users/${id}`);
  }
  
  updateUser(id: any, updates: any): Observable<any> {
    return this.http.put(`/api/users/${id}`, updates);
  }
}
```

**Null Safety**:
```typescript
// ✅ GOOD: Proper null handling
@Component({...})
export class UserComponent {
  user: User | null = null;
  
  displayName(): string {
    return this.user?.name ?? 'Guest'; // Optional chaining and nullish coalescing
  }
  
  updateUser(updates: Partial<User>): void {
    if (!this.user) {
      console.error('No user to update');
      return;
    }
    
    this.userService.updateUser(this.user.id, updates).subscribe();
  }
}

// ❌ BAD: No null checks
@Component({...})
export class UserComponent {
  user: User;
  
  displayName(): string {
    return this.user.name; // Potential null reference error
  }
  
  updateUser(updates: Partial<User>): void {
    this.userService.updateUser(this.user.id, updates).subscribe(); // No null check
  }
}
```

**Quality Checks**:
- [ ] No `any` types (use `unknown` when type is uncertain)
- [ ] Explicit return types for public methods
- [ ] Proper use of optional chaining (`?.`)
- [ ] Proper use of nullish coalescing (`??`)
- [ ] Interfaces for all data structures
- [ ] Enums for fixed sets of values
- [ ] Type guards for runtime type checking
- [ ] No implicit `any` from missing types
- [ ] Strict mode enabled and followed

#### 3.2 Angular Component Patterns
**Objective**: Ensure components follow Angular best practices

**Review Checklist**:

**Component Structure**:
```typescript
// ✅ GOOD: Proper component structure
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent implements OnInit, OnDestroy {
  // 1. Inputs
  @Input({ required: true }) user!: User;
  @Input() showActions = true;
  
  // 2. Outputs
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<string>();
  
  // 3. Dependency Injection
  private cdr = inject(ChangeDetectorRef);
  
  // 4. State
  private destroy$ = new Subject<void>();
  isExpanded = false;
  
  // 5. Lifecycle hooks
  ngOnInit(): void {
    // Initialization logic
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // 6. Public methods
  onEdit(): void {
    this.edit.emit(this.user);
  }
  
  onDelete(): void {
    this.delete.emit(this.user.id);
  }
  
  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }
  
  // 7. Private methods
  private updateView(): void {
    this.cdr.markForCheck();
  }
}

// ❌ BAD: Poor component structure
@Component({
  selector: 'user-card', // Missing 'app-' prefix
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'] // Should be styleUrl (singular)
  // Missing: standalone, imports, changeDetection
})
export class UserCardComponent {
  @Input() user: any; // 'any' type, not required
  
  constructor(private cdr: ChangeDetectorRef) {} // Should use inject()
  
  // No proper cleanup
  // No clear organization
}
```

**Template Best Practices**:
```html
<!-- ✅ GOOD: Modern control flow -->
@if (user) {
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    
    @if (showActions) {
      <div class="actions">
        <button (click)="onEdit()">Edit</button>
        <button (click)="onDelete()">Delete</button>
      </div>
    }
    
    @if (isExpanded) {
      <div class="details">
        <p>Email: {{ user.email }}</p>
        <p>Role: {{ user.role }}</p>
      </div>
    }
  </div>
} @else {
  <div class="empty-state">No user data</div>
}

<!-- List with trackBy -->
@for (item of items; track item.id) {
  <app-item [data]="item" />
}

<!-- ❌ BAD: Old syntax and missing trackBy -->
<div *ngIf="user"> <!-- Old *ngIf syntax -->
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    
    <div *ngIf="showActions"> <!-- Nested *ngIf -->
      <div class="actions">
        <button (click)="onEdit()">Edit</button>
      </div>
    </div>
  </div>
</div>

<!-- Missing trackBy -->
<div *ngFor="let item of items">
  <app-item [data]="item" />
</div>
```

**Quality Checks**:
- [ ] Standalone components (no NgModules)
- [ ] OnPush change detection strategy
- [ ] Modern control flow (`@if`, `@for`, `@switch`)
- [ ] `inject()` function for DI (not constructor injection)
- [ ] Required inputs marked with `required: true`
- [ ] Proper subscription cleanup with `takeUntil`
- [ ] TrackBy functions for `@for` loops
- [ ] Single responsibility principle
- [ ] Smart vs Dumb component separation
- [ ] No business logic in templates

#### 3.3 Service Patterns
**Objective**: Ensure services follow project patterns

**Review Checklist**:

**State Management Service**:
```typescript
// ✅ GOOD: Proper state service
@Injectable({ providedIn: 'root' })
export class UserStateService {
  // Private subjects
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  // Public observables with shareReplay
  users$ = this.usersSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  
  // Computed observables
  userCount$ = this.users$.pipe(
    map(users => users.length)
  );
  
  // Getters for synchronous access
  get currentUsers(): User[] {
    return this.usersSubject.value;
  }
  
  // State mutations
  setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }
  
  addUser(user: User): void {
    const current = this.usersSubject.value;
    this.usersSubject.next([...current, user]);
  }
  
  updateUser(id: string, updates: Partial<User>): void {
    const current = this.usersSubject.value;
    const updated = current.map(user =>
      user.id === id ? { ...user, ...updates } : user
    );
    this.usersSubject.next(updated);
  }
  
  removeUser(id: string): void {
    const current = this.usersSubject.value;
    const filtered = current.filter(user => user.id !== id);
    this.usersSubject.next(filtered);
  }
  
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
  
  setError(error: string | null): void {
    this.errorSubject.next(error);
  }
  
  reset(): void {
    this.usersSubject.next([]);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
  }
}

// ❌ BAD: Poor state management
@Injectable({ providedIn: 'root' })
export class UserStateService {
  users: User[] = []; // Public mutable state
  loading = false;
  error: string | null = null;
  
  // No observables, no immutability
  addUser(user: User): void {
    this.users.push(user); // Direct mutation
  }
}
```

**API Service**:
```typescript
// ✅ GOOD: Proper API service
@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }
  
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  createUser(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
  }
  
  updateUser(id: string, updates: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, updates).pipe(
      catchError(this.handleError)
    );
  }
  
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

// ❌ BAD: Poor API service
@Injectable({ providedIn: 'root' })
export class UserApiService {
  constructor(private http: HttpClient) {} // Should use inject()
  
  getUsers(): Observable<any> { // 'any' return type
    return this.http.get('/users'); // No error handling, relative URL
  }
}
```

**Quality Checks**:
- [ ] `providedIn: 'root'` for singleton services
- [ ] `inject()` function for dependency injection
- [ ] BehaviorSubject pattern for state
- [ ] `shareReplay` for shared observables
- [ ] Proper error handling with `catchError`
- [ ] Immutable state updates
- [ ] Clear separation: state/API/facade services
- [ ] No business logic in API services
- [ ] Proper typing (no `any`)

#### 3.4 Error Handling
**Objective**: Ensure robust error handling

**Review Checklist**:

```typescript
// ✅ GOOD: Comprehensive error handling
@Injectable({ providedIn: 'root' })
export class UserFacadeService {
  private apiService = inject(UserApiService);
  private stateService = inject(UserStateService);
  private notificationService = inject(NotificationService);
  
  loadUsers(): void {
    this.stateService.setLoading(true);
    this.stateService.setError(null);
    
    this.apiService.getUsers().pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1000)
      }),
      catchError(error => {
        const errorMessage = 'Failed to load users. Please try again.';
        this.stateService.setError(errorMessage);
        this.notificationService.showError(errorMessage);
        return of([]); // Return empty array as fallback
      }),
      finalize(() => this.stateService.setLoading(false))
    ).subscribe(users => {
      this.stateService.setUsers(users);
    });
  }
  
  createUser(user: CreateUserDto): Observable<User> {
    this.stateService.setLoading(true);
    
    return this.apiService.createUser(user).pipe(
      tap(created => {
        this.stateService.addUser(created);
        this.notificationService.showSuccess('User created successfully');
      }),
      catchError(error => {
        const errorMessage = this.getErrorMessage(error);
        this.stateService.setError(errorMessage);
        this.notificationService.showError(errorMessage);
        return throwError(() => error);
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }
  
  private getErrorMessage(error: any): string {
    if (error.status === 400) {
      return 'Invalid user data. Please check your input.';
    } else if (error.status === 409) {
      return 'User already exists.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else {
      return 'An unexpected error occurred.';
    }
  }
}

// ❌ BAD: Poor error handling
@Injectable({ providedIn: 'root' })
export class UserFacadeService {
  loadUsers(): void {
    this.apiService.getUsers().subscribe(users => {
      this.stateService.setUsers(users);
      // No error handling
    });
  }
  
  createUser(user: CreateUserDto): Observable<User> {
    return this.apiService.createUser(user); // No error handling
  }
}
```

**Quality Checks**:
- [ ] All observables have error handling
- [ ] User-friendly error messages
- [ ] Errors logged for debugging
- [ ] Retry logic for transient failures
- [ ] Fallback values for non-critical errors
- [ ] Loading states properly managed
- [ ] Error states properly managed
- [ ] `finalize` operator for cleanup

---

### Phase 4: Performance Review

#### 4.1 Bundle Size
**Objective**: Ensure bundle size meets requirements

**Review Checklist**:

```bash
# Build and check bundle size
npm run build

# Analyze bundle
npx webpack-bundle-analyzer dist/stats.json
```

**Bundle Optimization**:
```typescript
// ✅ GOOD: Lazy loading
export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component')
      .then(m => m.UsersComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component')
      .then(m => m.AdminComponent),
    canActivate: [AuthGuard]
  }
];

// ❌ BAD: Eager loading everything
import { UsersComponent } from './pages/users/users.component';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'admin', component: AdminComponent }
];
```

**Performance Checks**:
- [ ] Initial bundle < 500kB (warning), < 1MB (error)
- [ ] Component styles < 8kB (warning), < 12kB (error)
- [ ] All routes lazy loaded
- [ ] No unnecessary dependencies
- [ ] Tree-shaking enabled
- [ ] Production build optimized
- [ ] Source maps not included in production

#### 4.2 Runtime Performance
**Objective**: Ensure optimal runtime performance

**Review Checklist**:

**Change Detection**:
```typescript
// ✅ GOOD: OnPush with proper change detection
@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  private cdr = inject(ChangeDetectorRef);
  
  @Input() set users(value: User[]) {
    this._users = value;
    this.cdr.markForCheck(); // Trigger change detection
  }
  get users(): User[] {
    return this._users;
  }
  private _users: User[] = [];
  
  updateUser(user: User): void {
    // Immutable update
    this._users = this._users.map(u =>
      u.id === user.id ? user : u
    );
    this.cdr.markForCheck();
  }
}

// ❌ BAD: Default change detection
@Component({
  selector: 'app-user-list'
  // No changeDetection specified (defaults to Default)
})
export class UserListComponent {
  @Input() users: User[] = [];
  
  updateUser(user: User): void {
    // Mutable update
    const index = this.users.findIndex(u => u.id === user.id);
    this.users[index] = user; // Direct mutation
  }
}
```

**TrackBy Functions**:
```typescript
// ✅ GOOD: TrackBy for lists
@Component({
  template: `
    @for (user of users; track user.id) {
      <app-user-card [user]="user" />
    }
  `
})
export class UserListComponent {
  @Input() users: User[] = [];
}

// ❌ BAD: No trackBy
@Component({
  template: `
    @for (user of users; track $index) {
      <app-user-card [user]="user" />
    }
  `
})
export class UserListComponent {
  @Input() users: User[] = [];
}
```

**Performance Checks**:
- [ ] OnPush change detection used
- [ ] TrackBy functions for all loops
- [ ] No heavy computations in templates
- [ ] Proper use of `async` pipe
- [ ] No memory leaks (subscriptions cleaned up)
- [ ] Debouncing for frequent operations
- [ ] Virtual scrolling for long lists
- [ ] Image lazy loading

#### 4.3 Memory Management
**Objective**: Prevent memory leaks

**Review Checklist**:

```typescript
// ✅ GOOD: Proper cleanup
@Component({...})
export class UserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private userService = inject(UserService);
  
  users$ = this.userService.users$;
  
  ngOnInit(): void {
    // Subscription with cleanup
    this.userService.loadUsers();
    
    this.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        console.log('Users loaded:', users.length);
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ❌ BAD: Memory leak
@Component({...})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  
  ngOnInit(): void {
    // Subscription without cleanup
    this.userService.users$.subscribe(users => {
      console.log('Users loaded:', users.length);
    });
    
    // Interval without cleanup
    setInterval(() => {
      this.userService.loadUsers();
    }, 5000);
  }
  
  // No ngOnDestroy, subscriptions never cleaned up
}
```

**Memory Checks**:
- [ ] All subscriptions cleaned up in `ngOnDestroy`
- [ ] `takeUntil` pattern used consistently
- [ ] Event listeners removed in `ngOnDestroy`
- [ ] Timers/intervals cleared in `ngOnDestroy`
- [ ] No circular references
- [ ] Large objects cleared when not needed
- [ ] No global state pollution

---

### Phase 5: Testing Review

#### 5.1 Test Coverage
**Objective**: Ensure adequate test coverage

**Review Checklist**:

```bash
# Run tests with coverage
npm test -- --code-coverage

# Check coverage report
open coverage/index.html
```

**Coverage Requirements**:
- [ ] Overall coverage > 80%
- [ ] Statement coverage > 80%
- [ ] Branch coverage > 75%
- [ ] Function coverage > 80%
- [ ] Line coverage > 80%

#### 5.2 Test Quality
**Objective**: Ensure tests are meaningful and maintainable

**Review Checklist**:

**Component Tests**:
```typescript
// ✅ GOOD: Comprehensive component test
describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;
  
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.User
  };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display user name', () => {
    const compiled = fixture.nativeElement;
    const nameElement = compiled.querySelector('h3');
    expect(nameElement.textContent).toContain('John Doe');
  });
  
  it('should emit edit event when edit button clicked', () => {
    spyOn(component.edit, 'emit');
    
    const button = fixture.nativeElement.querySelector('.edit-button');
    button.click();
    
    expect(component.edit.emit).toHaveBeenCalledWith(mockUser);
  });
  
  it('should emit delete event when delete button clicked', () => {
    spyOn(component.delete, 'emit');
    
    const button = fixture.nativeElement.querySelector('.delete-button');
    button.click();
    
    expect(component.delete.emit).toHaveBeenCalledWith('1');
  });
  
  it('should toggle expanded state', () => {
    expect(component.isExpanded).toBe(false);
    
    component.toggleExpanded();
    expect(component.isExpanded).toBe(true);
    
    component.toggleExpanded();
    expect(component.isExpanded).toBe(false);
  });
  
  it('should hide actions when showActions is false', () => {
    component.showActions = false;
    fixture.detectChanges();
    
    const actions = fixture.nativeElement.querySelector('.actions');
    expect(actions).toBeNull();
  });
});

// ❌ BAD: Minimal test
describe('UserCardComponent', () => {
  it('should create', () => {
    const component = new UserCardComponent();
    expect(component).toBeTruthy();
  });
});
```

**Service Tests**:
```typescript
// ✅ GOOD: Comprehensive service test
describe('UserApiService', () => {
  let service: UserApiService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(UserApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should fetch users', () => {
    const mockUsers: User[] = [
      { id: '1', name: 'User 1', email: 'user1@example.com', role: UserRole.User },
      { id: '2', name: 'User 2', email: 'user2@example.com', role: UserRole.Admin }
    ];
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
  
  it('should handle error when fetching users', () => {
    service.getUsers().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.message).toContain('Server Error');
      }
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
  
  it('should create user', () => {
    const newUser: CreateUserDto = {
      name: 'New User',
      email: 'new@example.com'
    };
    
    const createdUser: User = {
      id: '3',
      ...newUser,
      role: UserRole.User
    };
    
    service.createUser(newUser).subscribe(user => {
      expect(user).toEqual(createdUser);
    });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(createdUser);
  });
});
```

**Test Quality Checks**:
- [ ] Tests are isolated and independent
- [ ] Tests use proper mocking
- [ ] Tests cover success and error scenarios
- [ ] Tests cover edge cases
- [ ] Tests are readable and maintainable
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] No test interdependencies
- [ ] Tests clean up after themselves

---

### Phase 6: Accessibility Review

#### 6.1 WCAG 2.1 AA Compliance
**Objective**: Ensure accessibility compliance

**Review Checklist**:

**Semantic HTML**:
```html
<!-- ✅ GOOD: Semantic HTML -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/home">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Page Title</h1>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

<footer>
  <p>&copy; 2024 Company Name</p>
</footer>

<!-- ❌ BAD: Non-semantic HTML -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
    <div class="nav-item">About</div>
  </div>
</div>

<div class="content">
  <div class="title">Page Title</div>
  <div class="section">
    <div class="section-title">Section Title</div>
    <div>Content...</div>
  </div>
</div>
```

**ARIA Labels**:
```html
<!-- ✅ GOOD: Proper ARIA labels -->
<button 
  aria-label="Close dialog"
  (click)="closeDialog()">
  <mat-icon aria-hidden="true">close</mat-icon>
</button>

<input 
  type="search"
  aria-label="Search users"
  placeholder="Search..."
  [(ngModel)]="searchTerm">

<div 
  role="alert"
  aria-live="polite"
  *ngIf="errorMessage">
  {{ errorMessage }}
</div>

<!-- ❌ BAD: Missing ARIA labels -->
<button (click)="closeDialog()">
  <mat-icon>close</mat-icon>
</button>

<input 
  type="search"
  placeholder="Search...">

<div *ngIf="errorMessage">
  {{ errorMessage }}
</div>
```

**Keyboard Navigation**:
```typescript
// ✅ GOOD: Keyboard support
@Component({
  template: `
    <div 
      class="card"
      tabindex="0"
      role="button"
      (click)="handleClick()"
      (keydown.enter)="handleClick()"
      (keydown.space)="handleClick()">
      {{ content }}
    </div>
  `
})
export class CardComponent {
  handleClick(): void {
    // Handle interaction
  }
}

// ❌ BAD: No keyboard support
@Component({
  template: `
    <div 
      class="card"
      (click)="handleClick()">
      {{ content }}
    </div>
  `
})
export class CardComponent {
  handleClick(): void {
    // Handle interaction
  }
}
```

**Accessibility Checks**:
- [ ] Semantic HTML elements used
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Alt text for images
- [ ] Form labels associated with inputs
- [ ] Error messages announced to screen readers
- [ ] Skip navigation links provided

---

### Phase 7: Final Review

#### 7.1 Code Style & Consistency
**Objective**: Ensure code follows project style guide

**Review Checklist**:

**Naming Conventions**:
```typescript
// ✅ GOOD: Proper naming
// Components
export class UserCardComponent { }

// Services
export class UserApiService { }
export class UserStateService { }

// Interfaces
export interface User { }
export interface CreateUserDto { }

// Enums
export enum UserRole { }

// Constants
export const USER_CONFIG = { } as const;

// Functions
function getUserById(id: string): User { }

// Variables
const userName = 'John';
let isActive = true;

// ❌ BAD: Poor naming
export class usercard { } // Should be PascalCase
export class user_service { } // Should be PascalCase
export interface user { } // Should be PascalCase
export enum userrole { } // Should be PascalCase
const UserName = 'John'; // Should be camelCase
let is_active = true; // Should be camelCase
```

**File Organization**:
```
✅ GOOD:
src/app/
├── pages/
│   └── users/
│       ├── users.component.ts
│       ├── users.component.html
│       ├── users.component.scss
│       └── users.component.spec.ts
├── components/
│   └── user-card/
│       ├── user-card.component.ts
│       ├── user-card.component.html
│       ├── user-card.component.scss
│       └── user-card.component.spec.ts
└── core/
    ├── services/
    │   ├── user-api.service.ts
    │   ├── user-api.service.spec.ts
    │   ├── user-state.service.ts
    │   └── user-state.service.spec.ts
    └── models/
        ├── interfaces/
        │   └── user.interface.ts
        ├── enums/
        │   └── user.enums.ts
        └── constants/
            └── user.constants.ts

❌ BAD:
src/app/
├── users.component.ts
├── users.html
├── users.css
├── user-card.ts
├── userService.ts
└── user-interface.ts
```

**Style Checks**:
- [ ] Consistent naming conventions
- [ ] Proper file organization
- [ ] Consistent indentation (2 spaces)
- [ ] No trailing whitespace
- [ ] Consistent quote style (single quotes)
- [ ] Line length ≤ 100 characters
- [ ] Proper import organization
- [ ] No unused imports
- [ ] No console.log in production code

#### 7.2 Documentation
**Objective**: Ensure code is properly documented

**Review Checklist**:

```typescript
// ✅ GOOD: Proper documentation
/**
 * Service for managing user data and state.
 * 
 * This service provides methods for CRUD operations on users
 * and maintains the current state of user data in the application.
 * 
 * @example
 * ```typescript
 * const facade = inject(UserFacadeService);
 * facade.loadUsers();
 * facade.users$.subscribe(users => console.log(users));
 * ```
 */
@Injectable({ providedIn: 'root' })
export class UserFacadeService {
  /**
   * Observable stream of all users.
   * Emits whenever the user list changes.
   */
  users$ = this.stateService.users$;
  
  /**
   * Loads all users from the API.
   * Updates the state with the loaded users.
   * 
   * @throws {Error} If the API request fails
   */
  loadUsers(): void {
    // Implementation
  }
  
  /**
   * Creates a new user.
   * 
   * @param user - The user data to create
   * @returns Observable that emits the created user
   * @throws {Error} If validation fails or API request fails
   */
  createUser(user: CreateUserDto): Observable<User> {
    // Implementation
    return of({} as User);
  }
}

// ❌ BAD: No documentation
@Injectable({ providedIn: 'root' })
export class UserFacadeService {
  users$ = this.stateService.users$;
  
  loadUsers(): void {
    // Implementation
  }
  
  createUser(user: CreateUserDto): Observable<User> {
    // Implementation
    return of({} as User);
  }
}
```

**Documentation Checks**:
- [ ] Public APIs documented with JSDoc
- [ ] Complex logic explained with comments
- [ ] README updated if needed
- [ ] API changes documented
- [ ] Breaking changes highlighted
- [ ] Examples provided for complex features
- [ ] No commented-out code
- [ ] TODO comments tracked

#### 7.3 Final Checklist
**Objective**: Complete final review

**Security** ✅
- [ ] No security vulnerabilities
- [ ] Authentication/authorization proper
- [ ] Input validation implemented
- [ ] XSS/CSRF protection in place
- [ ] Sensitive data protected
- [ ] Dependencies secure

**Code Quality** ✅
- [ ] TypeScript strict mode compliant
- [ ] No `any` types
- [ ] Proper error handling
- [ ] Clean code principles followed
- [ ] SOLID principles followed
- [ ] DRY principle followed

**Angular Best Practices** ✅
- [ ] Standalone components
- [ ] OnPush change detection
- [ ] Modern control flow
- [ ] Proper DI with `inject()`
- [ ] Subscription cleanup
- [ ] Service patterns followed

**Performance** ✅
- [ ] Bundle size within limits
- [ ] Lazy loading implemented
- [ ] No memory leaks
- [ ] Optimized change detection
- [ ] TrackBy functions used

**Testing** ✅
- [ ] Test coverage > 80%
- [ ] Tests are meaningful
- [ ] Edge cases covered
- [ ] Tests pass

**Accessibility** ✅
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Proper ARIA labels

**Documentation** ✅
- [ ] Code documented
- [ ] README updated
- [ ] API changes documented
- [ ] Examples provided

---

## Review Report Template

```markdown
# Code Review Report

**PR/Commit**: [Link]
**Reviewer**: [Name]
**Date**: [Date]
**Status**: ✅ Approved | ⚠️ Approved with Comments | ❌ Changes Requested

## Summary
[Brief summary of the changes]

## Security Review
### Critical Issues 🔴
- [List critical security issues]

### Warnings 🟡
- [List security warnings]

### Passed ✅
- [List security checks that passed]

## Code Quality Review
### Issues Found
- [List code quality issues]

### Suggestions
- [List improvement suggestions]

### Strengths
- [List positive aspects]

## Performance Review
### Concerns
- [List performance concerns]

### Optimizations
- [List suggested optimizations]

## Testing Review
### Coverage
- Overall: [X]%
- Statements: [X]%
- Branches: [X]%
- Functions: [X]%
- Lines: [X]%

### Test Quality
- [Comments on test quality]

## Accessibility Review
### Issues
- [List accessibility issues]

### Recommendations
- [List accessibility recommendations]

## Action Items
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]

## Conclusion
[Final recommendation and comments]

---
**Next Steps**: [What needs to happen next]
```

---

## Usage Examples

### Example 1: Review New Feature
```
@code-reviewer

Please review the user profile management feature in:
- src/app/pages/profile/
- src/app/components/profile/
- src/app/core/services/profile*.service.ts

Focus on security (authentication, data protection) and code quality.
```

### Example 2: Review Bug Fix
```
@code-reviewer

Review the bug fix for memory leak in dashboard component:
- src/app/pages/dashboard/dashboard.component.ts

Verify:
1. Memory leak is actually fixed
2. No new issues introduced
3. Proper testing added
```

### Example 3: Review Refactoring
```
@code-reviewer

Review the refactoring of authentication module from NgModule to standalone:
- src/app/core/auth/

Ensure:
1. Backward compatibility maintained
2. No breaking changes
3. All tests still pass
4. Performance not degraded
```

### Example 4: Security-Focused Review
```
@code-reviewer

Security-focused review of payment integration:
- src/app/pages/payment/
- src/app/core/services/payment.service.ts

Check for:
1. PCI DSS compliance
2. Sensitive data handling
3. Input validation
4. Error handling
5. Logging (no sensitive data logged)
```

---

## Best Practices

### When to Use Code Reviewer
✅ **Use for**:
- All pull requests before merging
- Security-critical changes
- Performance-critical changes
- Major refactoring
- New features
- Bug fixes with unclear root cause
- Third-party integrations
- Database schema changes

### Review Priorities
**High Priority** (Must fix):
- Security vulnerabilities
- Memory leaks
- Breaking changes
- Data loss risks
- Critical bugs

**Medium Priority** (Should fix):
- Code quality issues
- Performance concerns
- Missing tests
- Accessibility issues
- Documentation gaps

**Low Priority** (Nice to have):
- Style inconsistencies
- Minor optimizations
- Refactoring opportunities
- Additional test cases

### Reviewer Responsibilities
- ✅ Be thorough but constructive
- ✅ Explain the "why" behind feedback
- ✅ Provide code examples when possible
- ✅ Acknowledge good practices
- ✅ Focus on important issues
- ✅ Be respectful and professional
- ❌ Don't be overly pedantic
- ❌ Don't block on minor style issues
- ❌ Don't assume malicious intent

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-01  
**Maintained By**: Development Team
