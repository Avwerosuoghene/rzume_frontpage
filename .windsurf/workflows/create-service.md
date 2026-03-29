---
description: Generate a complete Angular service with proper patterns and tests
---

# Create Service Workflow

## Overview
Generates a complete Angular service following project standards with:
- Proper dependency injection
- Type safety
- Error handling
- State management (if needed)
- Unit tests

## Workflow Steps

### Step 1: Gather Requirements
Ask the user for:
1. **Service name** (e.g., user, authentication, cart)
2. **Service type**:
   - Data Service (API integration)
   - State Service (state management)
   - Facade Service (business logic)
   - Utility Service (helper functions)
3. **Functionality needed**:
   - API endpoints
   - State to manage
   - Methods required

### Step 2: Create Service File

Location: `src/app/core/services/[service-name].service.ts`

### Step 3: Generate Service Based on Type

#### Data Service (API Integration)
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class [ServiceName]Service {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/[endpoint]`;

  getAll(): Observable<DataType[]> {
    return this.http.get<DataType[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<DataType> {
    return this.http.get<DataType>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(data: CreateDataDto): Observable<DataType> {
    return this.http.post<DataType>(this.baseUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, data: UpdateDataDto): Observable<DataType> {
    return this.http.put<DataType>(`${this.baseUrl}/${id}`, data).pipe(
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
    
    console.error('[ServiceName]Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

#### State Service (State Management)
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface [ServiceName]State {
  data: DataType[];
  selectedItem: DataType | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: [ServiceName]State = {
  data: [],
  selectedItem: null,
  isLoading: false,
  error: null
};

@Injectable({ providedIn: 'root' })
export class [ServiceName]StateService {
  private stateSubject = new BehaviorSubject<[ServiceName]State>(initialState);
  
  // Public observables
  state$ = this.stateSubject.asObservable().pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
  
  data$ = this.state$.pipe(map(state => state.data));
  selectedItem$ = this.state$.pipe(map(state => state.selectedItem));
  isLoading$ = this.state$.pipe(map(state => state.isLoading));
  error$ = this.state$.pipe(map(state => state.error));
  
  // State getters
  get currentState(): [ServiceName]State {
    return this.stateSubject.value;
  }
  
  get data(): DataType[] {
    return this.currentState.data;
  }
  
  // State setters
  setData(data: DataType[]): void {
    this.updateState({ data, error: null });
  }
  
  setSelectedItem(item: DataType | null): void {
    this.updateState({ selectedItem: item });
  }
  
  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }
  
  setError(error: string | null): void {
    this.updateState({ error, isLoading: false });
  }
  
  addItem(item: DataType): void {
    const data = [...this.currentState.data, item];
    this.updateState({ data });
  }
  
  updateItem(id: string, updates: Partial<DataType>): void {
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
  
  private updateState(partial: Partial<[ServiceName]State>): void {
    this.stateSubject.next({
      ...this.currentState,
      ...partial
    });
  }
}
```

#### Facade Service (Business Logic)
```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { [ServiceName]DataService } from './[service-name]-data.service';
import { [ServiceName]StateService } from './[service-name]-state.service';

@Injectable({ providedIn: 'root' })
export class [ServiceName]FacadeService {
  private dataService = inject([ServiceName]DataService);
  private stateService = inject([ServiceName]StateService);
  
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
  
  createItem(data: CreateDataDto): Observable<DataType> {
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
  
  updateItem(id: string, updates: UpdateDataDto): Observable<DataType> {
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

#### Utility Service (Helper Functions)
```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class [ServiceName]UtilityService {
  
  formatData(data: any): string {
    // Implementation
    return '';
  }
  
  validateData(data: any): boolean {
    // Implementation
    return true;
  }
  
  transformData(data: any): any {
    // Implementation
    return data;
  }
}
```

### Step 4: Generate Service Spec File

Location: `src/app/core/services/[service-name].service.spec.ts`

#### For Data Service
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { [ServiceName]Service } from './[service-name].service';

describe('[ServiceName]Service', () => {
  let service: [ServiceName]Service;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        [ServiceName]Service,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject([ServiceName]Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all data', () => {
    const mockData = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ];

    service.getAll().subscribe(data => {
      expect(data).toEqual(mockData);
      expect(data.length).toBe(2);
    });

    const req = httpMock.expectOne('/api/endpoint');
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

    const req = httpMock.expectOne('/api/endpoint');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });
});
```

#### For State Service
```typescript
import { TestBed } from '@angular/core/testing';
import { [ServiceName]StateService } from './[service-name]-state.service';

describe('[ServiceName]StateService', () => {
  let service: [ServiceName]StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [[ServiceName]StateService]
    });
    service = TestBed.inject([ServiceName]StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty data', (done) => {
    service.data$.subscribe(data => {
      expect(data).toEqual([]);
      done();
    });
  });

  it('should update data', (done) => {
    const testData = [{ id: '1', name: 'Test' }];

    service.data$.subscribe(data => {
      if (data.length > 0) {
        expect(data).toEqual(testData);
        done();
      }
    });

    service.setData(testData);
  });

  it('should reset state', (done) => {
    service.setData([{ id: '1', name: 'Test' }]);
    service.reset();

    service.data$.subscribe(data => {
      expect(data).toEqual([]);
      done();
    });
  });
});
```

### Step 5: Update Barrel Exports

Add to `src/app/core/services/index.ts`:
```typescript
export * from './[service-name].service';
```

### Step 6: Create Environment Configuration (if needed)

If service needs API URL, ensure `environment.ts` has:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Step 7: Verify and Test

1. **Compile check**: Ensure no TypeScript errors
2. **Run tests**: `ng test`
3. **Integration test**: Use service in a component
4. **Error handling**: Test error scenarios

## Checklist

Before completing, verify:
- ✅ Uses `providedIn: 'root'`
- ✅ Uses `inject()` for dependency injection
- ✅ Proper error handling with `catchError`
- ✅ Uses `shareReplay` for shared observables
- ✅ Comprehensive unit tests
- ✅ Proper TypeScript typing (no `any`)
- ✅ Error messages are descriptive
- ✅ Service is exported in barrel file
- ✅ No console errors
- ✅ Follows single responsibility principle
