# Project Constitution
## Lovecraftian Portfolio Platform

---

## 1. Project Identity

### 1.1 Project Name
**Lovecraftian Portfolio Platform** (working title: `eldritch-portfolio`)

### 1.2 Project Vision
A bilingual (Arabic/English) professional portfolio platform consisting of three interconnected sites—Portfolio, Blog, and Digital Garden—unified by a cosmic horror aesthetic inspired by H.P. Lovecraft's works. The platform serves as a comprehensive online presence that showcases professional work while providing a unique, memorable user experience.

### 1.3 Core Values
- **Quality over Speed**: No deadlines; focus on clean, maintainable code
- **Bilingual First**: Arabic as primary language with full RTL support
- **Accessibility**: WCAG AA compliance is non-negotiable
- **Performance**: Fast, responsive experience across all devices
- **Consistency**: Unified design language and code patterns across all sites

---

## 2. Technical Constitution

### 2.1 Technology Stack

| Layer | Technology | Version | Non-Negotiable |
|-------|------------|---------|----------------|
| Monorepo | Nx | Latest | ✅ |
| Frontend | Angular | 19+ | ✅ |
| Backend | NestJS | Latest | ✅ |
| Database | PostgreSQL | 15+ | ✅ |
| ORM | Drizzle | Latest | ✅ |
| Language | TypeScript | 5.x | ✅ |
| Styling | SCSS + Tailwind | - | Preferred |
| Package Manager | pnpm | Latest | Preferred |

### 2.2 Architectural Principles

#### 2.2.1 Monorepo Structure
```
workspace/
├── apps/
│   ├── web/          # Angular SSR application
│   └── api/          # NestJS application
├── libs/
│   ├── web/          # Frontend libraries (domain-driven)
│   ├── api/          # Backend libraries (entity-folder pattern)
│   └── shared/       # Shared code (types, utils)
└── tools/            # Custom tooling
```

#### 2.2.2 Frontend Library Organization (Domain-Driven)
```
libs/web/{domain}/
├── feature-*/        # Smart components with routing
├── ui/               # Presentational components
├── data-access/      # API services, state management
└── util-*/           # Pure utility functions
```

#### 2.2.3 Backend Library Organization (Entity-Folder Pattern)
```
libs/api/{domain}/src/lib/
├── {domain}.module.ts
└── {entity}/
    ├── {entity}.controller.ts
    ├── {entity}.service.ts
    ├── {entity}.entity.ts
    └── dto/
        ├── create-{entity}.dto.ts
        ├── update-{entity}.dto.ts
        └── query-{entity}.dto.ts
```

#### 2.2.4 Shared Types
- All interfaces shared between frontend and backend live in `libs/shared/types`
- Entities implement these interfaces
- DTOs reference these interfaces
- Never duplicate type definitions

### 2.3 Code Standards

#### 2.3.1 Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `post.service.ts` |
| Classes | PascalCase | `PostService` |
| Interfaces | PascalCase with `I` prefix | `IPost` |
| Enums | PascalCase | `PostStatus` |
| Functions | camelCase | `findBySlug()` |
| Variables | camelCase | `postCount` |
| Constants | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| CSS Classes | kebab-case | `post-card` |
| Database Tables | snake_case (plural) | `blog_posts` |
| Database Columns | snake_case | `created_at` |

#### 2.3.2 File Organization
- One class/component per file
- Related files grouped in folders
- Index files (`index.ts`) for public exports only
- No barrel files that re-export everything

#### 2.3.3 Import Order
```typescript
// 1. Angular/NestJS core
import { Component } from '@angular/core';

// 2. Third-party libraries
import { Observable } from 'rxjs';

// 3. Workspace libraries (absolute paths)
import { IPost } from '@workspace/shared/types';

// 4. Relative imports
import { PostCardComponent } from './post-card.component';
```

### 2.4 Dependency Rules

#### 2.4.1 Library Dependencies
| Library Type | Can Import |
|--------------|------------|
| `feature` | `data-access`, `ui`, `util`, `shared` |
| `ui` | `util`, `shared/types` only |
| `data-access` | `util`, `shared/types` only |
| `util` | `shared/types` only |

#### 2.4.2 Scope Dependencies
- `scope:web` cannot import `scope:api`
- `scope:api` cannot import `scope:web`
- Any scope can import `scope:shared`
- Domain libraries can import `domain:shared`
- Domain libraries cannot import other domains

#### 2.4.3 Nx Tags
```json
{
  "tags": ["scope:web|api|shared", "domain:blog|garden|portfolio|dashboard|shared", "type:feature|ui|data-access|util|core"]
}
```

### 2.5 API Design

