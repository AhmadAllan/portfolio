# Research: Lovecraftian Portfolio Platform MVP

**Date**: 2026-01-28
**Feature**: 001-lovecraftian-portfolio-mvp

## Research Topics

This document consolidates findings for technology choices, patterns, and best practices for the Lovecraftian Portfolio Platform MVP.

---

## 1. Angular 19+ SSR with Nx

### Decision
Use Angular 19+ with built-in SSR (replacing Angular Universal) in an Nx monorepo structure.

### Rationale
- Angular 19 has native SSR support with improved hydration (no separate Universal package needed)
- Nx provides excellent Angular integration with generators for libraries and applications
- Domain-driven library structure enables code splitting and lazy loading per domain
- `@angular/ssr` package provides `provideServerRendering()` and `provideClientHydration()`

### Key Implementation Patterns
- Use `provideClientHydration()` in app config for hydration
- Configure `server.ts` with `CommonEngine` for SSR rendering
- Lazy load feature modules via routes for optimal bundle size
- Use `TransferState` for sharing data between server and client

### Alternatives Considered
- **Next.js**: Rejected due to constitution mandate for Angular
- **Analog.js**: Newer Angular meta-framework, but less mature ecosystem
- **Scully**: Static site generator, not suitable for dynamic content needs

---

## 2. NestJS with Drizzle ORM

### Decision
Use NestJS as the backend framework with Drizzle ORM for PostgreSQL database access.

### Rationale
- NestJS provides modular architecture that aligns with domain-driven design
- TypeScript-first with excellent decorator-based API design
- Drizzle offers type-safe queries with minimal runtime overhead
- Drizzle schema-first approach integrates well with shared types

### Key Implementation Patterns
- Entity-folder pattern: each entity has controller, service, entity, dto/ folder
- Use Drizzle's `pgTable` for schema definitions in `libs/api/core/src/lib/database/schema/`
- Implement JSend response interceptor globally
- Use `class-validator` and `class-transformer` for DTO validation

### Database Schema Conventions
```typescript
// Common fields for all tables
id: varchar('id', { length: 26 }).primaryKey(), // ULID
createdAt: timestamp('created_at').defaultNow().notNull(),
updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),

// Bilingual fields pattern
title: varchar('title', { length: 255 }).notNull(),      // Arabic (primary)
titleEn: varchar('title_en', { length: 255 }),           // English
```

### Alternatives Considered
- **Prisma**: More mature but generates heavier client, slower cold starts
- **TypeORM**: Active record pattern conflicts with clean architecture
- **MikroORM**: Excellent but smaller community than Drizzle

---

## 3. Bilingual/RTL Implementation

### Decision
Implement URL-based language routing with CSS logical properties for RTL support.

### Rationale
- URL prefixes (`/ar/`, `/en/`) provide SEO benefits and shareable language-specific links
- CSS logical properties (`margin-inline-start`) automatically flip for RTL
- Server-side language detection enables proper SSR for SEO crawlers

### Key Implementation Patterns

**Language Detection Flow:**
1. Check URL prefix (`/ar/` or `/en/`)
2. If no prefix, check `Accept-Language` header
3. Default to Arabic if no match

**i18n Structure:**
```text
apps/web/src/assets/i18n/
├── ar.json    # Arabic translations (primary)
└── en.json    # English translations
```

**RTL CSS Pattern:**
```scss
// Use logical properties
.card {
  margin-inline-start: 1rem;  // margin-left in LTR, margin-right in RTL
  padding-block: 1rem;        // padding-top and padding-bottom
  text-align: start;          // left in LTR, right in RTL
}

// Force LTR for code blocks
.code-block {
  direction: ltr;
  text-align: left;
}
```

**Date Formatting:**
```typescript
// Arabic: "22 يناير 2026"
new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })

// English: "January 22, 2026"
new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
```

### Alternatives Considered
- **Subdomain routing** (`ar.domain.com`): More complex infrastructure
- **Query parameter** (`?lang=ar`): Poor SEO, not shareable
- **Cookie-only**: No SEO benefit, requires JavaScript

---

## 4. JWT Authentication with HttpOnly Cookies

### Decision
Implement JWT-based authentication with tokens stored in HttpOnly cookies.

### Rationale
- HttpOnly cookies prevent XSS attacks from accessing tokens
- Automatic inclusion in requests simplifies frontend code
- Refresh token rotation provides session management

### Key Implementation Patterns

**Token Structure:**
- Access token: 15 minutes expiry, contains user ID and role
- Refresh token: 7 days expiry, stored in database for revocation

