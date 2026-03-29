---
description: Service development patterns and best practices
trigger: glob
glob: "*.service.ts"
---

# Service Development Patterns

## Service Architecture

### Service Types

#### 1. Data Services (API Integration)
Handle HTTP communication with backend APIs
```typescript
@Injectable({ providedIn: 'root' })
export class UserDataService {
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
  
  updateUser(id: string, user: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }
  
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('API request failed'));
  }
}
```

#### 2. State Services (State Management)
Manage application state using BehaviorSubject pattern
```typescript
@Injectable({ providedIn: 'root' })
export class UserStateService {
  // Private state
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  // Public observables
  user$ = this.userSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  
  // Computed observables
  isAuthenticated$ = this.user$.pipe(
    map(user => user !== null)
  );
  
  // State getters
  get currentUser(): User | null {
    return this.userSubject.value;
  }
  
  // State setters
  setUser(user: User | null): void {
    this.userSubject.next(user);
    this.errorSubject.next(null);
  }
  
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
  
  setError(error: string | null): void {
    this.errorSubject.next(error);
  }
  
  // State reset
  reset(): void {
    this.userSubject.next(null);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
  }
}
```

#### 3. Facade Services (Business Logic)
Coordinate multiple services and provide simplified API
```typescript
@Injectable({ providedIn: 'root' })
export class UserFacadeService {
  private userDataService = inject(UserDataService);
  private userStateService = inject(UserStateService);
  private analyticsService = inject(AnalyticsService);
  
  // Expose state
  user$ = this.userStateService.user$;
  loading$ = this.userStateService.loading$;
  error$ = this.userStateService.error$;
  
  loadUser(id: string): void {
    this.userStateService.setLoading(true);
    
    this.userDataService.getUserById(id).subscribe({
      next: (user) => {
        this.userStateService.setUser(user);
        this.userStateService.setLoading(false);
        this.analyticsService.trackEvent('user_loaded', { userId: id });
      },
      error: (error) => {
        this.userStateService.setError('Failed to load user');
        this.userStateService.setLoading(false);
        this.analyticsService.trackError('user_load_failed', error);
      }
    });
  }
  
  updateUser(id: string, updates: UpdateUserDto): Observable<User> {
    this.userStateService.setLoading(true);
    
    return this.userDataService.updateUser(id, updates).pipe(
      tap((user) => {
        this.userStateService.setUser(user);
        this.userStateService.setLoading(false);
        this.analyticsService.trackEvent('user_updated', { userId: id });
      }),
      catchError((error) => {
        this.userStateService.setError('Failed to update user');
        this.userStateService.setLoading(false);
        return throwError(() => error);
      })
    );
  }
}
```

#### 4. Utility Services (Helper Functions)
Provide reusable utility functions
```typescript
@Injectable({ providedIn: 'root' })
export class DateUtilityService {
  formatDate(date: Date, format: string = 'MM/DD/YYYY'): string {
    // Implementation
    return '';
  }
  
  isDateInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }
  
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
```

