# Services Directory Agent

## Context
You are working in the `src/app/core/services/` directory, which contains **singleton services** that provide data, state management, and business logic.

## Service Philosophy

### Service Types

#### 1. Data Services (API Integration)
- Handle HTTP communication
- Transform API responses
- Manage API errors
- Example: `UserDataService`, `ProductDataService`

#### 2. State Services (State Management)
- Manage application state
- Provide observable streams
- Use BehaviorSubject pattern
- Example: `UserStateService`, `CartStateService`

#### 3. Facade Services (Business Logic)
- Coordinate multiple services
- Provide simplified API
- Handle complex workflows
- Example: `UserFacadeService`, `CheckoutFacadeService`

#### 4. Utility Services (Helper Functions)
- Pure utility functions
- Cross-cutting concerns
- No state management
- Example: `DateUtilityService`, `ValidationService`

## Service Structure

### Data Service Template
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeatureDataService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/feature`;

  getAll(): Observable<Feature[]> {
    return this.http.get<Feature[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Feature> {
    return this.http.get<Feature>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(data: CreateFeatureDto): Observable<Feature> {
    return this.http.post<Feature>(this.baseUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, data: UpdateFeatureDto): Observable<Feature> {
    return this.http.put<Feature>(`${this.baseUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
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
    
    console.error('FeatureDataService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

### State Service Template
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface FeatureState {
  data: Feature[];
  selectedItem: Feature | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeatureState = {
  data: [],
  selectedItem: null,
  isLoading: false,
  error: null
};

@Injectable({ providedIn: 'root' })
export class FeatureStateService {
  private stateSubject = new BehaviorSubject<FeatureState>(initialState);
  
  // Public observables
  state$ = this.stateSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  
  data$ = this.state$.pipe(map(state => state.data));
  selectedItem$ = this.state$.pipe(map(state => state.selectedItem));
  isLoading$ = this.state$.pipe(map(state => state.isLoading));
  error$ = this.state$.pipe(map(state => state.error));
  
  // State getters
  get currentState(): FeatureState {
    return this.stateSubject.value;
  }
  
  // State setters
  setData(data: Feature[]): void {
    this.updateState({ data, error: null });
  }
  
  setSelectedItem(item: Feature | null): void {
    this.updateState({ selectedItem: item });
  }
  
  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }
  
  setError(error: string | null): void {
    this.updateState({ error, isLoading: false });
  }
  
  addItem(item: Feature): void {
    const data = [...this.currentState.data, item];
    this.updateState({ data });
  }
  
  updateItem(id: string, updates: Partial<Feature>): void {
    const data = this.currentState.data.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    this.updateState({ data });
  }
  
  removeItem(id: string): void {
    const data = this.currentState.data.filter(item => item.id !== id);
    this.updateState({ data });
  }
  
  reset(): void {
    this.stateSubject.next(initialState);
  }
  
  private updateState(partial: Partial<FeatureState>): void {
    this.stateSubject.next({
      ...this.currentState,
      ...partial
    });
  }
}
```

### Facade Service Template
```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FeatureDataService } from './feature-data.service';
import { FeatureStateService } from './feature-state.service';

@Injectable({ providedIn: 'root' })
export class FeatureFacadeService {
  private dataService = inject(FeatureDataService);
  private stateService = inject(FeatureStateService);
  
  // Expose state
  data$ = this.stateService.data$;
  selectedItem$ = this.stateService.selectedItem$;
  isLoading$ = this.stateService.isLoading$;
  error$ = this.stateService.error$;
  
  loadData(): void {
    this.stateService.setLoading(true);
    
    this.dataService.getAll().subscribe({
      next: (data) => {
        this.stateService.setData(data);
        this.stateService.setLoading(false);
      },
      error: (error) => {
        this.stateService.setError('Failed to load data');
        console.error('Load error:', error);
      }
    });
  }
  
  selectItem(id: string): void {
    this.stateService.setLoading(true);
    
    this.dataService.getById(id).subscribe({
      next: (item) => {
        this.stateService.setSelectedItem(item);
        this.stateService.setLoading(false);
      },
      error: (error) => {
        this.stateService.setError('Failed to load item');
        console.error('Select error:', error);
      }
    });
  }
  
  createItem(data: CreateFeatureDto): Observable<Feature> {
    this.stateService.setLoading(true);
    
    return this.dataService.create(data).pipe(
      tap((item) => {
        this.stateService.addItem(item);
        this.stateService.setLoading(false);
      }),
      catchError((error) => {
        this.stateService.setError('Failed to create item');
        throw error;
      })
    );
  }
  
  updateItem(id: string, updates: UpdateFeatureDto): Observable<Feature> {
    this.stateService.setLoading(true);
    
    return this.dataService.update(id, updates).pipe(
      tap((item) => {
        this.stateService.updateItem(id, item);
        this.stateService.setLoading(false);
      }),
      catchError((error) => {
        this.stateService.setError('Failed to update item');
        throw error;
      })
    );
  }
  
  deleteItem(id: string): Observable<void> {
    this.stateService.setLoading(true);
    
    return this.dataService.delete(id).pipe(
      tap(() => {
        this.stateService.removeItem(id);
        this.stateService.setLoading(false);
      }),
      catchError((error) => {
        this.stateService.setError('Failed to delete item');
        throw error;
      })
    );
  }
  
  reset(): void {
    this.stateService.reset();
  }
}
```

## Required Patterns

### Always Use
- ✅ `@Injectable({ providedIn: 'root' })`
- ✅ `inject()` function for dependencies
- ✅ Proper error handling with `catchError`
- ✅ `shareReplay` for shared observables
- ✅ Strong typing (no `any`)
- ✅ Descriptive error messages

### Error Handling
```typescript
private handleError(error: HttpErrorResponse): Observable<never> {
  let errorMessage: string;
  
  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = `Network error: ${error.error.message}`;
  } else {
    // Server-side error
    switch (error.status) {
      case 400:
        errorMessage = 'Bad request. Please check your input.';
        break;
      case 401:
        errorMessage = 'Unauthorized. Please log in.';
        break;
      case 404:
        errorMessage = 'Resource not found.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      default:
        errorMessage = `Error: ${error.status} - ${error.message}`;
    }
  }
  
  console.error('Service Error:', errorMessage);
  return throwError(() => new Error(errorMessage));
}
```

## Testing

### Service Test Template
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FeatureDataService } from './feature-data.service';

describe('FeatureDataService', () => {
  let service: FeatureDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeatureDataService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(FeatureDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all data', () => {
    const mockData = [{ id: '1', name: 'Item 1' }];

    service.getAll().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/feature');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle errors', () => {
    service.getAll().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('/api/feature');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
```

## Best Practices

### Do's
- ✅ Use `providedIn: 'root'` for singletons
- ✅ Use `inject()` for dependency injection
- ✅ Implement comprehensive error handling
- ✅ Use BehaviorSubject for state
- ✅ Apply `shareReplay` to shared observables
- ✅ Write thorough unit tests
- ✅ Log errors for debugging
- ✅ Provide user-friendly error messages

### Don'ts
- ❌ Don't use constructor injection (use `inject()`)
- ❌ Don't ignore errors
- ❌ Don't use `any` type
- ❌ Don't forget to test
- ❌ Don't expose BehaviorSubject directly
- ❌ Don't make services stateful unless necessary

## Existing Services

### AnimationService
Located at `src/app/core/services/animation.service.ts`
- Handles scroll-based animations
- Staggered card animations
- Hero section animations
- CTA scroll animations
- Proper cleanup methods

## Related Documentation
- See `.windsurf/rules/service-patterns.md` for detailed patterns
- See `.windsurf/workflows/create-service.md` for creation workflow
- See `src/app/core/models/AGENTS.md` for data model patterns
