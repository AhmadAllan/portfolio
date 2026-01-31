# Subscription Management Guide

## Overview

This guide explains how to properly manage RxJS subscriptions in Angular to prevent memory leaks.

## The Problem

When you subscribe to an Observable without cleaning up, the subscription continues even after the component is destroyed, causing:
- Memory leaks
- Unnecessary API calls
- Performance degradation
- Potential state corruption

## Solutions

### 1. Async Pipe (Preferred)

**Best for:** Template subscriptions

```typescript
// Component
users$ = this.userService.getUsers();

// Template
<div *ngFor="let user of users$ | async">{{ user.name }}</div>
```

**Pros:**
- Automatic subscription management
- No manual cleanup needed
- Best performance

### 2. takeUntilDestroyed() (Modern Approach)

**Best for:** Constructor or field initializer subscriptions (Angular 16+)

```typescript
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  // ...
})
export class MyComponent {
  private userService = inject(UserService);

  constructor() {
    // Automatically unsubscribes when component is destroyed
    this.userService.getUsers()
      .pipe(takeUntilDestroyed())
      .subscribe(users => {
        this.users = users;
      });
  }
}
```

**Pros:**
- Clean, modern syntax
- Automatic cleanup
- Works in constructor and field initializers
- Type-safe

**Cons:**
- Only works in constructor or field initialization context
- Requires Angular 16+

### 3. DestroyRef (Modern Approach)

**Best for:** Method-based subscriptions (Angular 16+)

```typescript
import { Component, DestroyRef, inject } from '@angular/core';

@Component({
  // ...
})
export class MyComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);

  ngOnInit() {
    const subscription = this.userService.getUsers().subscribe(users => {
      this.users = users;
    });

    // Register cleanup
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
```

### 4. Subject + takeUntil (Traditional Approach)

**Best for:** Multiple subscriptions that need cleanup

```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  // ...
})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = users;
      });

    this.otherService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = data;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 5. Manual Unsubscribe (Last Resort)

**Best for:** One-off subscriptions with complex lifecycle

```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  // ...
})
export class MyComponent implements OnDestroy {
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
```

## Decision Tree

```
Do you need the data in the template only?
├─ Yes → Use Async Pipe
└─ No → Continue

Is the subscription in constructor/field initializer?
├─ Yes → Use takeUntilDestroyed()
└─ No → Continue

Do you have multiple subscriptions in methods?
├─ Yes → Use Subject + takeUntil
└─ No → Use DestroyRef or manual unsubscribe
```

## Common Mistakes

### ❌ BAD: No cleanup

```typescript
ngOnInit() {
  this.userService.getUsers().subscribe(users => {
    this.users = users;
  });
}
```

### ❌ BAD: Creating new Subject in ngOnInit

```typescript
ngOnInit() {
  const destroy$ = new Subject<void>(); // Wrong! Will be recreated if called again
  // ...
}
```

### ❌ BAD: Not completing Subject

```typescript
ngOnDestroy() {
  this.destroy$.next(); // Missing .complete()!
}
```

### ✅ GOOD: Proper cleanup

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.userService.getUsers()
    .pipe(takeUntil(this.destroy$))
    .subscribe(users => {
      this.users = users;
    });
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## ESLint Rules

Add these rules to catch subscription leaks:

```javascript
{
  'rxjs/no-ignored-subscription': 'error',
  'rxjs/no-implicit-any-catch': 'error',
}
```

## Testing Subscriptions

Always test that subscriptions are properly cleaned up:

```typescript
it('should unsubscribe on destroy', () => {
  const subscription = component['subscription'];
  spyOn(subscription, 'unsubscribe');

  component.ngOnDestroy();

  expect(subscription.unsubscribe).toHaveBeenCalled();
});
```

## Audit Results (Phase 3.5 - 2026-01-30)

### Summary

Comprehensive audit of all subscriptions in the codebase completed. Total subscriptions found: 35

### Fixed Components

1. **about-editor.component.ts** - Added DestroyRef cleanup for loadAbout() and saveAbout()
2. **dashboard-shell.component.ts** - Added DestroyRef cleanup for logout()
3. **education-editor.component.ts** - Added DestroyRef cleanup for all CRUD operations
4. **skills-editor.component.ts** - Added DestroyRef cleanup for all CRUD operations
5. **login.component.ts** - Added DestroyRef cleanup for login submission
6. **overview.component.ts** - Added takeUntilDestroyed() for currentUser$ subscription
7. **auth.service.ts** - Changed checkAuthStatus() to return Observable instead of void

### Components with Proper Cleanup (No Changes Needed)

1. **media.component.ts** - Uses Subject+takeUntil pattern
2. **layout.component.ts** - Uses Subject+takeUntil pattern
3. **language-switcher.component.ts** - Uses Subject+takeUntil pattern

### Intentionally Not Cleaned Up

**Service-level subscriptions** (AuthService constructor):
- The `checkAuthStatus().subscribe()` in AuthService constructor is intentional
- AuthService is a singleton provided in root
- Subscription lifetime matches application lifetime
- No memory leak as service is never destroyed during app lifecycle

### Patterns Used

- **takeUntilDestroyed()**: Constructor subscriptions (requires injection context)
- **DestroyRef.onDestroy()**: Method-based subscriptions in components
- **Subject+takeUntil**: Components with multiple subscriptions (media, layout, language-switcher)
- **Async pipe**: Template-only subscriptions (not tracked in this audit)

### Recommendations

1. **New components**: Default to async pipe for template subscriptions
2. **Constructor subscriptions**: Use takeUntilDestroyed()
3. **Method subscriptions**: Use DestroyRef.onDestroy()
4. **Multiple subscriptions**: Consider Subject+takeUntil pattern
5. **Service subscriptions**: Document why cleanup is intentional if subscription lifetime matches service lifetime
