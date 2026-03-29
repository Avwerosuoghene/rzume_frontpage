# Models Directory Agent

## Context
You are working in the `src/app/core/models/` directory, which contains **data models, interfaces, enums, constants, and mock data** for the application.

## Directory Structure

```
models/
├── interfaces/        # TypeScript interfaces
├── enums/            # Enumerations
├── constants/        # Constant values
├── mocks/            # Mock data for development/testing
├── types/            # Type aliases
└── index.ts          # Barrel export
```

## Organization Principles

### Interfaces
Define data structures and contracts
- API response/request types
- Component input/output types
- Service method signatures
- Domain models

### Enums
Define sets of named constants
- Status values
- User roles
- Action types
- Configuration options

### Constants
Define static configuration values
- API endpoints
- UI configuration
- Feature flags
- Default values

### Mocks
Provide test and development data
- Sample data for components
- Test fixtures
- Development seeds

## File Naming Conventions

### Interfaces
```
interfaces/
├── feature-name.interface.ts
├── user.interface.ts
├── product.interface.ts
└── index.ts
```

### Enums
```
enums/
├── feature-name.enums.ts
├── user-role.enums.ts
├── status.enums.ts
└── index.ts
```

### Constants
```
constants/
├── feature-name.constants.ts
├── api.constants.ts
├── ui.constants.ts
└── index.ts
```

### Mocks
```
mocks/
├── mock-feature-name.ts
├── mock-users.ts
├── mock-products.ts
└── index.ts
```

## Interface Patterns

### Basic Interface
```typescript
// user.interface.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
```

### DTO Interfaces
```typescript
// user.interface.ts
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface UserResponse {
  user: User;
  token: string;
}
```

### Component Interfaces
```typescript
// card.interface.ts
export interface CardConfig {
  title: string;
  description: string;
  imageUrl?: string;
  actions?: CardAction[];
}

export interface CardAction {
  label: string;
  icon?: string;
  handler: () => void;
}
```

### API Interfaces
```typescript
// api.interface.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

## Enum Patterns

### String Enums (Preferred)
```typescript
// user-role.enums.ts
export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST'
}

// status.enums.ts
export enum Status {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}
```

### Numeric Enums
```typescript
// priority.enums.ts
export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}
```

## Constants Patterns

### API Constants
```typescript
// api.constants.ts
export const API_CONFIG = {
  baseUrl: '/api',
  timeout: 30000,
  retryAttempts: 3
} as const;

export const API_ENDPOINTS = {
  users: '/users',
  products: '/products',
  orders: '/orders'
} as const;
```

### UI Constants
```typescript
// ui.constants.ts
export const UI_CONFIG = {
  itemsPerPage: 10,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  debounceTime: 300
} as const;

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024
} as const;
```

### Feature Constants
```typescript
// blog.constants.ts
export const BLOG_CONFIG = {
  postsPerPage: 6,
  excerptLength: 150,
  categories: ['Technology', 'Design', 'Business']
} as const;

export const BLOG_ROUTES = {
  list: '/blog',
  detail: '/blog/:id',
  category: '/blog/category/:category'
} as const;
```

## Mock Data Patterns

### Simple Mocks
```typescript
// mock-users.ts
import { User, UserRole } from '../interfaces';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.Admin,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: UserRole.User,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  }
];

export const MOCK_USER = MOCK_USERS[0];
```

### Factory Functions
```typescript
// mock-products.ts
import { Product } from '../interfaces';

export function createMockProduct(overrides?: Partial<Product>): Product {
  return {
    id: '1',
    name: 'Sample Product',
    description: 'Sample description',
    price: 99.99,
    inStock: true,
    ...overrides
  };
}

export const MOCK_PRODUCTS: Product[] = [
  createMockProduct({ id: '1', name: 'Product 1' }),
  createMockProduct({ id: '2', name: 'Product 2', price: 149.99 }),
  createMockProduct({ id: '3', name: 'Product 3', inStock: false })
];
```

## Barrel Exports

### Main Index
```typescript
// index.ts
// Interfaces
export * from './interfaces';

// Enums
export * from './enums';

// Constants
export * from './constants';

// Mocks
export * from './mocks';

// Types
export * from './types';
```

### Sub-directory Index
```typescript
// interfaces/index.ts
export * from './user.interface';
export * from './product.interface';
export * from './order.interface';

// constants/index.ts
export * from './api.constants';
export * from './ui.constants';
export * from './blog.constants';
```

## Usage Examples

### In Components
```typescript
import { User, UserRole, MOCK_USERS } from '../../core/models';

export class UserListComponent {
  users: User[] = MOCK_USERS;
  adminRole = UserRole.Admin;
}
```

### In Services
```typescript
import { User, CreateUserDto, API_ENDPOINTS } from '../../core/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_ENDPOINTS.users);
  }
  
  createUser(dto: CreateUserDto): Observable<User> {
    return this.http.post<User>(API_ENDPOINTS.users, dto);
  }
}
```

### In Tests
```typescript
import { MOCK_USERS, createMockProduct } from '../../core/models';

describe('UserComponent', () => {
  it('should display users', () => {
    component.users = MOCK_USERS;
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelectorAll('.user').length).toBe(2);
  });
});
```

## Best Practices

### Do's
- ✅ Use descriptive interface names
- ✅ Create DTOs for API operations
- ✅ Use string enums for better debugging
- ✅ Use `as const` for constants
- ✅ Provide mock data for development
- ✅ Use barrel exports for clean imports
- ✅ Document complex interfaces
- ✅ Keep interfaces focused and single-purpose

### Don'ts
- ❌ Don't use `any` type
- ❌ Don't create overly complex interfaces
- ❌ Don't mix concerns in single file
- ❌ Don't forget to export from index
- ❌ Don't use classes for data models (prefer interfaces)
- ❌ Don't hardcode values (use constants)

## Existing Models

### Interfaces
- `AboutFeatureCard`: About page feature cards
- `CoreFeaturesSection`: Core features section data
- `TestimonialsSection`: Testimonials section data
- `Navigation`: Navigation menu items

### Constants
- `auth.constants.ts`: Authentication configuration
- `blog.constants.ts`: Blog configuration
- `carousel.constants.ts`: Carousel settings
- `navigation.constants.ts`: Navigation items
- `ui.constants.ts`: UI configuration

### Mocks
- `blog.mock.ts`: Blog data
- `mock-blog-posts.ts`: Blog post samples
- `mock-testimonials.ts`: Testimonial samples

## Type Safety Tips

### Optional vs Required
```typescript
// Required properties
interface User {
  id: string;
  name: string;
  email: string;
}

// Optional properties
interface UserProfile {
  bio?: string;
  avatar?: string;
  website?: string;
}

// Partial type
type PartialUser = Partial<User>; // All properties optional
```

### Readonly Properties
```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

// Or use Readonly utility type
type ReadonlyConfig = Readonly<Config>;
```

### Union Types
```typescript
type Status = 'pending' | 'approved' | 'rejected';
type Size = 'small' | 'medium' | 'large';

interface Item {
  status: Status;
  size: Size;
}
```

## Related Documentation
- See `.windsurf/rules/code-quality.md` for type safety standards
- See `src/app/core/services/AGENTS.md` for service integration
- See TypeScript documentation for advanced types
