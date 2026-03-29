# Components Directory Agent

## Context
You are working in the `src/app/components/` directory, which contains **presentation components** (also called "dumb" or "presentational" components).

## Component Philosophy

### Presentation Components
Components in this directory should be:
- **Pure presentation logic**: Display data, emit events
- **Input/Output driven**: Receive data via `@Input()`, emit events via `@Output()`
- **No direct service dependencies**: Don't inject data services
- **Highly reusable**: Can be used across multiple pages
- **Stateless**: Minimal internal state, mostly display logic

### Examples in This Project
- `BlogComponent`: Displays blog section
- `BlogPostComponent`: Displays individual blog post card

## Component Structure

### Standard Template
```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComponentNameComponent {
  @Input() data!: DataType;
  @Input() config?: ConfigType;
  
  @Output() itemSelected = new EventEmitter<ItemType>();
  @Output() actionPerformed = new EventEmitter<ActionType>();
  
  protected handleClick(item: ItemType): void {
    this.itemSelected.emit(item);
  }
}
```

## Required Patterns

### Always Use
- ✅ `ChangeDetectionStrategy.OnPush`
- ✅ Singular `styleUrl` (not `styleUrls`)
- ✅ Modern control flow (`@if`, `@for`, `@switch`)
- ✅ `protected` for template-accessible members
- ✅ `private` for internal methods
- ✅ Strong typing (no `any`)

### Template Patterns
```html
<!-- Modern control flow -->
@if (data) {
  <div class="component">
    @for (item of data.items; track item.id) {
      <div class="component__item">{{ item.name }}</div>
    }
  </div>
}
```

### SCSS Patterns
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
  
  // Responsive
  @media (min-width: 768px) {
    padding: $spacing-lg;
  }
}
```

## Organization

### Directory Structure
```
components/
├── feature-name/
│   ├── component-name/
│   │   ├── component-name.component.ts
│   │   ├── component-name.component.html
│   │   ├── component-name.component.scss
│   │   └── component-name.component.spec.ts
│   └── sub-component/
│       └── ...
```

### Naming Conventions
- Directory: `kebab-case`
- Files: `component-name.component.{ts,html,scss,spec.ts}`
- Class: `PascalCase` + `Component` suffix
- Selector: `app-component-name`

## Common Tasks

### Creating a New Component
```
Create a user-card component that displays:
- User avatar
- User name and email
- Action buttons (edit, delete)
- Emits events for button clicks
```

### Adding Inputs
```typescript
@Input() user!: User;
@Input() showActions = true;
@Input() size: 'small' | 'medium' | 'large' = 'medium';
```

### Adding Outputs
```typescript
@Output() editClicked = new EventEmitter<User>();
@Output() deleteClicked = new EventEmitter<string>();

protected handleEdit(): void {
  this.editClicked.emit(this.user);
}

protected handleDelete(): void {
  this.deleteClicked.emit(this.user.id);
}
```

### Using in Parent Component
```html
<app-user-card
  [user]="selectedUser"
  [showActions]="canEdit"
  (editClicked)="onEdit($event)"
  (deleteClicked)="onDelete($event)"
></app-user-card>
```

## Testing

### Component Test Template
```typescript
describe('ComponentNameComponent', () => {
  let component: ComponentNameComponent;
  let fixture: ComponentFixture<ComponentNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentNameComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentNameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display data', () => {
    component.data = mockData;
    fixture.detectChanges();
    
    const element = fixture.nativeElement.querySelector('.component__title');
    expect(element.textContent).toContain(mockData.title);
  });

  it('should emit event on click', () => {
    spyOn(component.itemSelected, 'emit');
    
    component.handleClick(mockItem);
    
    expect(component.itemSelected.emit).toHaveBeenCalledWith(mockItem);
  });
});
```

## Styling Guidelines

### Use Theme Variables
```scss
// Good
background-color: $white;
color: $rzume-blue;

// Bad
background-color: #ffffff;
color: rgb(62, 127, 255);
```

### Follow BEM
```scss
.user-card {
  &__header { }
  &__avatar { }
  &__name { }
  &--highlighted { }
}
```

### Mobile-First
```scss
.component {
  padding: 12px; // Mobile
  
  @media (min-width: 768px) {
    padding: 24px; // Desktop
  }
}
```

## Best Practices

### Do's
- ✅ Keep components small and focused
- ✅ Use OnPush change detection
- ✅ Make components reusable
- ✅ Use inputs for data, outputs for events
- ✅ Write comprehensive tests
- ✅ Use theme variables for styling
- ✅ Follow BEM naming in SCSS

### Don'ts
- ❌ Don't inject data services directly
- ❌ Don't manage complex state
- ❌ Don't make HTTP calls
- ❌ Don't hardcode colors or values
- ❌ Don't use old Angular syntax
- ❌ Don't skip OnPush change detection

## Related Documentation
- See `.windsurf/rules/component-patterns.md` for detailed patterns
- See `.windsurf/workflows/create-component.md` for creation workflow
- See `src/app/pages/AGENTS.md` for page component patterns