**Cookie Configuration:**
```typescript
{
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'strict',
  path: '/',
  maxAge: 15 * 60 * 1000 // 15 minutes for access token
}
```

**Refresh Flow:**
1. Access token expires
2. Frontend automatically calls `/api/v1/auth/refresh`
3. Backend validates refresh token, issues new access token
4. If refresh token expired, redirect to login

**CSRF Protection:**
- Use `csurf` middleware for mutation endpoints
- Include CSRF token in meta tag for SSR pages
- Validate on POST, PUT, PATCH, DELETE requests

### Alternatives Considered
- **localStorage**: Vulnerable to XSS attacks
- **Session-based**: Requires sticky sessions, harder to scale
- **OAuth2 with external provider**: Overkill for single-user system

---

## 5. Markdown Processing with Wiki-Links

### Decision
Use `marked` with custom extensions for markdown processing, including wiki-link syntax.

### Rationale
- `marked` is fast and extensible with custom tokenizers
- Custom extension handles `[[slug]]` and `[[slug|display text]]` syntax
- Server-side processing ensures consistent rendering

### Key Implementation Patterns

**Wiki-Link Parser:**
```typescript
const wikiLinkExtension = {
  name: 'wikilink',
  level: 'inline',
  start(src: string) { return src.indexOf('[['); },
  tokenizer(src: string) {
    const match = /^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/.exec(src);
    if (match) {
      return {
        type: 'wikilink',
        raw: match[0],
        slug: match[1].trim(),
        displayText: match[2]?.trim() || match[1].trim()
      };
    }
  },
  renderer(token: WikiLinkToken) {
    const exists = checkNoteExists(token.slug); // Lookup in DB
    const className = exists ? 'wiki-link' : 'wiki-link wiki-link--broken';
    return `<a href="/garden/${token.slug}" class="${className}">${token.displayText}</a>`;
  }
};
```

**Syntax Highlighting:**
- Use `shiki` for server-side syntax highlighting
- Custom theme matching Lovecraftian color palette
- Pre-render code blocks during markdown processing

**Supported Markdown Extensions:**
- Code blocks with syntax highlighting
- Callouts/admonitions (`::: info`, `::: warning`, `::: tip`)
- Footnotes (`[^1]`)
- Tables (GFM)
- Image captions

### Alternatives Considered
- **remark/rehype**: More flexible but heavier ecosystem
- **markdown-it**: Good alternative, slightly less performant
- **MDX**: Overkill for content that doesn't need React components

---

## 6. Canvas Effects (Cthulhu, Rain, Thunder)

### Decision
Implement canvas-based effects using vanilla TypeScript with requestAnimationFrame.

### Rationale
- Canvas provides best performance for particle systems
- No dependency on heavy animation libraries
- Can be progressively disabled based on device capability

### Key Implementation Patterns

**Performance Optimization:**
```typescript
// Adaptive particle count based on screen size
const getParticleCount = () => {
  if (window.innerWidth < 640) return 50;   // Mobile: minimal
  if (window.innerWidth < 1024) return 150; // Tablet: reduced
  return 300; // Desktop: full effect
};

// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Show static image instead
}
```

**Rain Effect Structure:**
```typescript
interface RainDrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

class RainEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private drops: RainDrop[] = [];
  private animationId: number | null = null;

  start() { /* requestAnimationFrame loop */ }
  stop() { /* cancelAnimationFrame */ }
  resize() { /* handle window resize */ }
}
```

**Thunder Effect:**
- Random interval: 15-45 seconds
- Quick white flash overlay (100-200ms)
- CSS animation on overlay div, not canvas

### Alternatives Considered
- **Three.js**: Overkill for 2D particle effects
- **PixiJS**: Good but adds significant bundle size
- **CSS animations**: Not suitable for particle systems
- **Lottie**: Good for complex animations, but custom effects needed

---

## 7. Media Upload and Optimization

### Decision
Store media on local filesystem with Sharp for image optimization.

### Rationale
- Local storage simplifies MVP deployment
- Sharp provides excellent image processing performance
- WebP conversion reduces file sizes significantly

### Key Implementation Patterns

**Upload Flow:**
1. Validate file type and size (10MB max)
2. Generate unique filename (ULID-based)
3. Process with Sharp: resize, compress, convert to WebP
4. Generate thumbnail (300px width)
5. Store original and optimized versions
6. Save metadata to database

