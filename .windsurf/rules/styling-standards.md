---
description: SCSS styling standards and best practices
trigger: glob
glob: "*.scss"
---

# Styling Standards

## SCSS Architecture

### File Organization
```
src/app/styles/
├── theme.scss           # Color palette and theme variables
├── fonts.scss           # Typography definitions
├── general_styles.scss  # Reusable button and component styles
└── mixins.scss          # Reusable SCSS mixins (if needed)

src/app/components/
└── feature/
    └── feature.component.scss  # Component-scoped styles
```

### Import Order
```scss
// 1. Theme variables
@use '../../../styles/theme' as *;

// 2. Fonts (if needed)
@use '../../../styles/fonts' as *;

// 3. Mixins (if needed)
@use '../../../styles/mixins' as *;

// 4. Component styles
.component-name {
  // Styles here
}
```

## Theme System

### Using Theme Variables
Always use theme variables from `theme.scss` for colors:

```scss
@use '../../../styles/theme' as *;

.component {
  // Good - Use theme variables
  background-color: $white;
  color: $black;
  border: 1px solid $light-gray;
  
  &__button {
    background-color: $rzume-blue;
    color: $white;
    
    &:hover {
      background-color: darken($rzume-blue, 10%);
    }
  }
  
  &__success {
    background-color: $basic-green-light;
    color: $basic-green;
  }
  
  &__warning {
    background-color: $warning-light;
    color: $warning;
  }
  
  // Bad - Hardcoded colors
  // background-color: #ffffff;
  // color: rgb(28, 28, 30);
}
```

### Available Theme Colors
```scss
// Primary Colors
$black: rgba(28, 28, 30, 1);
$white: rgba(255, 255, 255, 1);
$rzume-blue: rgba(62, 127, 255, 1);

// Secondary Colors
$gray: rgba(139, 139, 139, 1);
$light-gray: rgb(227, 227, 228);
$light-gray-2: rgb(243, 243, 243, 1);

// Status Colors
$basic-green: rgba(93, 210, 122, 1);
$basic-green-light: rgba(93, 210, 122, 0.15);
$warning: rgb(240, 44, 44);
$warning-light: rgba(240, 44, 44, 0.15);
$amber: rgb(255, 191, 0);
$amber-light: rgba(250, 191, 1, 0.1);

// Blue Variations
$rzume-blue-light: rgba(62, 127, 255, 0.1);
$rzume-blue-light-shade-2: rgba(62, 127, 255, 0.26);
$light-blue: rgba(235, 244, 255, 1);
$lowsaturation-blue: rgb(102, 115, 144);

// Overlay Colors
$hero-overlay-dark: rgba(0, 0, 0, 0.7);
$hero-overlay-dark-light: rgba(0, 0, 0, 0.4);
$hero-overlay-blue: rgba(62, 127, 255, 0.8);
$hero-overlay-blue-light: rgba(62, 127, 255, 0.6);
$white-transparent: rgba(255, 255, 255, 0.9);
```

## BEM Naming Convention

### Block-Element-Modifier Pattern
```scss
// Block
.feature-card {
  padding: 16px;
  border-radius: 8px;
  
  // Element (child of block)
  &__header {
    margin-bottom: 12px;
    
    // Nested element
    &-title {
      font-size: 20px;
      font-weight: 600;
    }
    
    &-subtitle {
      font-size: 14px;
      color: $gray;
    }
  }
  
  &__content {
    padding: 12px 0;
  }
  
  &__footer {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
  
  // Modifier (variation of block)
  &--highlighted {
    border: 2px solid $rzume-blue;
    background-color: $rzume-blue-light;
  }
  
  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  
  &--large {
    padding: 24px;
    
    .feature-card__header-title {
      font-size: 24px;
    }
  }
}
```

