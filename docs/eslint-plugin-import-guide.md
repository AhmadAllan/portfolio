# ESLint Plugin Import - Installation Guide

## Overview

This guide explains how to add `eslint-plugin-import` to the project for more comprehensive import management beyond the current `sort-imports` rule.

## Current State

The project currently uses ESLint's built-in `sort-imports` rule with limited configuration:

```javascript
'sort-imports': [
  'warn',
  {
    ignoreCase: false,
    ignoreDeclarationSort: true, // ⚠️ Does not enforce import declaration order
    ignoreMemberSort: false,
    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    allowSeparatedGroups: true,
  },
],
```

## Why Add eslint-plugin-import?

`eslint-plugin-import` provides:

1. **Better Import Organization**: Enforces consistent grouping and ordering of imports
2. **Dependency Validation**: Ensures imports exist and are correctly resolved
3. **Best Practices**: Prevents common import-related mistakes
4. **Auto-fixing**: Can automatically organize imports on save

## Installation

### Step 1: Install the Package

```bash
npm install -D eslint-plugin-import
```

### Step 2: Update ESLint Configuration

Add to `eslint.config.mjs`:

```javascript
import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  },
  // ... existing rules ...
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Replace or enhance the existing sort-imports rule
      'sort-imports': [
        'warn',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true, // Let import/order handle this
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],

      // Add import plugin rules
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',  // Node.js built-in modules
            'external', // External packages
            'internal', // Internal aliases (@portfolio/*)
            'parent',   // Parent directory imports
            'sibling',  // Same directory imports
            'index',    // Index imports
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: '@portfolio/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],

      // Additional helpful rules
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/no-duplicates': 'warn',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'warn',
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-anonymous-default-export': 'warn',
    },
  },
];
```

## Expected Import Order

With the above configuration, imports will be organized as:

```typescript
// 1. Node.js built-in modules
import { readFileSync } from 'fs';
import { join } from 'path';

// 2. External packages (alphabetically)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// 3. Internal workspace aliases (alphabetically)
import { AuthService } from '@portfolio/web-shared';
import { PortfolioService } from '@portfolio/dashboard/data-access';

// 4. Parent directory imports
import { ParentComponent } from '../parent.component';

// 5. Sibling imports
import { SiblingService } from './sibling.service';

// 6. Index imports
import * as utils from './index';
```

## Auto-fix on Save

### VS Code

Add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### WebStorm/IntelliJ

1. Go to **Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint**
2. Enable "Run eslint --fix on save"

## Migration Strategy

### Option 1: Gradual Migration (Recommended)

1. Install the plugin and add rules as warnings
2. Fix imports in new files as you create them
3. Gradually update existing files during normal development
4. Run `npm run lint -- --fix` periodically to auto-fix

### Option 2: Big Bang

1. Install the plugin
2. Run linting with auto-fix on entire codebase:
   ```bash
   npx eslint . --fix
   ```
3. Review and commit changes

## Testing

After installation:

1. Run linting to see violations:
   ```bash
   npm run lint
   ```

2. Auto-fix issues:
   ```bash
   npm run lint -- --fix
   ```

3. Verify no regressions:
   ```bash
   npm run build
   npm test
   ```

## Benefits

- ✅ Consistent import organization across the codebase
- ✅ Prevents circular dependencies (can cause runtime errors)
- ✅ Catches typos in import paths early
- ✅ Makes code reviews easier (imports are always in same order)
- ✅ Reduces merge conflicts in import statements
- ✅ Auto-fixable (saves developer time)

## Considerations

- **Performance**: Adds ~1-2 seconds to lint time for large projects
- **Learning Curve**: Team needs to understand import grouping rules
- **Conflicts**: May conflict with IDE auto-import features initially
- **Configuration**: Requires customization for monorepo patterns

## Alternative: TypeScript Import Sorter

If `eslint-plugin-import` seems too heavy, consider:

- **VSCode Extension**: `TypeScript Import Sorter`
- **Prettier Plugin**: `@trivago/prettier-plugin-sort-imports`

## Resources

- [eslint-plugin-import Documentation](https://github.com/import-js/eslint-plugin-import)
- [Nx ESLint Integration](https://nx.dev/recipes/tips-n-tricks/eslint)
- [Import Order Best Practices](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)

---

**Decision**: Defer to development team to decide if/when to implement based on:
- Current pain points with import organization
- Team preference for tooling complexity
- Availability of time for migration
