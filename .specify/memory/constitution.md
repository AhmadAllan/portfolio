<!--
  =============================================================================
  SYNC IMPACT REPORT
  =============================================================================
  Version Change: 0.0.0 → 1.0.0
  Bump Rationale: MAJOR - Initial constitution ratification from template

  Modified Principles: N/A (initial version)

  Added Sections:
    - 8 Core Principles (Quality, Bilingual, Accessibility, Architecture,
      Type Safety, API Design, Security, Performance)
    - Technical Stack (non-negotiable technologies)
    - Development Workflow (Git, code review, quality gates)
    - Governance rules and amendment procedure

  Removed Sections: N/A (initial version)

  Templates Requiring Updates:
    ✅ plan-template.md - Constitution Check section is generic, compatible
    ✅ spec-template.md - Requirements structure is generic, compatible
    ✅ tasks-template.md - Phase structure is generic, compatible
    ✅ checklist-template.md - Generic structure, compatible
    ✅ agent-file-template.md - Generic structure, compatible

  Deferred Items: None
  =============================================================================
-->

# Lovecraftian Portfolio Platform Constitution

## Core Principles

### I. Quality Over Speed

All development prioritizes clean, maintainable code over meeting arbitrary deadlines.

**Non-Negotiable Rules:**
- No time-boxing features at the expense of code quality
- Technical debt MUST be documented and scheduled for resolution
- Refactoring is a first-class activity, not an afterthought
- Code MUST be self-documenting; complex logic requires inline comments

**Rationale:** This is a personal portfolio platform with no external deadlines. Rushing
leads to unmaintainable code that costs more to fix later.

### II. Bilingual First (Arabic Primary)

Arabic is the primary language with English as secondary. Full RTL support is mandatory.

**Non-Negotiable Rules:**
- Arabic (`ar`) is the default/fallback language
- All user-facing text MUST have Arabic and English translations
- CSS MUST use logical properties (`margin-inline-start`, not `margin-left`)
- Code blocks and technical content MUST remain LTR regardless of page direction
- Directional icons MUST be mirrored for RTL layouts
- Date formats: Arabic `22 يناير 2026`, English `January 22, 2026`
- Numbers use Western digits in both languages

**Rationale:** The platform owner's primary audience reads Arabic. Proper RTL support
from the start prevents costly retrofitting.

### III. Accessibility Non-Negotiable (WCAG AA)

All public pages MUST meet WCAG 2.1 Level AA compliance.

**Non-Negotiable Rules:**
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text
- All interactive elements MUST be keyboard accessible
- Visible focus indicators MUST be present on all focusable elements
- All images MUST have meaningful `alt` text
- Skip-to-content links MUST be provided
- Form inputs MUST have associated labels
- ARIA landmarks and roles MUST be used appropriately
- `prefers-reduced-motion` MUST disable/reduce animations

**Rationale:** Accessibility is a fundamental requirement, not a feature. Retrofitting
accessibility is expensive and often incomplete.

### IV. Domain-Driven Nx Monorepo Architecture

The codebase follows a strict Nx monorepo structure with domain-driven library organization.

**Non-Negotiable Rules:**
- Apps in `apps/` (web, api), libraries in `libs/`
- Frontend libraries: `libs/web/{domain}/[feature-*/ui/data-access/util-*]`
- Backend libraries: `libs/api/{domain}/src/lib/{entity}/` (entity-folder pattern)
- Shared types: `libs/shared/types/` - single source of truth for FE/BE interfaces
- Library types: `feature` → `data-access`/`ui`/`util`; `ui` → `util` only
- Scope rules: `scope:web` cannot import `scope:api` and vice versa
- Domain rules: domain libraries can import `domain:shared` only

**Library Dependency Matrix:**

| Library Type | Can Import |
|--------------|------------|
| `feature` | `data-access`, `ui`, `util`, `shared` |
| `ui` | `util`, `shared/types` only |
| `data-access` | `util`, `shared/types` only |
| `util` | `shared/types` only |

**Rationale:** Enforced boundaries prevent spaghetti dependencies and enable
independent testing and deployment of features.

### V. Type Safety & Shared Contracts

TypeScript strict mode is mandatory. All types shared between frontend and backend
live in a single shared library.

**Non-Negotiable Rules:**
- `any` type is FORBIDDEN - use `unknown` with type guards if type is uncertain
- `@ts-ignore` and `@ts-nocheck` are FORBIDDEN
- All interfaces use `I` prefix: `IPost`, `INote`, `ICategory`
- Enums use PascalCase: `PostStatus`, `NoteMaturity`
- DTOs reference shared interfaces; entities implement them
- No duplicate type definitions across FE/BE

**Rationale:** Type safety catches errors at compile time. Shared contracts ensure
frontend and backend stay synchronized.

### VI. JSend API Specification

All API responses MUST follow the JSend specification for consistency.

**Non-Negotiable Rules:**
- Success responses: `{ "status": "success", "data": { ... } }`
- Client errors (validation, not found): `{ "status": "fail", "data": { field: "error" } }`
- Server errors: `{ "status": "error", "message": "...", "code": "..." }`
- Paginated responses include `meta: { total, page, limit, totalPages }`
- API versioning in URL: `/api/v1/...`
- All endpoints documented with Swagger decorators

**Rationale:** Consistent API responses simplify frontend error handling and
improve developer experience.

### VII. Security First

Security is built-in, not bolted-on. All security measures are mandatory.

