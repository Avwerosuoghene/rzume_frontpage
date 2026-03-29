---
description: Testing patterns and standards for Angular applications
trigger: glob
glob: "*.spec.ts"
---

# Testing Standards

## Testing Philosophy

### Test Pyramid
- **Unit Tests (70%)**: Test individual components, services, pipes, directives
- **Integration Tests (20%)**: Test component interactions and service integrations
- **E2E Tests (10%)**: Test complete user workflows

### Test Coverage Goals
- **Minimum**: 80% code coverage
- **Critical Paths**: 100% coverage for authentication, payments, data mutations
- **New Code**: All new features must include tests

## Unit Testing Patterns

### Component Testing

#### Basic Component Test
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureComponent } from './feature.component';

describe('FeatureComponent', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

#### Testing Component with Dependencies
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
    // Create mock service
    mockService = jasmine.createSpyObj('FeatureService', [
      'getData',
      'updateData',
      'deleteData'
    ]);

    await TestBed.configureTestingModule({
      imports: [FeatureComponent],
      providers: [
        { provide: FeatureService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
  });

  it('should load data on init', () => {
    const mockData = [{ id: '1', name: 'Test' }];
    mockService.getData.and.returnValue(of(mockData));

    fixture.detectChanges(); // Triggers ngOnInit

    expect(mockService.getData).toHaveBeenCalled();
    expect(component.data).toEqual(mockData);
  });

  it('should handle errors', () => {
    mockService.getData.and.returnValue(
      throwError(() => new Error('Test error'))
    );

    fixture.detectChanges();

    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });
});
```

#### Testing Inputs and Outputs
```typescript
describe('FeatureComponent - Inputs/Outputs', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
  });

  it('should accept input data', () => {
    const testData = { id: '1', name: 'Test' };
    component.data = testData;
    fixture.detectChanges();

    expect(component.data).toEqual(testData);
  });

  it('should emit output event', () => {
    let emittedValue: any;
    component.itemSelected.subscribe((value: any) => {
      emittedValue = value;
    });

    const testItem = { id: '1', name: 'Test' };
    component.selectItem(testItem);

    expect(emittedValue).toEqual(testItem);
  });

  it('should emit event on button click', () => {
    spyOn(component.actionPerformed, 'emit');
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.actionPerformed.emit).toHaveBeenCalled();
  });
});
```

#### Testing DOM Interactions
```typescript
describe('FeatureComponent - DOM', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should render title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();

    const titleElement = compiled.querySelector('h1');
    expect(titleElement?.textContent).toContain('Test Title');
  });

  it('should display items in list', () => {
    component.items = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ];
    fixture.detectChanges();

    const listItems = compiled.querySelectorAll('.item');
    expect(listItems.length).toBe(2);
  });

  it('should toggle visibility on click', () => {
    const button = compiled.querySelector('button') as HTMLButtonElement;
    expect(component.isVisible).toBeFalse();

    button.click();
    fixture.detectChanges();

    expect(component.isVisible).toBeTrue();
  });

  it('should apply CSS class conditionally', () => {
    component.isActive = true;
    fixture.detectChanges();

    const element = compiled.querySelector('.container');
    expect(element?.classList.contains('active')).toBeTrue();
  });
});
```

#### Testing Async Operations
```typescript
describe('FeatureComponent - Async', () => {
  let component: FeatureComponent;
  let fixture: ComponentFixture<FeatureComponent>;
  let mockService: jasmine.SpyObj<FeatureService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('FeatureService', ['getData']);

    await TestBed.configureTestingModule({
      imports: [FeatureComponent],
      providers: [
        { provide: FeatureService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureComponent);
    component = fixture.componentInstance;
  });

  it('should handle async data loading', (done) => {
    const mockData = { id: '1', name: 'Test' };
    mockService.getData.and.returnValue(of(mockData));

    component.loadData();

    setTimeout(() => {
      expect(component.data).toEqual(mockData);
      expect(component.isLoading).toBeFalse();
      done();
    }, 100);
  });

  it('should handle async with fakeAsync', fakeAsync(() => {
    const mockData = { id: '1', name: 'Test' };
    mockService.getData.and.returnValue(of(mockData).pipe(delay(1000)));

    component.loadData();
    expect(component.isLoading).toBeTrue();

    tick(1000); // Advance time by 1000ms

    expect(component.data).toEqual(mockData);
    expect(component.isLoading).toBeFalse();
  }));
});
```

### Service Testing

#### HTTP Service Testing
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const mockUsers = [
      { id: '1', name: 'User 1' },
      { id: '2', name: 'User 2' }
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
      expect(users.length).toBe(2);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fetch user by id', () => {
    const mockUser = { id: '1', name: 'User 1' };

    service.getUserById('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create user', () => {
    const newUser = { name: 'New User', email: 'new@example.com' };
    const createdUser = { id: '3', ...newUser };

    service.createUser(newUser).subscribe(user => {
      expect(user).toEqual(createdUser);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(createdUser);
  });

  it('should handle HTTP errors', () => {
    service.getUsers().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
      }
    });

    const req = httpMock.expectOne('/api/users');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should include headers', () => {
    service.getUsersWithAuth().subscribe();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    req.flush([]);
  });
});
```

#### State Service Testing
```typescript
import { TestBed } from '@angular/core/testing';
import { UserStateService } from './user-state.service';

describe('UserStateService', () => {
  let service: UserStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStateService]
    });
    service = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with null user', (done) => {
    service.user$.subscribe(user => {
      expect(user).toBeNull();
      done();
    });
  });

  it('should update user state', (done) => {
    const testUser = { id: '1', name: 'Test User' };

    service.user$.subscribe(user => {
      if (user) {
        expect(user).toEqual(testUser);
        done();
      }
    });

    service.setUser(testUser);
  });

  it('should compute isAuthenticated correctly', (done) => {
    service.isAuthenticated$.subscribe(isAuth => {
      expect(isAuth).toBeFalse();
    });

    service.setUser({ id: '1', name: 'Test' });

    service.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        expect(isAuth).toBeTrue();
        done();
      }
    });
  });

  it('should reset state', (done) => {
    service.setUser({ id: '1', name: 'Test' });
    service.reset();

    service.user$.subscribe(user => {
      expect(user).toBeNull();
      done();
    });
  });
});
```

### Pipe Testing

```typescript
import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    const result = pipe.transform(date, 'MM/DD/YYYY');
    expect(result).toBe('01/15/2024');
  });

  it('should handle null input', () => {
    const result = pipe.transform(null);
    expect(result).toBe('');
  });

  it('should use default format', () => {
    const date = new Date('2024-01-15');
    const result = pipe.transform(date);
    expect(result).toBeTruthy();
  });
});
```

### Directive Testing

```typescript
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

@Component({
  template: `<div appHighlight [highlightColor]="color">Test</div>`,
  standalone: true,
  imports: [HighlightDirective]
})
class TestComponent {
  color = 'yellow';
}

describe('HighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent, HighlightDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    divElement = fixture.debugElement.query(By.css('div'));
  });

  it('should create', () => {
    expect(divElement).toBeTruthy();
  });

  it('should highlight with specified color', () => {
    fixture.detectChanges();
    const bgColor = divElement.nativeElement.style.backgroundColor;
    expect(bgColor).toBe('yellow');
  });

  it('should update color on input change', () => {
    component.color = 'blue';
    fixture.detectChanges();
    
    const bgColor = divElement.nativeElement.style.backgroundColor;
    expect(bgColor).toBe('blue');
  });
});
```

## Test Organization

### Test Structure
```typescript
describe('ComponentName', () => {
  // Setup
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  
  beforeEach(async () => {
    // Test configuration
  });
  
  // Group related tests
  describe('Initialization', () => {
    it('should create', () => {});
    it('should initialize with default values', () => {});
  });
  
  describe('Data Loading', () => {
    it('should load data on init', () => {});
    it('should handle loading errors', () => {});
  });
  
  describe('User Interactions', () => {
    it('should handle button click', () => {});
    it('should emit event on action', () => {});
  });
  
  describe('Edge Cases', () => {
    it('should handle null input', () => {});
    it('should handle empty array', () => {});
  });
});
```

### Test Naming Conventions
```typescript
// Good - Descriptive test names
it('should display error message when API fails', () => {});
it('should disable submit button when form is invalid', () => {});
it('should emit selected item when user clicks on list item', () => {});

// Bad - Vague test names
it('should work', () => {});
it('test function', () => {});
it('handles error', () => {});
```

## Mocking Strategies

### Mock Services
```typescript
// Create spy object
const mockService = jasmine.createSpyObj('ServiceName', [
  'method1',
  'method2'
]);

// Configure return values
mockService.method1.and.returnValue(of(mockData));
mockService.method2.and.returnValue(throwError(() => new Error('Test error')));

// Provide in TestBed
TestBed.configureTestingModule({
  providers: [
    { provide: ServiceName, useValue: mockService }
  ]
});
```

### Mock HTTP Responses
```typescript
it('should handle different response types', () => {
  // Success response
  service.getData().subscribe(data => {
    expect(data).toEqual(mockData);
  });
  const req = httpMock.expectOne('/api/data');
  req.flush(mockData);
  
  // Error response
  service.getData().subscribe({
    error: (error) => expect(error).toBeTruthy()
  });
  const req2 = httpMock.expectOne('/api/data');
  req2.flush('Error', { status: 404, statusText: 'Not Found' });
});
```

### Mock Observables
```typescript
// Simple observable
const mockData$ = of({ id: '1', name: 'Test' });

// Observable with delay
const mockData$ = of({ id: '1', name: 'Test' }).pipe(delay(1000));

// Observable that errors
const mockError$ = throwError(() => new Error('Test error'));

// BehaviorSubject for state
const mockState$ = new BehaviorSubject({ value: 'initial' });
```

## Code Coverage

### Running Coverage
```bash
# Run tests with coverage
ng test --code-coverage

# Run tests with coverage and watch
ng test --code-coverage --watch

# Generate coverage report
ng test --code-coverage --browsers=ChromeHeadless --watch=false
```

### Coverage Thresholds
Configure in `karma.conf.js`:
```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' },
    { type: 'lcovonly' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

## Best Practices

### AAA Pattern (Arrange-Act-Assert)
```typescript
it('should calculate total correctly', () => {
  // Arrange - Set up test data
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];
  
  // Act - Execute the function
  const total = component.calculateTotal(items);
  
  // Assert - Verify the result
  expect(total).toBe(35);
});
```

### Test Isolation
```typescript
// Good - Each test is independent
it('should add item to cart', () => {
  component.cart = [];
  component.addItem({ id: '1', name: 'Item' });
  expect(component.cart.length).toBe(1);
});