## Service Structure Template

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FeatureService {
  // 1. Dependency Injection
  private http = inject(HttpClient);
  
  // 2. Configuration
  private readonly baseUrl = environment.apiUrl;
  private readonly cacheTime = 5 * 60 * 1000; // 5 minutes
  
  // 3. State Management (if needed)
  private dataSubject = new BehaviorSubject<DataType[]>([]);
  public data$ = this.dataSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  
  // 4. Constructor (only if initialization logic needed)
  constructor() {
    // Initialization logic
  }
  
  // 5. Public Methods (API)
  getData(): Observable<DataType[]> {
    return this.http.get<DataType[]>(`${this.baseUrl}/data`).pipe(
      tap(data => this.dataSubject.next(data)),
      catchError(this.handleError)
    );
  }
  
  getById(id: string): Observable<DataType> {
    return this.http.get<DataType>(`${this.baseUrl}/data/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  create(data: CreateDataDto): Observable<DataType> {
    return this.http.post<DataType>(`${this.baseUrl}/data`, data).pipe(
      tap(newData => this.updateCache(newData)),
      catchError(this.handleError)
    );
  }
  
  update(id: string, data: UpdateDataDto): Observable<DataType> {
    return this.http.put<DataType>(`${this.baseUrl}/data/${id}`, data).pipe(
      tap(updatedData => this.updateCache(updatedData)),
      catchError(this.handleError)
    );
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/data/${id}`).pipe(
      tap(() => this.removeFromCache(id)),
      catchError(this.handleError)
    );
  }
  
  // 6. Private Methods (Internal Logic)
  private updateCache(data: DataType): void {
    const currentData = this.dataSubject.value;
    const index = currentData.findIndex(item => item.id === data.id);
    
    if (index >= 0) {
      currentData[index] = data;
    } else {
      currentData.push(data);
    }
    
    this.dataSubject.next([...currentData]);
  }
  
  private removeFromCache(id: string): void {
    const currentData = this.dataSubject.value;
    const filtered = currentData.filter(item => item.id !== id);
    this.dataSubject.next(filtered);
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

## HTTP Patterns

### HTTP Interceptors

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  
  return next(req);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Handle unauthorized
      }
      if (error.status === 403) {
        // Handle forbidden
      }
      if (error.status >= 500) {
        // Handle server errors
      }
      return throwError(() => error);
    })
  );
};
```

### Request Options

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  
  // With headers
  getWithHeaders(): Observable<Data> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Custom-Header': 'value'
    });
    
    return this.http.get<Data>('/api/data', { headers });
  }
  
  // With query parameters
  getWithParams(filters: FilterParams): Observable<Data[]> {
    const params = new HttpParams()
      .set('page', filters.page.toString())
      .set('limit', filters.limit.toString())
      .set('sort', filters.sort);
    
    return this.http.get<Data[]>('/api/data', { params });
  }
  
  // With response type
  downloadFile(): Observable<Blob> {
    return this.http.get('/api/download', { 
      responseType: 'blob' 
    });
  }
  
  // With observe option
  getWithFullResponse(): Observable<HttpResponse<Data>> {
    return this.http.get<Data>('/api/data', { 
      observe: 'response' 
    });
  }
}
```

## State Management Patterns

### BehaviorSubject Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class CartStateService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  
  // Public observables
  cartItems$ = this.cartItemsSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  
  total$ = this.totalSubject.asObservable();
  
  // Computed observables
  itemCount$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, item) => sum + item.quantity, 0))
  );
  
  isEmpty$ = this.cartItems$.pipe(
    map(items => items.length === 0)
  );
  
  // Actions
  addItem(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.cartItemsSubject.next([...currentItems]);
    } else {
      this.cartItemsSubject.next([...currentItems, item]);
    }
    
    this.calculateTotal();
  }
  
  removeItem(itemId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const filtered = currentItems.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(filtered);
    this.calculateTotal();
  }
  
  updateQuantity(itemId: string, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(i => i.id === itemId);
    
    if (item) {
      item.quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
      this.calculateTotal();
    }
  }
  
  clear(): void {
    this.cartItemsSubject.next([]);
    this.totalSubject.next(0);
  }
  
  private calculateTotal(): void {
    const items = this.cartItemsSubject.value;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.totalSubject.next(total);
  }
}
```

### Caching Strategy

```typescript
@Injectable({ providedIn: 'root' })
export class CachedDataService {
  private http = inject(HttpClient);
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheTime = 5 * 60 * 1000; // 5 minutes
  
