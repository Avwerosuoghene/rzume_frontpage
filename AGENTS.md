# Root Directory Agent

## Context
You are working in the root directory of the Rzume Frontpage Angular application.

## Project Overview
- **Type**: Marketing/Landing Page Application
- **Framework**: Angular 20.3.0
- **Architecture**: Standalone Components
- **UI Library**: Angular Material 20.2.10
- **Styling**: SCSS with custom theme system

## Responsibilities in This Directory

### Configuration Files
- `angular.json`: Angular workspace configuration
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `.gitignore`: Git ignore patterns
- `.prettierrc`: Code formatting rules

### Key Tasks
1. **Dependency Management**: Adding/updating npm packages
2. **Build Configuration**: Modifying Angular build settings
3. **TypeScript Configuration**: Updating compiler options
4. **Scripts**: Adding npm scripts for common tasks

## Common Operations

### Adding Dependencies
```bash
# Production dependency
npm install package-name

# Development dependency
npm install --save-dev package-name
```

### Updating Angular Configuration
When modifying `angular.json`:
- Maintain build budgets (500kB warning, 1MB error)
- Keep component style budgets (8kB warning, 12kB error)
- Preserve SCSS configuration
- Maintain lazy loading setup

### TypeScript Configuration
When modifying `tsconfig.json`:
- Keep strict mode enabled
- Maintain all strict compiler options
- Preserve Angular-specific settings
- Don't disable type checking

## Standards

### Package.json Scripts
- `start`: Development server
- `build`: Production build
- `test`: Run tests
- `lint`: Run linter
- `format`: Format code with Prettier

### Build Budgets
- Initial bundle: Max 1MB (warning at 500kB)
- Component styles: Max 12kB (warning at 8kB)

### TypeScript Strict Mode
All strict options are enabled:
- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

## Best Practices

1. **Always test after configuration changes**: Run `ng build` and `ng test`
2. **Document script changes**: Add comments in package.json
3. **Version lock critical dependencies**: Use exact versions for Angular packages
4. **Keep dependencies updated**: Regularly update to latest stable versions
5. **Maintain build performance**: Monitor bundle sizes

## Related Documentation
- See `.windsurf/README.md` for Windsurf configuration
- See `.windsurf/USAGE-GUIDE.md` for detailed usage
- See `.windsurf/HUSKY-SETUP.md` for git hooks setup