### Usage in Templates
```html
<!-- Block -->
<div class="feature-card">
  <!-- Element -->
  <div class="feature-card__header">
    <h3 class="feature-card__header-title">Title</h3>
    <p class="feature-card__header-subtitle">Subtitle</p>
  </div>
  
  <div class="feature-card__content">Content</div>
  
  <div class="feature-card__footer">Footer</div>
</div>

<!-- Block with Modifier -->
<div class="feature-card feature-card--highlighted">
  <!-- Elements -->
</div>
```

## Responsive Design

### Mobile-First Approach
Always start with mobile styles, then add tablet and desktop:

```scss
.component {
  // Mobile styles (default, < 480px)
  padding: 12px;
  font-size: 14px;
  
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  // Tablet (480px - 768px)
  @media (min-width: 480px) {
    padding: 16px;
    font-size: 16px;
    
    &__grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
  
  // Desktop (768px+)
  @media (min-width: 768px) {
    padding: 24px;
    font-size: 18px;
    
    &__grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
  }
  
  // Large Desktop (1024px+)
  @media (min-width: 1024px) {
    max-width: 1200px;
    margin: 0 auto;
    
    &__grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
    }
  }
}
```

### Breakpoint Variables (Optional)
If you create a mixins file, define breakpoint mixins:

```scss
// _mixins.scss
@mixin mobile {
  @media (max-width: 479px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 480px) and (max-width: 767px) {
    @content;
  }
}

@mixin tablet-up {
  @media (min-width: 480px) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: 768px) {
    @content;
  }
}

@mixin large-desktop {
  @media (min-width: 1024px) {
    @content;
  }
}

// Usage
.component {
  padding: 12px;
  
  @include tablet-up {
    padding: 16px;
  }
  
  @include desktop {
    padding: 24px;
  }
}
```

## Layout Patterns

### Flexbox Layouts
```scss
.flex-container {
  display: flex;
  
  // Horizontal layout
  &--row {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }
  
  // Vertical layout
  &--column {
    flex-direction: column;
    gap: 12px;
  }
  
  // Space between items
  &--space-between {
    justify-content: space-between;
  }
  
  // Center items
  &--center {
    justify-content: center;
    align-items: center;
  }
  
  // Wrap items
  &--wrap {
    flex-wrap: wrap;
  }
}
```

### Grid Layouts
```scss
.grid-container {
  display: grid;
  gap: 16px;
  
  // Auto-fit columns
  &--auto-fit {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  // Fixed columns
  &--two-column {
    grid-template-columns: repeat(2, 1fr);
  }
  
  &--three-column {
    grid-template-columns: repeat(3, 1fr);
  }
  
  // Responsive grid
  &--responsive {
    grid-template-columns: 1fr;
    
    @media (min-width: 480px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
```

## Button Styles

### Using Existing Button Classes
The project has predefined button classes in `general_styles.scss`:

```scss
// Extend existing button styles
.custom-button {
  @extend .rzume-button-primary;
  
  // Add custom modifications
  min-width: 200px;
  font-weight: 600;
}

// Or use directly in template
// <button class="rzume-button-primary">Click Me</button>
```

### Available Button Classes
```scss
// Primary button (blue background)
.rzume-button-primary

// Secondary button (white background)
.rzume-button-secondary

// Outline button (transparent with border)
.rzume-button-outline

// Text-only button
.rzume-button-outline-text
```

## Typography

### Font Sizing
```scss
.component {
  // Headings
  &__heading-1 {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
    
    @media (min-width: 768px) {
      font-size: 48px;
    }
  }
  
  &__heading-2 {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.3;
    
    @media (min-width: 768px) {
      font-size: 32px;
    }
  }
  
  &__heading-3 {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.4;
  }
  
  // Body text
  &__body {
    font-size: 16px;
    line-height: 1.6;
    color: $black;
  }
  
  &__body-small {
    font-size: 14px;
    line-height: 1.5;
    color: $gray;
  }
  
  // Labels
  &__label {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}
```

