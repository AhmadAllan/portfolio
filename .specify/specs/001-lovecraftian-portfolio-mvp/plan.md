# Implementation Plan: Lovecraftian Portfolio Platform MVP

**Branch**: `001-lovecraftian-portfolio-mvp` | **Date**: 2026-01-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-lovecraftian-portfolio-mvp/spec.md`

## Summary

Build a bilingual (Arabic/English) professional portfolio platform consisting of three interconnected sites—Landing Page, Portfolio, Blog, and Digital Garden—unified by a Lovecraftian cosmic horror aesthetic. The platform includes a protected admin dashboard for content management, server-side rendering for SEO, and full RTL support. Technical approach uses Angular 19+ with SSR for frontend, NestJS for backend API, PostgreSQL with Drizzle ORM, all organized in an Nx monorepo following domain-driven library architecture.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Angular 19+, NestJS (latest), Drizzle ORM, Nx (latest)
**Storage**: PostgreSQL 15+, local filesystem for media files
**Testing**: Jest (unit/integration), Playwright (E2E - Phase 2)
**Target Platform**: Web (SSR for public, CSR for dashboard), PWA-capable
**Project Type**: Nx monorepo (web + api applications with shared libraries)
**Performance Goals**: FCP < 1.5s, LCP < 2.5s, TTI < 3.5s, CLS < 0.1, Lighthouse > 90
**Constraints**: 100 concurrent visitors, 10MB max file upload, WCAG AA compliance
**Scale/Scope**: Single admin user (Phase 1), ~15 entities, 4 public sites + 1 dashboard

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Quality Over Speed | PASS | No deadlines; focus on maintainable code |
| II. Bilingual First (Arabic Primary) | PASS | Arabic default, RTL support, CSS logical properties required |
| III. Accessibility (WCAG AA) | PASS | SC-004 requires Lighthouse Accessibility > 90 |
| IV. Domain-Driven Nx Architecture | PASS | Monorepo structure follows constitution pattern |
| V. Type Safety & Shared Contracts | PASS | TypeScript strict, shared types library |
| VI. JSend API Specification | PASS | FR-053 requires JSend responses |
| VII. Security First | PASS | JWT in HttpOnly cookies, CSRF, rate limiting defined |
| VIII. Performance Standards | PASS | All metrics explicitly defined in success criteria |

**Gate Result**: PASS - No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-lovecraftian-portfolio-mvp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI specs)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
workspace/
├── apps/
│   ├── web/                    # Angular SSR application
│   │   └── src/
│   │       ├── app/
│   │       │   ├── app.module.ts
│   │       │   ├── app.routes.ts
│   │       │   └── core/       # App-level services, guards
│   │       └── main.ts
│   │
│   └── api/                    # NestJS application
│       └── src/
│           ├── main.ts
│           └── app.module.ts
│
├── libs/
│   ├── web/                    # Frontend libraries (domain-driven)
│   │   ├── landing/
│   │   │   └── feature/        # Landing page with effects
│   │   │
│   │   ├── portfolio/
│   │   │   ├── feature-shell/  # Portfolio routing
│   │   │   ├── feature-about/
│   │   │   ├── feature-projects/
│   │   │   ├── feature-experience/
│   │   │   ├── feature-skills/
│   │   │   ├── feature-education/
│   │   │   ├── data-access/    # Portfolio API services
│   │   │   └── ui/             # Portfolio-specific components
│   │   │
│   │   ├── blog/
│   │   │   ├── feature-shell/
│   │   │   ├── feature-post/
│   │   │   ├── feature-list/
│   │   │   ├── feature-series/
│   │   │   ├── data-access/
│   │   │   └── ui/
│   │   │
│   │   ├── garden/
│   │   │   ├── feature-shell/
│   │   │   ├── feature-note/
│   │   │   ├── data-access/
│   │   │   ├── ui/
│   │   │   └── util-links/     # Wiki-link parser
│   │   │
│   │   ├── dashboard/
│   │   │   ├── feature-shell/
│   │   │   ├── feature-posts/
│   │   │   ├── feature-notes/
│   │   │   ├── feature-portfolio/
│   │   │   ├── feature-media/
│   │   │   ├── feature-comments/
│   │   │   ├── data-access/
│   │   │   └── ui/
│   │   │
│   │   └── shared/
│   │       ├── data-access/    # HTTP client, auth service
│   │       ├── ui/             # Shared components (buttons, cards)
│   │       ├── ui-layout/      # Header, footer, RTL wrapper
│   │       ├── ui-effects/     # Rain, thunder, Cthulhu canvas
│   │       ├── util-i18n/      # Translation utilities
│   │       ├── util-formatting/ # Date/number formatting
│   │       ├── util-seo/       # Meta tags, OG images
│   │       └── util-markdown/  # Markdown processor with syntax highlighting
│   │
│   ├── api/                    # Backend libraries (entity-folder pattern)
│   │   ├── core/
│   │   │   └── src/lib/
│   │   │       ├── core.module.ts
│   │   │       ├── config/
│   │   │       ├── database/
│   │   │       │   └── schema/
│   │   │       │       ├── blog.schema.ts
│   │   │       │       ├── garden.schema.ts
│   │   │       │       ├── portfolio.schema.ts
│   │   │       │       └── media.schema.ts
│   │   │       ├── auth/
│   │   │       │   ├── auth.module.ts
│   │   │       │   ├── auth.controller.ts
│   │   │       │   ├── auth.service.ts
│   │   │       │   ├── jwt.strategy.ts
│   │   │       │   └── dto/
│   │   │       ├── guards/
│   │   │       ├── interceptors/
│   │   │       ├── filters/
│   │   │       └── decorators/
│   │   │
│   │   ├── blog/
│   │   │   └── src/lib/
│   │   │       ├── blog.module.ts
│   │   │       ├── post/
│   │   │       ├── category/
│   │   │       ├── tag/
│   │   │       ├── series/
│   │   │       └── comment/
│   │   │
│   │   ├── garden/
│   │   │   └── src/lib/
│   │   │       ├── garden.module.ts
│   │   │       ├── note/
│   │   │       └── note-link/
│   │   │
│   │   ├── portfolio/
│   │   │   └── src/lib/
│   │   │       ├── portfolio.module.ts
│   │   │       ├── project/
│   │   │       ├── experience/
│   │   │       ├── skill/
│   │   │       ├── education/
│   │   │       └── about/
│   │   │
│   │   └── media/
│   │       └── src/lib/
│   │           ├── media.module.ts
│   │           ├── file/
│   │           └── folder/
│   │
│   └── shared/
│       └── types/              # Shared interfaces (FE + BE)
│           └── src/lib/
│               ├── index.ts
│               ├── blog/
│               ├── garden/
│               ├── portfolio/
│               ├── media/
│               └── common/
│
├── tools/                      # Custom Nx generators/executors
├── nx.json
├── package.json
└── tsconfig.base.json
```

**Structure Decision**: Nx monorepo with domain-driven frontend libraries and entity-folder pattern for backend. This follows the constitution's mandated architecture (Principle IV) and enables independent testing and deployment of features.

## Complexity Tracking

No constitution violations requiring justification. The architecture follows all mandated patterns.