  getData(id: string, forceRefresh = false): Observable<Data> {
    const cacheKey = `data_${id}`;
    const cached = this.cache.get(cacheKey);
    
    if (!forceRefresh && cached && this.isCacheValid(cached.timestamp)) {
      return of(cached.data);
    }
    
    return this.http.get<Data>(`/api/data/${id}`).pipe(
      tap(data => {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      })
    );
  }
  
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTime;
  }
  
  clearCache(): void {
    this.cache.clear();
  }
  
  invalidateCache(id: string): void {
    this.cache.delete(`data_${id}`);
  }
}
```

## Error Handling

### Comprehensive Error Handling

```typescript
@Injectable({ providedIn: 'root' })
export class ErrorHandlingService {
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    let errorType: ErrorType;
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
      errorType = ErrorType.Network;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          errorType = ErrorType.Validation;
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in.';
          errorType = ErrorType.Authentication;
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission.';
          errorType = ErrorType.Authorization;
          break;
        case 404:
          errorMessage = 'Resource not found.';
          errorType = ErrorType.NotFound;
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          errorType = ErrorType.Server;
          break;
        default:
          errorMessage = `Error: ${error.status} - ${error.message}`;
          errorType = ErrorType.Unknown;
      }
    }
    
    console.error('Service Error:', {
      type: errorType,
      message: errorMessage,
      error
    });
    
    return throwError(() => ({
      type: errorType,
      message: errorMessage,
      originalError: error
    }));
  }
}

enum ErrorType {
  Network = 'NETWORK',
  Validation = 'VALIDATION',
  Authentication = 'AUTHENTICATION',
  Authorization = 'AUTHORIZATION',
  NotFound = 'NOT_FOUND',
  Server = 'SERVER',
  Unknown = 'UNKNOWN'
}
```

### Retry Logic

```typescript
@Injectable({ providedIn: 'root' })
export class ResilientApiService {
  private http = inject(HttpClient);
  
  getDataWithRetry(id: string): Observable<Data> {
    return this.http.get<Data>(`/api/data/${id}`).pipe(
      retry({
        count: 3,
        delay: (error, retryCount) => {
          // Exponential backoff: 1s, 2s, 4s
          const delayMs = Math.pow(2, retryCount - 1) * 1000;
          console.log(`Retry attempt ${retryCount} after ${delayMs}ms`);
          return timer(delayMs);
        }
      }),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('All retry attempts failed:', error);
    return throwError(() => new Error('Failed after multiple attempts'));
  }
}
```

## Testing Patterns

### Service Test Template

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';

describe('FeatureService', () => {
  let service: FeatureService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeatureService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    
    service = TestBed.inject(FeatureService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify(); // Verify no outstanding requests
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should fetch data', () => {
    const mockData = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ];
    
    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(data.length).toBe(2);
    });
    
    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
  
  it('should handle errors', () => {
    service.getData().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });
    
    const req = httpMock.expectOne('/api/data');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
  
  it('should update cache on create', () => {
    const newItem = { id: '3', name: 'Item 3' };
    
    service.create(newItem).subscribe();
    
    const req = httpMock.expectOne('/api/data');
    req.flush(newItem);
    
    service.data$.subscribe(data => {
      expect(data).toContain(newItem);
    });
  });
});
```

### Testing State Services

```typescript
describe('StateService', () => {
  let service: StateService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateService]
    });
    service = TestBed.inject(StateService);
  });
  
  it('should update state', (done) => {
    const testData = { id: '1', value: 'test' };
    
    service.data$.subscribe(data => {
      if (data) {
        expect(data).toEqual(testData);
        done();
      }
    });
    
    service.setData(testData);
  });
  
  it('should reset state', (done) => {
    service.setData({ id: '1', value: 'test' });
    service.reset();
    
    service.data$.subscribe(data => {
      expect(data).toBeNull();
      done();
    });
  });
});
```

## Best Practices Checklist

Before completing a service, verify:
- ✅ Uses `providedIn: 'root'` for singleton services
- ✅ Uses `inject()` function for dependency injection
- ✅ Proper error handling with `catchError`
- ✅ Uses `shareReplay` for shared observables
- ✅ Implements caching where appropriate
- ✅ Clear separation of concerns (data/state/facade/utility)
- ✅ Comprehensive unit tests
- ✅ Proper TypeScript typing (no `any`)
- ✅ Error messages are user-friendly
- ✅ Logging for debugging
- ✅ HTTP interceptors for cross-cutting concerns
- ✅ Retry logic for resilient API calls
