# Windsurf Configuration Usage Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Working with Rules](#working-with-rules)
4. [Using Workflows](#using-workflows)
5. [Common Scenarios](#common-scenarios)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Introduction

This guide explains how to effectively use the Windsurf AI configuration for the Rzume Frontpage project. The configuration provides context-aware assistance for Angular development, ensuring consistent code quality and adherence to project standards.

## Getting Started

### Understanding the Configuration

The Windsurf configuration consists of three main components:

1. **Rules**: Context-aware guidelines that activate based on file types
2. **Workflows**: Step-by-step procedures for common tasks
3. **Documentation**: Reference materials and best practices

### How Rules Work

Rules are automatically applied based on:
- **File patterns**: Specific rules for `.component.ts`, `.service.ts`, `.spec.ts`, `.scss` files
- **Always-on rules**: Core standards that apply to all files
- **Model decisions**: Quality standards applied when relevant

You don't need to explicitly reference rules - they're automatically active when working on matching files.

## Working with Rules

### Always-On Rules

These rules are always active and provide foundational context:

#### Angular Core Standards
- Enforces Angular 20 patterns
- Standalone components
- Modern control flow syntax
- OnPush change detection
- Proper dependency injection

#### Project Context
- Project-specific information
- Technology stack details
- Directory structure
- Existing patterns and conventions

### Context-Aware Rules

#### Component Patterns (*.component.*)
Activated when working on component files:

```typescript
// Example prompt:
"Create a user profile component that displays user information"

// Windsurf will automatically:
// - Use standalone component structure
// - Apply OnPush change detection
// - Use modern control flow in templates
// - Follow BEM naming in SCSS
// - Generate unit tests
```

#### Service Patterns (*.service.ts)
Activated when working on service files:

```typescript
// Example prompt:
"Create a service to manage user authentication"

// Windsurf will automatically:
// - Use inject() for dependencies
// - Implement proper error handling
// - Use BehaviorSubject for state
// - Generate comprehensive tests
```

#### Testing Standards (*.spec.ts)
Activated when working on test files:

```typescript
// Example prompt:
"Add tests for the user profile component"

// Windsurf will automatically:
// - Follow AAA pattern
// - Mock dependencies properly
// - Test inputs/outputs
// - Cover edge cases
```

#### Styling Standards (*.scss)
Activated when working on SCSS files:

```scss
// Example prompt:
"Style the user card component"

// Windsurf will automatically:
// - Use theme variables
// - Follow BEM naming
// - Implement mobile-first design
// - Add proper transitions
```

## Using Workflows

### Referencing Workflows

Reference workflows in your prompts using the workflow name:

```
@create-component user-dashboard page
@create-service notification data
@add-feature shopping-cart
```

### Create Component Workflow

**Basic Usage:**
```
Create a blog-card component in the components directory
```

**Advanced Usage:**
```
Create a user-profile component with:
- Input: user data
- Output: profileUpdated event
- Display: avatar, name, email, bio
- Actions: edit and delete buttons
```

**What Gets Generated:**
- Component TypeScript file
- HTML template
- SCSS file
- Unit test file
- Proper imports and exports

### Create Service Workflow

**Data Service:**
```
Create a ProductService that:
- Fetches products from /api/products
- Supports CRUD operations
- Handles errors properly
```

**State Service:**
```
Create a CartStateService that:
- Manages cart items
- Calculates total
- Provides observables for cart state
```

**Facade Service:**
```
Create a UserFacadeService that:
- Coordinates UserDataService and UserStateService
- Handles authentication flow
- Manages user profile updates
```

### Add Feature Workflow

**Complete Feature:**
```
Add a "notifications" feature with:
- Notification list page
- Notification card component
- Mark as read functionality
- Real-time updates
- Notification service
- Routing
```

**What Gets Generated:**
- All necessary components
- Services (data, state, facade)
- Data models and interfaces
- Routes configuration
- Tests
- Documentation

## Common Scenarios

### Scenario 1: Creating a New Page

```
I need a new page for displaying user settings with tabs for:
- Profile information
- Account preferences
- Privacy settings
- Notification preferences
```

**Windsurf will:**
1. Create `SettingsComponent` in `src/app/pages/settings/`
2. Create tab components in `src/app/components/settings/`
3. Set up routing
4. Generate tests
5. Apply proper styling

### Scenario 2: Adding API Integration

```
Create a service to integrate with the blog API:
- GET /api/posts - fetch all posts
- GET /api/posts/:id - fetch single post
- POST /api/posts - create post
- PUT /api/posts/:id - update post
- DELETE /api/posts/:id - delete post
```

**Windsurf will:**
1. Create `BlogDataService` with all CRUD methods
2. Implement proper error handling
3. Add TypeScript interfaces for data models
4. Generate comprehensive tests
5. Include retry logic for resilience

### Scenario 3: Refactoring Existing Code

```
Refactor the AboutComponent to use OnPush change detection
and modern control flow syntax
```

**Windsurf will:**
1. Add `ChangeDetectionStrategy.OnPush`
2. Convert `*ngIf` to `@if`
3. Convert `*ngFor` to `@for`
4. Add `ChangeDetectorRef` if needed
5. Update tests accordingly

### Scenario 4: Adding Form Validation

```
Add a contact form with validation for:
- Name (required, min 2 characters)
- Email (required, valid email)
- Message (required, min 10 characters)
```

**Windsurf will:**
1. Create reactive form with FormBuilder
2. Add validators
3. Implement error messages
4. Style form with theme variables
5. Add form submission handling
6. Generate form tests

### Scenario 5: Implementing Responsive Design

```
Make the product grid responsive:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Large desktop: 4 columns
```

**Windsurf will:**
1. Use mobile-first approach
2. Add media queries at correct breakpoints
3. Use CSS Grid or Flexbox
4. Apply proper spacing
5. Test on different screen sizes

## Best Practices

### Writing Effective Prompts

**Good Prompts:**
```
✅ "Create a user-card component that displays user avatar, name, and email with a hover effect"
✅ "Add a UserService with methods to fetch, create, and update users"
✅ "Refactor the dashboard to use OnPush change detection"
```

**Less Effective Prompts:**
```
❌ "Make a component"
❌ "Add a service"
❌ "Fix the code"
```

**Tips:**
- Be specific about what you need
- Mention inputs, outputs, and functionality
- Reference existing patterns when applicable
- Specify location (page vs component)

### Iterative Development

1. **Start with structure**:
   ```
   Create the basic structure for a product catalog feature
   ```

2. **Add functionality**:
   ```
   Add search and filter functionality to the product catalog
   ```

3. **Enhance UI**:
   ```
   Improve the product card styling with hover effects and animations
   ```

4. **Add tests**:
   ```
   Add comprehensive tests for the product catalog feature
   ```

### Maintaining Consistency

**Always:**
- Let Windsurf apply project patterns automatically
- Use theme variables for colors
- Follow the established directory structure
- Write tests for new code
- Use barrel exports

**Avoid:**
- Hardcoding colors or values
- Bypassing OnPush change detection
- Using old Angular syntax
- Skipping tests
- Creating files outside standard locations

## Troubleshooting

### Issue: Generated Code Doesn't Compile

**Solution:**
```
The generated component has TypeScript errors. Please fix:
- [describe specific errors]
```

### Issue: Tests Are Failing

**Solution:**
```
The tests for UserComponent are failing. Please update the tests to:
- Mock the UserService properly
- Test the new input property
- Cover the error handling scenario
```

### Issue: Styling Doesn't Match Design

**Solution:**
```
Update the user-card styling to:
- Use $rzume-blue instead of hardcoded color
- Add 16px padding on mobile, 24px on desktop
- Follow BEM naming convention
```

### Issue: Need to Modify Generated Code

**Solution:**
```
Modify the UserService to:
- Add caching with 5-minute expiration
- Include retry logic for failed requests
- Add loading state management
```

## Advanced Usage

### Combining Multiple Workflows

```
Create a complete user management feature:
1. User list page with search and pagination
2. User detail page with edit capability
3. User service with full CRUD operations
4. User state management
5. Routing between pages
6. Comprehensive tests
```

### Custom Requirements

```
Create a ProductCardComponent with:
- Custom animation on hover (scale 1.05)
- Lazy-loaded product image
- Add to cart button with loading state
- Wishlist toggle
- Price display with currency formatting
- Stock availability indicator
```

### Integration with Existing Code

```
Integrate the new NotificationService with:
- Existing AuthService for user context
- WebSocket service for real-time updates
- Existing notification component
- Update tests to include new integration
```

## Tips for Success

1. **Be Specific**: Provide clear requirements and context
2. **Reference Patterns**: Mention existing components or services as examples
3. **Iterate**: Build features incrementally
4. **Test Early**: Request tests as you build
5. **Review**: Always review generated code
6. **Customize**: Don't hesitate to request modifications
7. **Learn**: Study the generated code to understand patterns

## Getting Help

If you encounter issues:

1. **Check the rules**: Review relevant rule files in `.windsurf/rules/`
2. **Review workflows**: Check workflow files in `.windsurf/workflows/`
3. **Provide context**: Include error messages and specific requirements
4. **Ask for clarification**: Request explanations of generated code

## Examples Library

### Example 1: Complete CRUD Feature
```
Add a "tasks" feature with:
- Task list page with filtering (all, active, completed)
- Task creation form
- Task editing capability
- Task deletion with confirmation
- Task service with API integration
- Task state management
- Routing
- Tests
```

### Example 2: Complex Component
```
Create a DataTableComponent with:
- Sortable columns
- Pagination
- Search functionality
- Row selection
- Export to CSV
- Responsive design
- Loading states
- Error handling
```

### Example 3: Service Integration
```
Create a NotificationFacadeService that:
- Integrates NotificationDataService and NotificationStateService
- Polls for new notifications every 30 seconds
- Shows toast notifications for new items
- Manages read/unread state
- Provides notification count observable
```

## Conclusion

The Windsurf configuration is designed to accelerate development while maintaining code quality and consistency. By understanding how to effectively use rules and workflows, you can leverage AI assistance to build robust Angular applications faster.

For more information:
- See `README.md` for overview
- Check individual rule files for detailed standards
- Review workflow files for step-by-step procedures
- Consult `HUSKY-SETUP.md` for git integration