#### 2.5.1 REST Conventions
- Use plural nouns for resources: `/posts`, `/notes`
- Use HTTP methods correctly: GET (read), POST (create), PUT (update), DELETE (remove), PATCH (partial update)
- Use query params for filtering: `?status=published&tag=nestjs`
- Use path params for identification: `/posts/:slug`
- Return consistent response structure

#### 2.5.2 Response Format (JSend Specification)

Following the [JSend specification](https://github.com/omniti-labs/jsend) for consistent API responses.

```typescript
// Success - All went well, data is returned
{
  "status": "success",
  "data": { 
    "post": { ... }
  }
}

// Success - Paginated
{
  "status": "success",
  "data": {
    "posts": [...],
    "meta": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}

// Fail - Problem with data submitted (validation errors, etc.)
{
  "status": "fail",
  "data": {
    "title": "Title is required",
    "slug": "Slug already exists"
  }
}

// Error - Server error, something went wrong
{
  "status": "error",
  "message": "Unable to connect to database",
  "code": "DB_CONNECTION_ERROR",  // Optional
  "data": { ... }                  // Optional additional info
}
```

**Status Types:**
| Status | Description | Required Fields |
|--------|-------------|-----------------|
| `success` | Request successful | `status`, `data` |
| `fail` | Client error (validation, not found) | `status`, `data` |
| `error` | Server error | `status`, `message` |

#### 2.5.3 Versioning
- API version in URL: `/api/v1/...`
- No breaking changes within a version

### 2.6 Database Conventions

#### 2.6.1 Drizzle Schema
- Define schemas in `libs/api/core/src/lib/database/schema/`
- One file per domain: `blog.schema.ts`, `garden.schema.ts`
- Use Drizzle's type-safe query builder
- Migrations managed via Drizzle Kit

#### 2.6.2 Common Fields
Every table should include:
```typescript
id: ulid('id').primaryKey().defaultRandom(),
createdAt: timestamp('created_at').defaultNow().notNull(),
updatedAt: timestamp('updated_at').defaultNow().notNull(),
```

#### 2.6.3 Bilingual Fields
For translatable content:
```typescript
title: varchar('title', { length: 255 }).notNull(),      // Default/Arabic
titleEn: varchar('title_en', { length: 255 }),           // English
```

### 2.7 Testing Standards

#### 2.7.1 Testing Strategy (Phase 1)
- Unit tests for critical paths only
- Focus areas: Auth, Content CRUD, Wiki-link parser
- Use Jest for all tests
- Minimum coverage for critical modules: 80%

#### 2.7.2 Test File Location
- Co-located with source: `post.service.spec.ts` next to `post.service.ts`
- E2E tests in `apps/*/e2e/`

#### 2.7.3 Test Naming
```typescript
describe('PostService', () => {
  describe('findBySlug', () => {
    it('should return post when slug exists', () => {});
    it('should throw NotFoundException when slug not found', () => {});
  });
});
```

---

## 3. Development Guidelines

### 3.1 Git Conventions

#### 3.1.1 Branch Naming
```
feature/{domain}-{description}    # feature/blog-add-series-support
bugfix/{domain}-{description}     # bugfix/garden-fix-broken-links
refactor/{description}            # refactor/improve-auth-flow
docs/{description}                # docs/update-readme
```

#### 3.1.2 Commit Messages
Follow Conventional Commits:
```
type(scope): description

feat(blog): add series landing page
fix(garden): resolve broken backlinks calculation
refactor(api): simplify auth guard logic
docs(readme): add setup instructions
chore(deps): update Angular to v19
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

#### 3.1.3 Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch (optional)
- Feature branches from `main`, merge via PR

### 3.2 Code Review Checklist
- [ ] Follows naming conventions
- [ ] No console.logs or debugger statements
- [ ] Proper error handling
- [ ] Types defined (no `any`)
- [ ] Accessibility considered
- [ ] RTL/i18n considered
- [ ] Tests added/updated for critical paths
- [ ] No hardcoded strings (use i18n)

### 3.3 Documentation Requirements
- README.md in workspace root with setup instructions
- Inline comments for complex logic only
- JSDoc for public API methods
- Swagger decorators for all API endpoints

---

## 4. Feature Development Guidelines

### 4.1 Adding a New Feature

1. **Define interfaces** in `libs/shared/types`
2. **Create backend**:
  - Add entity folder in appropriate domain library
  - Create entity, service, controller, DTOs
  - Register in domain module
  - Add Swagger documentation
3. **Create frontend**:
  - Add data-access service if needed
  - Create feature library with routing
  - Create UI components
4. **Add translations** for AR/EN
5. **Test critical paths**
6. **Update documentation** if needed

### 4.2 Adding a New API Endpoint

```typescript
// 1. Define DTO
export class CreatePostDto {
  @ApiProperty({ description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  title: string;
}

// 2. Add service method
async create(dto: CreatePostDto): Promise<IPost> {
  // Implementation
}

// 3. Add controller endpoint
@Post()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Create new post' })
@ApiCreatedResponse({ type: PostResponseDto })
create(@Body() dto: CreatePostDto) {
  return this.postService.create(dto);
}
```

### 4.3 Adding a New UI Component

```typescript
// 1. Create in appropriate ui library
// libs/web/blog/ui/src/lib/post-card/

// 2. Keep presentational (no service injection)
@Component({
  selector: 'blog-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostCardComponent {
  @Input({ required: true }) post!: IPostPreview;
  @Output() clicked = new EventEmitter<string>();
}

// 3. Export from library index
```

### 4.4 Internationalization (i18n)

#### 4.4.1 Translation Files
```
apps/web/src/assets/i18n/
├── ar.json
└── en.json
```

#### 4.4.2 Translation Keys
```json
{
  "blog": {
    "title": "المدونة",
    "readMore": "اقرأ المزيد",
    "minRead": "{{ minutes }} دقائق للقراءة"
  }
}
```

#### 4.4.3 Usage
```html
<h1>{{ 'blog.title' | translate }}</h1>
<span>{{ 'blog.minRead' | translate:{ minutes: post.readingTime } }}</span>
```

### 4.5 RTL Considerations

- Use CSS logical properties: `margin-inline-start` not `margin-left`
- Use `dir` attribute for direction changes
- Test all layouts in both directions
- Keep code blocks LTR always
- Mirror directional icons

---

## 5. Quality Gates

### 5.1 Pre-Commit Checks
- Linting (ESLint)
- Formatting (Prettier)
- Type checking (TypeScript)
- Affected tests pass

### 5.2 Pre-Merge Checks
- All CI checks pass
- Code review approved
- No merge conflicts
- Branch is up to date with main
- Use semantic-release after merge is done

### 5.3 Definition of Done
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

---

## 6. Security Guidelines

### 6.1 Authentication
- JWT tokens in HttpOnly cookies only
- Access token: 15 min expiry
- Refresh token: 7 days expiry
- CSRF protection for mutations

### 6.2 Input Validation
- Validate all inputs server-side (class-validator)
- Sanitize HTML content before storage
- Use parameterized queries (Drizzle handles this)

### 6.3 Sensitive Data
- Never log passwords or tokens
- Never expose internal errors to clients
- Environment variables for secrets
- No secrets in code or version control

---

## 7. Performance Guidelines

### 7.1 Frontend
- Lazy load feature modules
- Use `OnPush` change detection
- Optimize images (WebP, responsive sizes)
- Minimize bundle size
- Use trackBy in ngFor

### 7.2 Backend
- Use pagination for list endpoints
- Index frequently queried columns
- Cache expensive queries where appropriate
- Use connection pooling

### 7.3 Targets
| Metric | Target |
|--------|--------|
| FCP | < 1.5s |
| LCP | < 2.5s |
| TTI | < 3.5s |
| CLS | < 0.1 |
| Lighthouse | > 90 |

---

## 8. AI Assistant Guidelines

### 8.1 When Generating Code
- Follow all conventions in this constitution
- Use TypeScript strict mode patterns
- Prefer composition over inheritance
- Keep functions small and focused
- Add JSDoc for public methods
- Use descriptive variable names

### 8.2 When Making Decisions
- Refer to this constitution first
- Prioritize maintainability
- Consider bilingual/RTL implications
- Consider accessibility implications
- Ask for clarification if requirements conflict

### 8.3 When Suggesting Changes
- Explain the reasoning
- Consider impact on existing code
- Propose migrations if needed
- Highlight breaking changes

### 8.4 Forbidden Patterns
- ❌ Using `any` type
- ❌ Using `@ts-ignore` or `@ts-nocheck`
- ❌ Hardcoded strings (use i18n)
- ❌ Direct DOM manipulation in Angular
- ❌ Console.log in production code
- ❌ Synchronous file operations
- ❌ SQL string concatenation
- ❌ Storing secrets in code

---

## 9. Amendments

This constitution may be amended as the project evolves. All changes should be:
1. Documented with date and reason
2. Applied consistently across the codebase
3. Communicated to all AI assistants via updated constitution

### Amendment Log

| Date | Section | Change | Reason |
|------|---------|--------|--------|
| 2026-01-22 | Initial | Created constitution | Project kickoff |

---

**End of Constitution**