**Non-Negotiable Rules:**
- JWT tokens stored in HttpOnly, Secure cookies ONLY (never localStorage)
- Access token expiry: 15 minutes; Refresh token expiry: 7 days
- CSRF protection required for all mutation endpoints
- All inputs validated server-side with `class-validator`
- SQL injection prevented via parameterized queries (Drizzle ORM)
- XSS prevented via content sanitization and CSP headers
- Rate limiting applied per IP on public endpoints
- Secrets in environment variables ONLY, never in code

**Rationale:** The platform handles user-generated content and authentication.
Security vulnerabilities would compromise the entire platform.

### VIII. Performance Standards

All public pages MUST meet specific performance targets measured via Lighthouse.

**Non-Negotiable Rules:**

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Lighthouse Performance Score | > 90 |

**Implementation Requirements:**
- SSR mandatory for all public pages (Portfolio, Blog, Garden)
- Images optimized (WebP, responsive sizes)
- Lazy loading for below-fold content
- `OnPush` change detection in Angular components
- `trackBy` required in all `*ngFor` directives

**Rationale:** Performance directly impacts user experience and SEO. These targets
align with Core Web Vitals thresholds.

## Technical Stack

**Non-Negotiable Technologies:**

| Layer | Technology        | Version | Required |
|-------|-------------------|---------|----------|
| Monorepo | Nx                | Latest | ✅ |
| Frontend | Angular           | 19+ | ✅ |
| SSR | Angular Universal | - | ✅ |
| Backend | NestJS            | Latest | ✅ |
| Database | PostgreSQL        | 15+ | ✅ |
| ORM | Drizzle           | Latest | ✅ |
| Language | TypeScript        | 5.x | ✅ |
| Styling | SCSS + nested BEM | - | Preferred |
| Package Manager | pnpm              | Latest | Preferred |

**Rendering Strategy:**

| Route | Rendering | Rationale |
|-------|-----------|-----------|
| Landing | SSR | SEO, dramatic first load |
| Portfolio | SSR | SEO critical for professional presence |
| Blog | SSR | SEO critical for discoverability |
| Garden | SSR | SEO for indexing notes |
| Dashboard | CSR | No SEO needed, simpler auth |

## Development Workflow

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `post.service.ts` |
| Classes | PascalCase | `PostService` |
| Interfaces | PascalCase + `I` prefix | `IPost` |
| Enums | PascalCase | `PostStatus` |
| Functions | camelCase | `findBySlug()` |
| Variables | camelCase | `postCount` |
| Constants | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| CSS Classes | kebab-case | `post-card` |
| DB Tables | snake_case (plural) | `blog_posts` |
| DB Columns | snake_case | `created_at` |

### Git Conventions

**Branch Naming:**
```
feature/{domain}-{description}    # feature/blog-add-series-support
bugfix/{domain}-{description}     # bugfix/garden-fix-broken-links
refactor/{description}            # refactor/improve-auth-flow
docs/{description}                # docs/update-readme
```

**Commit Messages (Conventional Commits):**
```
type(scope): description

feat(blog): add series landing page
fix(garden): resolve broken backlinks calculation
refactor(api): simplify auth guard logic
docs(readme): add setup instructions
chore(deps): update Angular to v19
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

### Code Review Checklist

All PRs MUST pass these checks:
- [ ] Follows naming conventions
- [ ] No `console.log` or `debugger` statements
- [ ] Proper error handling implemented
- [ ] Types defined (no `any`)
- [ ] Accessibility considered (keyboard, screen reader)
- [ ] RTL/i18n considered
- [ ] Tests added/updated for critical paths
- [ ] No hardcoded strings (use i18n)
- [ ] Swagger docs updated (for API changes)

### Quality Gates

**Pre-Commit:**
- ESLint passes
- Prettier formatting applied
- TypeScript compilation succeeds
- Affected tests pass

**Pre-Merge:**
- All CI checks pass
- Code review approved
- No merge conflicts
- Branch up to date with main
- semantic-release after merge

### Definition of Done

A feature is complete when:
- [ ] Feature works as specified
- [ ] Works in both AR and EN
- [ ] Works in RTL and LTR
- [ ] Accessible (keyboard nav, screen reader)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Critical path tests pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Swagger docs updated (for API)

## Governance

This constitution is the supreme authority for all development decisions on the
Lovecraftian Portfolio Platform. It supersedes all other practices, conventions,
or preferences not explicitly documented here.

### Amendment Procedure

1. Propose amendment with rationale
2. Document change in Amendment Log below
3. Update all dependent templates and documentation
4. Increment version according to semantic versioning:
   - **MAJOR**: Principle removal or incompatible redefinition
   - **MINOR**: New principle or section added
   - **PATCH**: Clarifications, typos, non-semantic changes

### Compliance

- All PRs MUST be verified against this constitution
- Violations require explicit justification in PR description
- Complexity beyond constitution limits requires documented rationale
- AI assistants MUST reference this constitution for code generation decisions

### Forbidden Patterns

These patterns are NEVER acceptable:
- ❌ Using `any` type
- ❌ Using `@ts-ignore` or `@ts-nocheck`
- ❌ Hardcoded user-facing strings (use i18n)
- ❌ Direct DOM manipulation in Angular
- ❌ `console.log` in production code
- ❌ Synchronous file operations
- ❌ SQL string concatenation
- ❌ Storing secrets in code or version control

### Amendment Log

| Date | Version | Change | Reason |
|------|---------|--------|--------|
| 2026-01-23 | 1.0.0 | Initial constitution | Project kickoff - derived from PRD and speckit-constitution.md |

**Version**: 1.0.0 | **Ratified**: 2026-01-23 | **Last Amended**: 2026-01-23
