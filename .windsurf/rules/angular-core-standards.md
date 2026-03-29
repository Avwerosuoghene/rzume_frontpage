---
description: Angular core patterns and standards for Angular 20
trigger: always_on
---

# Angular Core Standards

## TypeScript Standards
- **Strict Mode**: Always maintain TypeScript strict mode enabled (already configured)
- **Type Safety**: Avoid `any` type; use `unknown` when type is uncertain
- **Type Inference**: Prefer type inference when obvious, explicit types for public APIs
- **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)
- **No Implicit Returns**: All functions must explicitly return values (enforced in tsconfig)

## Angular Architecture Patterns

### Standalone Components (Angular 20)
- **Always use standalone components** - this project uses standalone architecture
- Components are standalone by default in Angular 20
- Import dependencies directly in component metadata
- No NgModules required

### Change Detection Strategy
- **Always use `ChangeDetectionStrategy.OnPush`** for all components
- Trigger change detection manually with `ChangeDetectorRef` when needed
- Use immutable data patterns for optimal performance

### Component Structure
```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, /* dependencies */],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss', // Note: styleUrl (singular) in Angular 20
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### Dependency Injection
- **Use `inject()` function** instead of constructor injection (modern Angular pattern)
- Place `inject()` calls at the top of the class
- Use `providedIn: 'root'` for singleton services

### State Management
- Use **BehaviorSubject** pattern for service-based state
- Apply `shareReplay({ bufferSize: 1, refCount: true })` for performance
- Implement proper subscription cleanup with `takeUntil` pattern

### Template Syntax
- **Use modern control flow**: `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use `@for` with `track` for performance: `@for (item of items; track item.id)`
- Avoid complex logic in templates - move to component class

### Forms
- **Prefer Reactive Forms** over Template-driven forms
- Use `ControlValueAccessor` for custom form components
- Implement proper form validation with typed FormGroups

### Styling
- Use **class bindings** `[class.active]="isActive"` instead of `ngClass`
- Use **style bindings** `[style.width.px]="width"` instead of `ngStyle`
- Follow mobile-first responsive design
- Use SCSS with theme variables from `src/app/styles/theme.scss`

## Subscription Management

### Required Pattern
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.service.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {});
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## File Organization
- **Components**: One component per file, organized in `src/app/components` or `src/app/pages`
- **Services**: Group related functionality in `src/app/core/services`
- **Models**: Separate interfaces, enums, and constants in `src/app/core/models`
  - Interfaces: `src/app/core/models/interfaces/`
  - Enums: `src/app/core/models/enums/`
  - Constants: `src/app/core/models/constants/`
  - Mocks: `src/app/core/models/mocks/`
- **Helpers**: Pure utility functions in `src/app/core/helpers`
- **Pipes**: Custom pipes in `src/app/core/pipes`
- **Directives**: Custom directives in `src/app/core/directives`

## Naming Conventions
- **Components**: `component-name.component.ts`
- **Services**: `service-name.service.ts`
- **Interfaces**: `feature-name.interface.ts`
- **Models**: `feature-name.model.ts`
- **Constants**: `feature-name.constants.ts`
- **Enums**: `feature-name.enums.ts`
- **Mocks**: `mock-feature-name.ts`
- **Helpers**: `feature-name.helper.ts`

## Performance Requirements
- **Lazy load feature routes** - use `loadComponent()` pattern (already implemented)
- Use OnPush change detection
- Implement trackBy for loops
- Optimize bundle size (max 1MB initial, 12kB per component style)

## Testing Requirements
- Write unit tests for all new components and services
- Use Jasmine/Karma testing framework (configured in project)
- Mock services properly in tests
- Test form validation and error states
- Maintain test coverage above 80%

## Import Organization
- Group imports logically:
  1. Angular core imports
  2. Third-party library imports
  3. Application imports (models, services, components)
- Use barrel exports from `src/app/core/models/index.ts`

## Error Handling
- Always handle errors in observables with `catchError`
- Provide user-friendly error messages
- Log errors appropriately for debugging