**File Structure:**
```text
uploads/
├── images/
│   ├── 01HQXYZ.../          # ULID folder
│   │   ├── original.jpg
│   │   ├── optimized.webp
│   │   └── thumbnail.webp
```

**Sharp Configuration:**
```typescript
await sharp(buffer)
  .resize(1920, null, { withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile(outputPath);
```

### Alternatives Considered
- **S3/Cloud storage**: Adds complexity, consider for Phase 2
- **Cloudinary**: External dependency, cost considerations
- **imgproxy**: Separate service, adds infrastructure complexity

---

## 8. Full-Text Search with PostgreSQL

### Decision
Use PostgreSQL's built-in full-text search with `tsvector` and `tsquery`.

### Rationale
- No additional search service needed
- Built-in Arabic language support with stemming
- Sufficient for expected content volume (~1000 posts/notes)

### Key Implementation Patterns

**Schema Setup:**
```sql
-- Add search vector column
ALTER TABLE blog_posts ADD COLUMN search_vector tsvector;

-- Create GIN index for fast searching
CREATE INDEX posts_search_idx ON blog_posts USING GIN(search_vector);

-- Update trigger for automatic indexing
CREATE TRIGGER posts_search_update
BEFORE INSERT OR UPDATE ON blog_posts
FOR EACH ROW EXECUTE FUNCTION
  tsvector_update_trigger(search_vector, 'pg_catalog.arabic', title, content);
```

**Search Query:**
```typescript
const results = await db.execute(sql`
  SELECT *, ts_rank(search_vector, to_tsquery('arabic', ${query})) AS rank
  FROM blog_posts
  WHERE search_vector @@ to_tsquery('arabic', ${query})
  ORDER BY rank DESC
  LIMIT ${limit}
`);
```

### Alternatives Considered
- **Elasticsearch**: Overkill for expected scale, adds infrastructure
- **Meilisearch**: Good alternative for larger scale
- **Algolia**: External dependency, cost considerations

---

## 9. PWA Implementation

### Decision
Implement PWA with Workbox for service worker management.

### Rationale
- Workbox simplifies service worker configuration
- Cache-first strategy for static assets
- Network-first for API calls with offline fallback

### Key Implementation Patterns

**Caching Strategy:**
```typescript
// Static assets: Cache-first
registerRoute(
  ({ request }) => request.destination === 'style' ||
                   request.destination === 'script' ||
                   request.destination === 'image',
  new CacheFirst({ cacheName: 'static-assets' })
);

// API calls: Network-first with offline fallback
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({ cacheName: 'api-cache' })
);

// HTML pages: Stale-while-revalidate
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new StaleWhileRevalidate({ cacheName: 'pages-cache' })
);
```

**Offline Support:**
- Pre-cache landing page, portfolio, and app shell
- Cache recently viewed blog posts
- Show offline page when network unavailable
- Dashboard requires online (no offline editing)

### Alternatives Considered
- **Manual service worker**: More control but more maintenance
- **sw-precache**: Deprecated in favor of Workbox
- **No PWA**: Reduced user experience on mobile

---

## 10. Testing Strategy

### Decision
Focus on unit tests for critical paths with Jest, defer E2E to Phase 2.

### Rationale
- Constitution mandates testing for critical paths
- Jest integrates well with Nx and both Angular/NestJS
- Unit tests provide fast feedback during development

### Key Testing Areas

**Backend Critical Paths:**
- Auth service (login, refresh, logout)
- Post CRUD operations
- Note CRUD with wiki-link parsing
- Comment moderation flow

**Frontend Critical Paths:**
- Wiki-link parser utility
- i18n service
- Auth interceptor
- Markdown renderer

**Test File Convention:**
```text
post.service.ts
post.service.spec.ts  # Co-located test file
```

**Minimum Coverage:**
- Critical modules: 80%
- Non-critical: Best effort

### Alternatives Considered
- **Vitest**: Faster but less mature Angular support
- **Cypress**: Excellent E2E but deferred to Phase 2
- **Testing Library**: Used for component tests in Angular

---

## Summary

All technical decisions align with the project constitution and support the MVP requirements. Key themes:

1. **Simplicity**: Choose built-in solutions where possible (PostgreSQL search, local filesystem)
2. **Performance**: SSR, image optimization, adaptive effects
3. **Type Safety**: Drizzle ORM, shared interfaces, strict TypeScript
4. **Security**: HttpOnly cookies, CSRF protection, input validation
5. **Bilingual**: URL-based routing, CSS logical properties, proper date formatting

No unresolved NEEDS CLARIFICATION items remain.