### Text Utilities
```scss
.text {
  &-center {
    text-align: center;
  }
  
  &-left {
    text-align: left;
  }
  
  &-right {
    text-align: right;
  }
  
  &-bold {
    font-weight: 700;
  }
  
  &-semibold {
    font-weight: 600;
  }
  
  &-normal {
    font-weight: 400;
  }
  
  &-uppercase {
    text-transform: uppercase;
  }
  
  &-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
```

## Spacing System

### Consistent Spacing
```scss
// Define spacing variables (optional)
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;

.component {
  padding: $spacing-md;
  margin-bottom: $spacing-lg;
  
  &__section {
    margin-bottom: $spacing-xl;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &__items {
    display: flex;
    gap: $spacing-sm;
  }
}
```

## Animations and Transitions

### Smooth Transitions
```scss
.component {
  transition: all 0.3s ease;
  
  &__button {
    background-color: $rzume-blue;
    transition: background-color 0.2s ease, transform 0.2s ease;
    
    &:hover {
      background-color: darken($rzume-blue, 10%);
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &__card {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    
    &.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

### Keyframe Animations
```scss
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.component {
  &__animated {
    animation: fadeIn 0.5s ease forwards;
  }
  
  &__pulse {
    animation: pulse 2s ease infinite;
  }
}
```

## Component-Specific Patterns

### Card Components
```scss
.card {
  background-color: $white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
  }
  
  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 16px;
  }
  
  &__title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: $black;
  }
  
  &__description {
    font-size: 14px;
    color: $gray;
    line-height: 1.6;
  }
}
```

### Form Components
```scss
.form {
  &__group {
    margin-bottom: 20px;
  }
  
  &__label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    color: $black;
  }
  
  &__input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid $light-gray;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: $rzume-blue;
    }
    
    &--error {
      border-color: $warning;
    }
  }
  
  &__error {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: $warning;
  }
  
  &__helper {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: $gray;
  }
}
```

## Accessibility

### Focus Styles
```scss
.component {
  &__button,
  &__link,
  &__input {
    &:focus {
      outline: 2px solid $rzume-blue;
      outline-offset: 2px;
    }
    
    &:focus:not(:focus-visible) {
      outline: none;
    }
    
    &:focus-visible {
      outline: 2px solid $rzume-blue;
      outline-offset: 2px;
    }
  }
}
```

### High Contrast Mode
```scss
.component {
  @media (prefers-contrast: high) {
    border: 2px solid currentColor;
    
    &__text {
      font-weight: 600;
    }
  }
}
```

### Reduced Motion
```scss
.component {
  transition: all 0.3s ease;
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    animation: none;
  }
}
```

## Performance Optimization

### Avoid Expensive Selectors
```scss
// Good - Direct selectors
.component {
  &__child {
    color: $black;
  }
}

// Bad - Deep nesting and universal selectors
.component {
  div {
    * {
      color: $black;
    }
  }
}
```

### Use Transform for Animations
```scss
// Good - Use transform (GPU accelerated)
.component {
  &:hover {
    transform: translateY(-4px);
  }
}

// Bad - Use top/left (causes reflow)
.component {
  position: relative;
  
  &:hover {
    top: -4px; // Avoid
  }
}
```

## Best Practices Checklist

Before completing styles, verify:
- ✅ Uses theme variables for all colors
- ✅ Follows BEM naming convention
- ✅ Mobile-first responsive design
- ✅ Consistent spacing using spacing variables
- ✅ Smooth transitions and animations
- ✅ Proper focus styles for accessibility
- ✅ Reduced motion support
- ✅ No hardcoded colors or magic numbers
- ✅ Proper use of `@use` instead of `@import`
- ✅ Component styles are scoped
- ✅ No deep nesting (max 3-4 levels)
- ✅ Reuses existing button classes where possible
- ✅ Follows project's existing patterns
