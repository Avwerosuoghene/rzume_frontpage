---
description: Project-specific context and information for Rzume Frontpage
trigger: always_on
---

# Project Context: Rzume Frontpage

## Project Overview
**Type**: Marketing/Landing Page Application  
**Framework**: Angular 20.3.0  
**UI Library**: Angular Material 20.2.10  
**Architecture**: Standalone Components (No NgModules)  
**Styling**: SCSS with custom theme system  
**Testing**: Jasmine/Karma  
**Build**: Angular Build System (@angular/build)

## Technology Stack

### Core Dependencies
- **Angular**: 20.3.0 (Latest stable)
- **TypeScript**: 5.9.2 (Strict mode enabled)
- **RxJS**: 7.8.0
- **Angular Material**: 20.2.10
- **Angular CDK**: 20.2.10
- **Swiper**: 12.0.3 (Carousel/slider functionality)

### Development Tools
- **Testing**: Jasmine 5.9.0, Karma 6.4.0
- **Build**: @angular/build 20.3.2
- **Linting**: Prettier configured (printWidth: 100, singleQuote: true)
- **Deployment**: GitHub Actions workflow configured

## Application Architecture

### Routing Structure
The application uses lazy-loaded routes with the following structure:
- `/about` - About page (default route)
- `/features` - Features page
- `/faq` - FAQ page
- `/blog` - Blog page
- `/terms-conditions` - Terms and Conditions page

All routes use `loadComponent()` for lazy loading to optimize bundle size.

### Directory Structure
```
src/app/
├── components/        # Reusable presentation components
│   └── about/        # About-specific components
│       └── blog/     # Blog components
├── pages/            # Page-level container components
│   ├── about/
│   ├── features/
│   ├── faq/
│   ├── blog/
│   └── terms-conditions/
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
├── shared/           # Shared components (currently empty)
└── styles/           # Global styles and theme
    ├── theme.scss
    ├── fonts.scss
    └── general_styles.scss
```

### Core Services
- **AnimationService**: Handles scroll-based animations, staggered card animations, hero animations, and CTA animations with proper cleanup

### State Management Pattern
- Service-based state management using BehaviorSubject pattern
- No external state management library (NgRx, Akita, etc.)
- Component-level state for UI concerns
- Service-level state for shared data

## Styling System

### SCSS Architecture
- **Theme Variables**: `src/app/styles/theme.scss` - color palette and theme tokens
- **General Styles**: `src/app/styles/general_styles.scss` - reusable button styles
- **Fonts**: `src/app/styles/fonts.scss` - typography definitions
- **Component Styles**: Component-scoped SCSS files

### Color Palette
Primary colors defined in `theme.scss`:
- **Primary Blue**: `$rzume-blue` - rgba(62, 127, 255, 1)
- **Black**: `$black` - rgba(28, 28, 30, 1)
- **White**: `$white` - rgba(255, 255, 255, 1)
- **Gray**: `$gray` - rgba(139, 139, 139, 1)
- **Success Green**: `$basic-green` - rgba(93, 210, 122, 1)
- **Warning**: `$warning` - rgb(240, 44, 44)
- **Amber**: `$amber` - rgb(255, 191, 0)

### Button System
Reusable button classes in `general_styles.scss`:
- `.rzume-button-primary` - Primary action buttons (blue background)
- `.rzume-button-secondary` - Secondary buttons (white background)
- `.rzume-button-outline` - Outlined buttons (transparent with border)
- `.rzume-button-outline-text` - Text-only buttons

### Responsive Breakpoints
Mobile-first approach with breakpoints at:
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## Component Patterns

### Page Components (Containers)
- Located in `src/app/pages/`
- Handle routing, data fetching, and business logic
- Lazy-loaded via router configuration
- Example: `AboutComponent`, `FeaturesComponent`

### Presentation Components
- Located in `src/app/components/`
- Pure presentation logic
- Input/Output driven
- Reusable across pages
- Example: `BlogComponent`, `BlogPostComponent`

### Component Structure Pattern
```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, /* other imports */],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss' // Note: singular styleUrl
})
export class ComponentNameComponent {
  // Component implementation
}
```

## Data Models Organization

### Interfaces
- Located in `src/app/core/models/interfaces/`
- Define data structures and contracts
- Examples: `AboutFeatureCard`, `CoreFeaturesSection`, `TestimonialsSection`, `Navigation`

### Constants
- Located in `src/app/core/models/constants/`
- Static configuration data
- Examples: `auth.constants.ts`, `blog.constants.ts`, `carousel.constants.ts`, `navigation.constants.ts`, `ui.constants.ts`

### Mocks
- Located in `src/app/core/models/mocks/`
- Test data and development fixtures
- Examples: `blog.mock.ts`, `mock-blog-posts.ts`, `mock-testimonials.ts`

### Barrel Exports
- Central export from `src/app/core/models/index.ts`
- Simplifies imports across the application

## Animation Patterns

### AnimationService Usage
The project uses a custom `AnimationService` for:
- **Hero scroll animations**: Parallax effects on hero sections
- **Staggered card animations**: Sequential reveal of card elements
- **CTA scroll animations**: Scale effects on call-to-action elements
- **Proper cleanup**: Memory leak prevention with cleanup methods

## Testing Strategy

### Unit Tests
- Jasmine test framework
- Karma test runner
- Test files: `*.spec.ts` alongside components/services
- Mock services and dependencies
- Test component creation, inputs/outputs, and business logic

### Test Configuration
- `tsconfig.spec.json` for test-specific TypeScript config
- Karma configuration in `angular.json`
- Coverage reporting enabled

## Build & Deployment

### Development
```bash
npm start          # Start dev server
ng serve           # Alternative start command
```

### Production Build
```bash
npm run build      # Production build
```

### Build Budgets
- Initial bundle: Max 1MB (warning at 500kB)
- Component styles: Max 12kB (warning at 8kB)

### Deployment
- GitHub Actions workflow configured (`.github/workflows/deploy-frontend.yml`)
- Automated deployment pipeline

## Code Quality

### Prettier Configuration
- Print width: 100 characters
- Single quotes: true
- Angular HTML parser for templates

### TypeScript Strict Mode
Enabled strict compiler options:
- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `strictInjectionParameters: true`
- `strictInputAccessModifiers: true`
- `strictTemplates: true`

## Best Practices for This Project

1. **Use barrel exports** from `src/app/core/models/index.ts` for cleaner imports
2. **Follow the established directory structure** - components vs pages distinction
3. **Use theme variables** from `theme.scss` for all colors
4. **Apply button classes** from `general_styles.scss` for consistency
5. **Implement proper cleanup** in components using AnimationService
6. **Lazy load all routes** using `loadComponent()` pattern
7. **Use singular `styleUrl`** (not `styleUrls`) in Angular 20
8. **Maintain strict TypeScript** compliance
9. **Write tests** for all new components and services
10. **Follow mobile-first** responsive design approach
