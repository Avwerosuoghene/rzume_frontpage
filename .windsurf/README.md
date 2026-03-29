# Windsurf Configuration for Rzume Frontpage

## Overview

This directory contains the Windsurf AI configuration for the Rzume Frontpage Angular project. The configuration provides context-aware rules, reusable workflows, and comprehensive documentation to ensure consistent, high-quality code generation.

## Project Information

- **Framework**: Angular 20.3.0
- **Architecture**: Standalone Components
- **UI Library**: Angular Material 20.2.10
- **Styling**: SCSS with custom theme system
- **Testing**: Jasmine/Karma
- **TypeScript**: 5.9.2 (Strict mode)

## Directory Structure

```
.windsurf/
├── rules/                      # Context-aware rules
│   ├── angular-core-standards.md    # Core Angular patterns (always_on)
│   ├── project-context.md           # Project-specific context (always_on)
│   ├── code-quality.md              # Code quality standards (model_decision)
│   ├── component-patterns.md        # Component development (*.component.*)
│   ├── service-patterns.md          # Service development (*.service.ts)
│   ├── testing-standards.md         # Testing patterns (*.spec.ts)
│   └── styling-standards.md         # SCSS standards (*.scss)
├── workflows/                  # Reusable workflows
│   ├── create-component.md          # Component generation
│   ├── create-service.md            # Service generation
│   └── add-feature.md               # Complete feature workflow
├── README.md                   # This file
├── USAGE-GUIDE.md              # Detailed usage instructions
└── HUSKY-SETUP.md              # Git hooks setup guide
```

## Rules System

### Always-On Rules
These rules are always active and provide core context:

- **`angular-core-standards.md`**: Angular 20 patterns, TypeScript standards, architecture patterns
- **`project-context.md`**: Project-specific information, tech stack, directory structure

### Context-Aware Rules
These rules activate based on file patterns:

- **`component-patterns.md`** (*.component.*): Component development patterns, templates, testing
- **`service-patterns.md`** (*.service.ts): Service architecture, state management, HTTP patterns
- **`testing-standards.md`** (*.spec.ts): Testing strategies, patterns, best practices
- **`styling-standards.md`** (*.scss): SCSS architecture, BEM naming, responsive design

### Model-Decision Rules
These rules are applied when the AI determines they're relevant:

- **`code-quality.md`**: SOLID principles, naming conventions, performance optimization

## Workflows

### Available Workflows

1. **`create-component`**: Generate complete Angular component
   - Standalone component structure
   - OnPush change detection
   - Modern control flow syntax
   - SCSS with theme variables
   - Unit tests

2. **`create-service`**: Generate Angular service
   - Data services (API integration)
   - State services (BehaviorSubject pattern)
   - Facade services (business logic)
   - Utility services (helper functions)

3. **`add-feature`**: Complete feature implementation
   - Feature planning
   - Component and service creation
   - Routing setup
   - Testing strategy
   - Documentation

### Using Workflows

Reference workflows in your prompts:
```
@create-component user-profile presentation
@create-service authentication data
@add-feature shopping-cart
```

## Key Standards

### Angular 20 Patterns
- ✅ Standalone components (no NgModules)
- ✅ `inject()` function for dependency injection
- ✅ Modern control flow (`@if`, `@for`, `@switch`)
- ✅ `ChangeDetectionStrategy.OnPush`
- ✅ Singular `styleUrl` (not `styleUrls`)

### TypeScript
- ✅ Strict mode enabled
- ✅ No `any` types
- ✅ Explicit return types for public APIs
- ✅ Optional chaining and nullish coalescing

### Architecture
- ✅ Lazy-loaded routes with `loadComponent()`
- ✅ Service-based state management (BehaviorSubject)
- ✅ Smart vs Presentation component pattern
- ✅ Barrel exports for clean imports

### Styling
- ✅ SCSS with theme variables
- ✅ BEM naming convention
- ✅ Mobile-first responsive design
- ✅ Reusable button classes

### Testing
- ✅ 80%+ code coverage
- ✅ Unit tests for all components/services
- ✅ Proper mocking strategies
- ✅ AAA pattern (Arrange-Act-Assert)

## Quick Reference

### Component Structure
```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentNameComponent implements OnInit, OnDestroy {
  private service = inject(ServiceType);
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void { }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Service Structure
```typescript
@Injectable({ providedIn: 'root' })
export class ServiceNameService {
  private http = inject(HttpClient);
  
  getData(): Observable<Data> {
    return this.http.get<Data>('/api/data').pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error);
    return throwError(() => new Error('Operation failed'));
  }
}
```

### Template Syntax
```html
@if (isLoading) {
  <div>Loading...</div>
} @else if (data) {
  @for (item of data; track item.id) {
    <div>{{ item.name }}</div>
  }
}
```

### SCSS Pattern
```scss
@use '../../../styles/theme' as *;

.component-name {
  background-color: $white;
  
  &__element {
    color: $black;
  }
  
  &--modifier {
    border: 1px solid $rzume-blue;
  }
}
```

## Theme Variables

### Colors
- `$rzume-blue`: Primary brand color
- `$black`, `$white`: Base colors
- `$gray`, `$light-gray`: Neutral colors
- `$basic-green`: Success color
- `$warning`: Error color
- `$amber`: Warning color

### Button Classes
- `.rzume-button-primary`: Blue background
- `.rzume-button-secondary`: White background
- `.rzume-button-outline`: Transparent with border
- `.rzume-button-outline-text`: Text only

## File Organization

```
src/app/
├── components/        # Presentation components
├── pages/            # Page/container components
├── core/
│   ├── services/     # Singleton services
│   ├── models/
│   │   ├── interfaces/
│   │   ├── enums/
│   │   ├── constants/
│   │   └── mocks/
│   ├── helpers/      # Utility functions
│   ├── pipes/        # Custom pipes
│   └── directives/   # Custom directives
└── styles/           # Global styles
    ├── theme.scss
    ├── fonts.scss
    └── general_styles.scss
```

## Common Tasks

### Create a New Component
```
I need a new component called "user-card" in the components directory.
It should display user information with name, email, and avatar.
```

### Create a New Service
```
Create a UserService that handles user authentication and profile management.
It should have login, logout, and getUserProfile methods.
```

### Add a New Feature
```
Add a "notifications" feature with:
- List of notifications
- Mark as read functionality
- Real-time updates
```

## Best Practices

1. **Always use theme variables** for colors
2. **Follow BEM naming** in SCSS
3. **Use OnPush change detection** for all components
4. **Implement proper cleanup** with `takeUntil` pattern
5. **Write tests** for all new code
6. **Use barrel exports** for cleaner imports
7. **Lazy load routes** with `loadComponent()`
8. **Follow mobile-first** responsive design

## Getting Help

- **Detailed Usage**: See `USAGE-GUIDE.md`
- **Git Hooks**: See `HUSKY-SETUP.md`
- **Rules**: Check individual rule files in `rules/`
- **Workflows**: Check workflow files in `workflows/`

## Maintenance

### Updating Rules
When project patterns change:
1. Update relevant rule files
2. Test with sample prompts
3. Update this README if needed

### Adding New Workflows
1. Create workflow file in `workflows/`
2. Follow existing workflow format
3. Add to this README
4. Test thoroughly

## Version History

- **v1.0.0** (2024-03-13): Initial configuration
  - Core rules for Angular 20
  - Component and service workflows
  - Complete feature workflow
  - Comprehensive documentation