it('should remove item from cart', () => {
  component.cart = [{ id: '1', name: 'Item' }];
  component.removeItem('1');
  expect(component.cart.length).toBe(0);
});

// Bad - Tests depend on each other
let sharedCart: any[] = [];
it('should add item', () => {
  component.cart = sharedCart;
  component.addItem({ id: '1', name: 'Item' });
  sharedCart = component.cart;
});
```

### Test One Thing
```typescript
// Good - Tests one specific behavior
it('should validate email format', () => {
  component.email = 'invalid-email';
  expect(component.isEmailValid()).toBeFalse();
});

it('should accept valid email', () => {
  component.email = 'test@example.com';
  expect(component.isEmailValid()).toBeTrue();
});

// Bad - Tests multiple things
it('should validate form', () => {
  component.email = 'invalid';
  expect(component.isEmailValid()).toBeFalse();
  component.password = '123';
  expect(component.isPasswordValid()).toBeFalse();
  component.submit();
  expect(component.submitted).toBeTrue();
});
```

### Avoid Testing Implementation Details
```typescript
// Good - Test behavior
it('should display user name', () => {
  component.user = { name: 'John Doe' };
  fixture.detectChanges();
  
  const nameElement = fixture.nativeElement.querySelector('.user-name');
  expect(nameElement.textContent).toContain('John Doe');
});

// Bad - Test implementation
it('should call getUserName method', () => {
  spyOn(component, 'getUserName');
  component.displayUser();
  expect(component.getUserName).toHaveBeenCalled();
});
```

## Testing Checklist

Before completing tests, verify:
- ✅ All public methods are tested
- ✅ All inputs and outputs are tested
- ✅ Error cases are tested
- ✅ Edge cases are covered (null, undefined, empty arrays)
- ✅ Async operations are properly tested
- ✅ DOM interactions are tested
- ✅ Tests are independent and isolated
- ✅ Tests follow AAA pattern
- ✅ Test names are descriptive
- ✅ Code coverage meets threshold (80%+)
- ✅ No console errors or warnings
- ✅ Tests run successfully in CI/CD pipeline
