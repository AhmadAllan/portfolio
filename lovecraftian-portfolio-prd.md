# Lovecraftian Portfolio Platform
## Product Requirements Document (PRD) & Technical Architecture

**Version:** 1.0  
**Date:** January 22, 2026  
**Status:** Final Requirements

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Technical Architecture](#3-technical-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Models](#6-data-models)
7. [API Specification](#7-api-specification)
8. [UI/UX Requirements](#8-uiux-requirements)
9. [Internationalization (i18n)](#9-internationalization-i18n)
10. [Phase Breakdown](#10-phase-breakdown)
11. [Appendices](#11-appendices)

---

## 1. Executive Summary

### 1.1 Vision

A bilingual (Arabic/English) professional portfolio platform consisting of three interconnected sites unified by a Lovecraftian cosmic horror aesthetic. The platform serves as a comprehensive online presence combining a traditional portfolio/CV, a technical blog, and a digital garden for knowledge management.

### 1.2 Key Features

- **Landing Page**: Dramatic entry point with rain/thunder effects and Cthulhu canvas animation
- **Portfolio**: Online CV showcasing experience, projects, skills, and education
- **Blog**: Full-featured technical blog with series support, comments, and search
- **Digital Garden**: Wiki-style note collection with bidirectional links and maturity indicators
- **Dashboard**: Admin interface for content management across all three sites

### 1.3 Tech Stack

| Layer | Technology                                             |
|-------|--------------------------------------------------------|
| Frontend | Angular + with SSR (Angular Universal)                 |
| Backend | NestJS + with Drizzle ORM and JSend api specification  |
| Database | PostgreSQL                                             |
| Monorepo | Nx                                                     |
| Shared Types | TypeScript interfaces library                          |
| Styling | SCSS/Tailwind with custom Lovecraftian theme           |

---

## 2. Project Overview

### 2.1 Target Users

| User Type | Description |
|-----------|-------------|
| **Visitors** | Potential employers, clients, and peers viewing portfolio, reading blog posts, or exploring the digital garden |
| **Admin (You)** | Single authenticated user managing all content through the dashboard |
| **Future Users** | Architecture supports adding additional users with role-based access control (Phase 2) |

### 2.2 Site Structure

```
yourdomain.com/
├── /                    → Landing page (with effects)
├── /ar/                 → Arabic version prefix
├── /en/                 → English version prefix
├── /portfolio           → Portfolio/CV site
├── /blog                → Blog site
│   ├── /blog/:slug      → Individual post
│   ├── /blog?tag=x      → Tag filtering
│   └── /blog/series/:slug → Series landing page
├── /garden              → Digital garden
│   ├── /garden/:slug    → Individual note
│   └── /garden?tag=x    → Tag filtering
└── /dashboard           → Admin dashboard (protected)
```

### 2.3 URL Structure Decisions

| Aspect | Decision |
|--------|----------|
| Site organization | Subdirectory paths (not subdomains) |
| Language | Path prefix (`/ar/`, `/en/`) with browser detection, Arabic fallback |
| Blog URLs | Slug only (`/blog/my-post-title`) |
| Garden URLs | Slug only with query param filtering (`/garden/note-title?tag=x`) |
| Slugs | Always English, manually editable, auto-generated from title |

---

## 3. Technical Architecture

### 3.1 Nx Monorepo Structure

```
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
│   ├── web/                    # Frontend libraries
│   │   ├── landing/
│   │   │   └── feature/        # Landing page feature
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
│   │   │   ├── feature-graph/  # Phase 2
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
│   │   │   ├── data-access/
│   │   │   └── ui/
│   │   │
│   │   └── shared/
│   │       ├── data-access/    # HTTP client, auth service
│   │       ├── ui/             # Shared components
│   │       ├── ui-layout/      # Header, footer, RTL wrapper
│   │       ├── ui-effects/     # Rain, thunder, Cthulhu canvas
│   │       ├── util-i18n/      # Translation utilities
│   │       ├── util-formatting/ # Date/number formatting
│   │       ├── util-seo/       # Meta tags, OG images
│   │       └── util-markdown/  # Markdown processor
│   │
│   ├── api/                    # Backend libraries
│   │   ├── core/
│   │   │   └── src/lib/
│   │   │       ├── core.module.ts
│   │   │       ├── config/
│   │   │       ├── database/
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
│   │   │       │   ├── post.controller.ts
│   │   │       │   ├── post.service.ts
│   │   │       │   ├── post.entity.ts
│   │   │       │   └── dto/
│   │   │       ├── category/
│   │   │       │   ├── category.controller.ts
│   │   │       │   ├── category.service.ts
│   │   │       │   ├── category.entity.ts
│   │   │       │   └── dto/
│   │   │       ├── tag/
│   │   │       │   ├── tag.controller.ts
│   │   │       │   ├── tag.service.ts
│   │   │       │   ├── tag.entity.ts
│   │   │       │   └── dto/
│   │   │       └── series/
│   │   │           ├── series.controller.ts
│   │   │           ├── series.service.ts
│   │   │           ├── series.entity.ts
│   │   │           └── dto/
│   │   │
│   │   ├── garden/
│   │   │   └── src/lib/
│   │   │       ├── garden.module.ts
│   │   │       ├── note/
│   │   │       │   ├── note.controller.ts
│   │   │       │   ├── note.service.ts
│   │   │       │   ├── note.entity.ts
│   │   │       │   └── dto/
│   │   │       └── note-link/
│   │   │           ├── note-link.service.ts
│   │   │           └── note-link.entity.ts
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
│               │   ├── post.interface.ts
│               │   ├── category.interface.ts
│               │   ├── tag.interface.ts
│               │   └── series.interface.ts
│               ├── garden/
│               │   ├── note.interface.ts
│               │   └── note-link.interface.ts
│               ├── portfolio/
│               │   ├── project.interface.ts
│               │   ├── experience.interface.ts
│               │   ├── skill.interface.ts
│               │   └── about.interface.ts
│               ├── media/
│               │   ├── file.interface.ts
│               │   └── folder.interface.ts
│               └── common/
│                   ├── pagination.interface.ts
│                   └── api-response.interface.ts
│
├── tools/
├── nx.json
├── package.json
└── tsconfig.base.json
```

### 3.2 Nx Tags & Dependency Rules

**Tag Format:** `scope:SCOPE`, `type:TYPE`

```json
{
  "web-landing-feature": ["scope:web", "domain:landing", "type:feature"],
  "web-blog-feature-shell": ["scope:web", "domain:blog", "type:feature"],
  "web-blog-data-access": ["scope:web", "domain:blog", "type:data-access"],
  "web-blog-ui": ["scope:web", "domain:blog", "type:ui"],
  "web-shared-ui": ["scope:web", "domain:shared", "type:ui"],
  "api-core": ["scope:api", "type:core"],
  "api-blog": ["scope:api", "domain:blog", "type:feature"],
  "shared-types": ["scope:shared", "type:types"]
}
```

**Dependency Rules:**

| Library Type | Can Import |
|--------------|------------|
| `type:feature` | `type:data-access`, `type:ui`, `type:util` (same domain or shared) |
| `type:ui` | `type:util` only |
| `type:data-access` | `type:util`, `shared-types` |
| `type:util` | Other `type:util`, `shared-types` |
| `scope:api` | Cannot import `scope:web` |
| `scope:web` | Cannot import `scope:api` |
| Any domain | Can import `domain:shared` |
| `domain:shared` | Cannot import other domains |

### 3.3 Rendering Strategy

| Route | Rendering | Rationale |
|-------|-----------|-----------|
| Landing page | SSR | SEO, dramatic first load |
| Portfolio | SSR | SEO critical for professional presence |
| Blog | SSR | SEO critical for discoverability |
| Garden | SSR | SEO for indexing notes |
| Dashboard | CSR | No SEO needed, simpler auth handling |

### 3.4 Authentication Architecture

**Phase 1 (MVP):**
- Single user with credentials seeded in database
- JWT-based authentication with refresh tokens
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Tokens stored in HttpOnly cookies (secure)

**Phase 2:**
- Full RBAC with roles: `admin`, `editor`, `viewer`
- User management in dashboard

---

## 4. Functional Requirements

### 4.1 Landing Page

#### 4.1.1 Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| LP-01 | Hero Section | Dramatic introduction with animated Cthulhu canvas | P0 |
| LP-02 | Rain Effect | Canvas-based rain animation with configurable intensity | P0 |
| LP-03 | Thunder Effect | Visual screen flash/flicker effect (no audio) | P0 |
| LP-04 | Three Portals | Visual links to Portfolio, Blog, Garden sites | P0 |
| LP-05 | Brief Bio | Short "who you are" statement | P0 |
| LP-06 | Social Links | GitHub, LinkedIn, Twitter/X, etc. | P0 |
| LP-07 | Login Button | Navigate to dashboard login | P0 |
| LP-08 | Language Switcher | Toggle between Arabic/English | P0 |
| LP-09 | Latest Content Preview | Recent posts/notes cards | P2 |

#### 4.1.2 Effects Behavior

| Screen Size | Rain | Thunder | Cthulhu Canvas |
|-------------|------|---------|----------------|
| Desktop | Full effect | Full effect | Full animation |
| Tablet | Reduced particles | Full effect | Reduced animation |
| Mobile | Minimal/static | Subtle flash | Static image |

### 4.2 Portfolio Site

#### 4.2.1 Sections

| ID | Section | Fields | Priority |
|----|---------|--------|----------|
| PF-01 | Hero | Name, title, tagline, avatar | P0 |
| PF-02 | About | Bio text (Markdown supported) | P0 |
| PF-03 | Experience | Company, title, dates, location, type, logo, description | P0 |
| PF-04 | Projects | Title, description, thumbnail, tech stack, role, duration, links, detail page | P0 |
| PF-05 | Skills | Categorized list (Languages, Frameworks, Tools, etc.) | P0 |
| PF-06 | Education | Institution, degree, field, year (combined with certifications) | P0 |
| PF-07 | Contact | Email link, social links (no contact form) | P0 |

#### 4.2.2 Project Detail Page

| Field | Type | Required |
|-------|------|----------|
| Title | String | Yes |
| Slug | String | Yes |
| Description | Markdown | Yes |
| Thumbnail | Image | Yes |
| Gallery | Image[] | No |
| Tech Stack | String[] | Yes |
| Role | String | No |
| Duration | String | No |
| Team Size | Number | No |
| Challenges | Markdown | No |
| Live URL | URL | No |
| GitHub URL | URL | No |
| Display Order | Number | Yes |

### 4.3 Blog Site

#### 4.3.1 Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| BL-01 | Post Listing | Paginated list with filters | P0 |
| BL-02 | Single Post View | Full post with metadata | P0 |
| BL-03 | Categories | Hierarchical grouping | P0 |
| BL-04 | Tags | Flat labeling system | P0 |
| BL-05 | Reading Time | Auto-calculated from content | P0 |
| BL-06 | Search | PostgreSQL full-text search | P0 |
| BL-07 | Pagination | Numbered pages with limit selector | P0 |
| BL-08 | Series Support | Multi-part post collections | P0 |
| BL-09 | Related Posts | Auto + manual override, 3 posts | P0 |
| BL-10 | Comments | Hybrid moderation, honeypot + rate limiting | P0 |
| BL-11 | Reading Progress | Subtle top progress bar | P0 |
| BL-12 | Share Buttons | Twitter/X, LinkedIn, Copy link | P0 |
| BL-13 | TOC | Auto-generated from headings | P0 |

#### 4.3.2 Post Entity

| Field | Type | Required | Bilingual |
|-------|------|----------|-----------|
| id | ULID | Auto | No |
| title | String | Yes | Yes |
| slug | String | Yes | No (English only) |
| content | Markdown | Yes | Yes |
| excerpt | String | Yes | Yes |
| featuredImage | String | No | No |
| status | Enum | Yes | No |
| publishedAt | DateTime | No | No |
| readingTime | Number | Auto | No |
| categories | Relation[] | Yes | N/A |
| tags | Relation[] | No | N/A |
| series | Relation | No | N/A |
| seriesOrder | Number | No | No |
| relatedPosts | Relation[] | No | N/A |
| seoTitle | String | No | Yes |
| seoDescription | String | No | Yes |
| ogImage | String | No | No |
| createdAt | DateTime | Auto | No |
| updatedAt | DateTime | Auto | No |

#### 4.3.3 Comment System

**Moderation:** Hybrid (first-time commenters require approval, approved users auto-publish)

**Spam Prevention:**
- Honeypot fields (hidden inputs)
- Rate limiting per IP (5 comments/hour)

**Comment Fields:**
- Name (required)
- Email (required, not displayed)
- Website (optional)
- Content (required, Markdown subset)
- Parent comment ID (for replies)

#### 4.3.4 Series Feature

| Field | Type | Required | Bilingual |
|-------|------|----------|-----------|
| id | ULID | Auto | No |
| title | String | Yes | Yes |
| slug | String | Yes | No |
| description | Markdown | Yes | Yes |
| coverImage | String | No | No |
| posts | Relation[] | Yes | N/A |

**Display:**
- Series landing page with all posts listed in order
- In-post navigation: "Part X of Y" with prev/next links

### 4.4 Digital Garden

#### 4.4.1 Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| DG-01 | Note Listing | All notes with tag filtering | P0 |
| DG-02 | Single Note View | Full note with backlinks section | P0 |
| DG-03 | Tags | Flat tagging system | P0 |
| DG-04 | Maturity Indicator | Seedling → Budding → Evergreen | P0 |
| DG-05 | Wiki Links | `[[note-title]]` syntax parsing | P0 |
| DG-06 | Backlinks | "Notes that link here" section | P0 |
| DG-07 | Broken Link Styling | Dimmed/dashed links for non-existent notes | P0 |
| DG-08 | Search | PostgreSQL full-text search | P0 |
| DG-09 | Visual Knowledge Graph | Interactive node graph | P2 |

#### 4.4.2 Note Entity

| Field | Type | Required | Bilingual |
|-------|------|----------|-----------|
| id | ULID | Auto | No |
| title | String | Yes | Yes |
| slug | String | Yes | No |
| content | Markdown | Yes | Yes |
| maturity | Enum | Yes | No |
| tags | String[] | No | No |
| createdAt | DateTime | Auto | No |
| updatedAt | DateTime | Auto | No |

#### 4.4.3 Maturity Levels

| Level | Icon | Description |
|-------|------|-------------|
| Seedling | 🌱 | New, rough idea |
| Budding | 🌿 | Developing, needs work |
| Evergreen | 🌳 | Mature, well-developed |

#### 4.4.4 Bidirectional Links

**Syntax:** `[[note-slug]]` or `[[note-slug|display text]]`

**Processing:**
1. Parse content for `[[...]]` patterns
2. Extract target slug and optional display text
3. Look up target note in database
4. If exists: render as styled link
5. If not exists: render as dimmed placeholder link
6. Store link relationships for backlinks calculation

**Backlinks Display:**
- Section at bottom of each note
- List of notes that reference the current note
- Shows note title with link

### 4.5 Dashboard

#### 4.5.1 Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| DB-01 | Authentication | JWT login with refresh tokens | P0 |
| DB-02 | Post Management | CRUD for blog posts | P0 |
| DB-03 | Note Management | CRUD for garden notes | P0 |
| DB-04 | Portfolio Management | Edit all portfolio sections | P0 |
| DB-05 | Media Library | Upload, organize, delete images | P0 |
| DB-06 | Preview | Side-by-side Markdown preview | P0 |
| DB-07 | SEO Fields | Meta title, description, OG image | P0 |
| DB-08 | Broken Links Dashboard | List of broken wiki-links | P0 |
| DB-09 | Bilingual Editor | Edit AR/EN versions | P0 |
| DB-10 | Scheduled Publishing | Future publish dates | P2 |
| DB-11 | Analytics Overview | View counts, popular content | P2 |
| DB-12 | Bulk Actions | Multi-select delete/archive | P2 |
| DB-13 | Activity Log | Change history | P2 |

#### 4.5.2 Content Editor

**Layout:**
- Desktop: Side-by-side (editor left, preview right)
- Narrow screens: Toggle between edit/preview tabs

**Features:**
- Markdown toolbar (bold, italic, links, etc.)
- Image insertion from media library
- Auto-save drafts
- Keyboard shortcuts

#### 4.5.3 Media Library

**Organization:** Folder-based with extended metadata

**Metadata:**
- Filename
- Upload date
- File size
- Dimensions
- Alt text (editable)
- Caption (editable)
- Usage tracking (which content uses this image)

**Processing:**
- Auto-optimization on upload (compression, WebP conversion)
- Storage abstraction (local filesystem, S3-compatible)

### 4.6 Data Backup & Export

**Manual Export:** JSON/Markdown export from dashboard

**Content:**
- All posts (Markdown + metadata)
- All notes (Markdown + metadata)
- Portfolio data
- Media files

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Lighthouse Performance Score | > 90 |

### 5.2 SEO

| Requirement | Implementation |
|-------------|----------------|
| Server-side rendering | Angular Universal for all public pages |
| Meta tags | Dynamic per page (title, description, OG) |
| Sitemap | Auto-generated XML sitemap |
| Robots.txt | Properly configured |
| Canonical URLs | Set for all pages |
| Structured data | JSON-LD for posts, projects |
| hreflang | For Arabic/English versions |

### 5.3 Accessibility (WCAG AA)

| Requirement | Description |
|-------------|-------------|
| Color contrast | Minimum 4.5:1 for text, 3:1 for large text |
| Keyboard navigation | Full site navigable without mouse |
| Focus indicators | Visible focus states |
| Screen reader support | Proper ARIA labels and landmarks |
| Alt text | Required for all images |
| Skip links | Skip to main content |
| Form labels | All inputs properly labeled |

### 5.4 PWA Requirements

| Feature | Description |
|---------|-------------|
| Installable | Web app manifest with icons |
| Offline support | Pre-cache landing, portfolio, recent posts |
| Service worker | Cache-first for static assets |
| App shell | Core UI cached for instant load |
| Dashboard | Online-only (no offline editing) |

### 5.5 Security

| Requirement | Implementation |
|-------------|----------------|
| HTTPS | Required for all traffic |
| JWT security | HttpOnly cookies, secure flag |
| CSRF protection | Token-based for mutations |
| Input validation | Server-side validation with class-validator |
| SQL injection | Parameterized queries via Drizzle |
| XSS prevention | Content sanitization, CSP headers |
| Rate limiting | API rate limiting per IP |

### 5.6 Testing Strategy

**Scope:** Critical paths only (Phase 1)

| Area | Coverage |
|------|----------|
| Auth flows | Unit tests |
| Content CRUD | Unit tests |
| Wiki-link parser | Unit tests |
| API endpoints | Integration tests |

---

## 6. Data Models

### 6.1 Shared Interfaces

```typescript
// libs/shared/types/src/lib/common/pagination.interface.ts
export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

### 6.2 Blog Interfaces

```typescript
// libs/shared/types/src/lib/blog/post.interface.ts
export interface IPost {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  content: string;
  contentAr?: string;
  excerpt: string;
  excerptAr?: string;
  featuredImage?: string;
  status: PostStatus;
  publishedAt?: Date;
  readingTime: number;
  categories: ICategory[];
  tags: ITag[];
  series?: ISeries;
  seriesOrder?: number;
  relatedPosts?: IPostPreview[];
  seoTitle?: string;
  seoTitleAr?: string;
  seoDescription?: string;
  seoDescriptionAr?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostPreview {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  excerpt: string;
  excerptAr?: string;
  featuredImage?: string;
  publishedAt?: Date;
  readingTime: number;
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

// libs/shared/types/src/lib/blog/category.interface.ts
export interface ICategory {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  parentId?: string;
  postCount?: number;
}

// libs/shared/types/src/lib/blog/tag.interface.ts
export interface ITag {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  postCount?: number;
}

// libs/shared/types/src/lib/blog/series.interface.ts
export interface ISeries {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  coverImage?: string;
  posts: IPostPreview[];
  postCount: number;
}

// libs/shared/types/src/lib/blog/comment.interface.ts
export interface IComment {
  id: string;
  postId: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  content: string;
  status: CommentStatus;
  createdAt: Date;
  replies?: IComment[];
}

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SPAM = 'spam',
  DELETED = 'deleted',
}
```

### 6.3 Garden Interfaces

```typescript
// libs/shared/types/src/lib/garden/note.interface.ts
export interface INote {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  content: string;
  contentAr?: string;
  maturity: NoteMaturity;
  tags: string[];
  backlinks?: INoteLinkPreview[];
  forwardLinks?: INoteLinkPreview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface INoteLinkPreview {
  slug: string;
  title: string;
  titleAr?: string;
  maturity: NoteMaturity;
}

export enum NoteMaturity {
  SEEDLING = 'seedling',
  BUDDING = 'budding',
  EVERGREEN = 'evergreen',
}

// libs/shared/types/src/lib/garden/note-link.interface.ts
export interface INoteLink {
  id: string;
  sourceNoteId: string;
  targetNoteId?: string;
  targetSlug: string;
  displayText?: string;
  isBroken: boolean;
}
```

### 6.4 Portfolio Interfaces

```typescript
// libs/shared/types/src/lib/portfolio/project.interface.ts
export interface IProject {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  thumbnail: string;
  gallery?: string[];
  techStack: string[];
  role?: string;
  roleAr?: string;
  duration?: string;
  durationAr?: string;
  teamSize?: number;
  challenges?: string;
  challengesAr?: string;
  liveUrl?: string;
  githubUrl?: string;
  displayOrder: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// libs/shared/types/src/lib/portfolio/experience.interface.ts
export interface IExperience {
  id: string;
  company: string;
  companyAr?: string;
  logo?: string;
  title: string;
  titleAr?: string;
  location?: string;
  locationAr?: string;
  employmentType: EmploymentType;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  descriptionAr?: string;
  displayOrder: number;
}

export enum EmploymentType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

// libs/shared/types/src/lib/portfolio/skill.interface.ts
export interface ISkill {
  id: string;
  name: string;
  nameAr?: string;
  category: SkillCategory;
  icon?: string;
  displayOrder: number;
}

export enum SkillCategory {
  LANGUAGES = 'languages',
  FRAMEWORKS = 'frameworks',
  TOOLS = 'tools',
  DATABASES = 'databases',
  CLOUD = 'cloud',
  OTHER = 'other',
}

// libs/shared/types/src/lib/portfolio/education.interface.ts
export interface IEducation {
  id: string;
  institution: string;
  institutionAr?: string;
  degree: string;
  degreeAr?: string;
  field: string;
  fieldAr?: string;
  year: number;
  type: EducationType;
  displayOrder: number;
}

export enum EducationType {
  DEGREE = 'degree',
  CERTIFICATION = 'certification',
  COURSE = 'course',
}

// libs/shared/types/src/lib/portfolio/about.interface.ts
export interface IAbout {
  id: string;
  name: string;
  nameAr?: string;
  title: string;
  titleAr?: string;
  tagline: string;
  taglineAr?: string;
  bio: string;
  bioAr?: string;
  avatar?: string;
  email: string;
  socialLinks: ISocialLink[];
}

export interface ISocialLink {
  platform: SocialPlatform;
  url: string;
  displayOrder: number;
}

export enum SocialPlatform {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
  DEVTO = 'devto',
  MEDIUM = 'medium',
  WEBSITE = 'website',
}
```

### 6.5 Media Interfaces

```typescript
// libs/shared/types/src/lib/media/file.interface.ts
export interface IMediaFile {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  altTextAr?: string;
  caption?: string;
  captionAr?: string;
  folderId?: string;
  usageCount: number;
  createdAt: Date;
}

// libs/shared/types/src/lib/media/folder.interface.ts
export interface IMediaFolder {
  id: string;
  name: string;
  parentId?: string;
  fileCount: number;
  createdAt: Date;
}
```

---

## 7. API Specification

### 7.1 Base URL Structure

```
/api/v1/...          # Public API
/api/v1/admin/...    # Protected admin API
```

### 7.2 Public Endpoints

#### Blog

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | List published posts (paginated) |
| GET | `/posts/:slug` | Get single post by slug |
| GET | `/posts/featured` | Get featured posts |
| GET | `/categories` | List all categories |
| GET | `/categories/:slug` | Get category with posts |
| GET | `/tags` | List all tags |
| GET | `/tags/:slug` | Get tag with posts |
| GET | `/series` | List all series |
| GET | `/series/:slug` | Get series with posts |
| GET | `/search?q=` | Search posts |
| GET | `/posts/:slug/comments` | Get post comments |
| POST | `/posts/:slug/comments` | Create comment |

#### Garden

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | List all notes |
| GET | `/notes/:slug` | Get single note with backlinks |
| GET | `/notes/:slug/backlinks` | Get backlinks for note |
| GET | `/tags` | List all garden tags |
| GET | `/search?q=` | Search notes |
| GET | `/graph` | Get graph data (Phase 2) |

#### Portfolio

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/about` | Get about info |
| GET | `/experience` | List experiences |
| GET | `/projects` | List projects |
| GET | `/projects/:slug` | Get project detail |
| GET | `/skills` | List skills by category |
| GET | `/education` | List education/certifications |

### 7.3 Admin Endpoints

#### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Logout |

#### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts` | List all posts (any status) |
| GET | `/posts/:id` | Get post by ID |
| POST | `/posts` | Create post |
| PUT | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |
| PATCH | `/posts/:id/publish` | Publish post |
| PATCH | `/posts/:id/unpublish` | Unpublish post |

#### Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | List all notes |
| GET | `/notes/:id` | Get note by ID |
| POST | `/notes` | Create note |
| PUT | `/notes/:id` | Update note |
| DELETE | `/notes/:id` | Delete note |
| GET | `/notes/broken-links` | List broken wiki-links |

#### Portfolio

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/about` | Update about info |
| GET | `/experience` | List experiences |
| POST | `/experience` | Create experience |
| PUT | `/experience/:id` | Update experience |
| DELETE | `/experience/:id` | Delete experience |
| ... | ... | Similar for projects, skills, education |

#### Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/media` | List files (with folder filter) |
| POST | `/media/upload` | Upload file |
| PUT | `/media/:id` | Update metadata |
| DELETE | `/media/:id` | Delete file |
| GET | `/media/folders` | List folders |
| POST | `/media/folders` | Create folder |
| PUT | `/media/folders/:id` | Rename folder |
| DELETE | `/media/folders/:id` | Delete folder |

#### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments` | List pending comments |
| PATCH | `/comments/:id/approve` | Approve comment |
| PATCH | `/comments/:id/spam` | Mark as spam |
| DELETE | `/comments/:id` | Delete comment |

### 7.4 Query Parameters

**Pagination:**
```
?page=1&limit=10
```

**Filtering:**
```
?status=published
?category=backend
?tag=nestjs
?maturity=evergreen
```

**Sorting:**
```
?sort=publishedAt&order=desc
```

**Search:**
```
?q=search+term
```

**Language (for admin):**
```
?lang=ar|en
```

---

## 8. UI/UX Requirements

### 8.1 Visual Theme

#### Color Palette (Deep Ocean)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#0a0e14` | Main background |
| `--color-bg-secondary` | `#121820` | Card backgrounds |
| `--color-bg-tertiary` | `#1a2331` | Elevated surfaces |
| `--color-text-primary` | `#e6e8eb` | Main text |
| `--color-text-secondary` | `#8b949e` | Secondary text |
| `--color-accent-primary` | `#00d9c0` | Primary accent (cyan) |
| `--color-accent-secondary` | `#1fb88e` | Secondary accent (teal) |
| `--color-accent-glow` | `rgba(0, 217, 192, 0.3)` | Glow effects |
| `--color-danger` | `#f85149` | Errors, delete actions |
| `--color-warning` | `#d29922` | Warnings |
| `--color-success` | `#3fb950` | Success states |

#### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Primary Font | IBM Plex Arabic | - | - |
| H1 | IBM Plex Arabic | 2.5rem | 700 |
| H2 | IBM Plex Arabic | 2rem | 600 |
| H3 | IBM Plex Arabic | 1.5rem | 600 |
| Body | IBM Plex Arabic | 1rem | 400 |
| Code | IBM Plex Mono | 0.9rem | 400 |

### 8.2 Landing Page Effects

#### Rain Effect
- Canvas-based particle system
- Configurable particle count based on screen size
- Subtle parallax on mouse movement
- Performance-optimized with requestAnimationFrame

#### Thunder Effect
- Random interval (15-45 seconds)
- Quick white flash overlay (100-200ms)
- Optional Cthulhu canvas reaction
- Reduced/disabled on prefers-reduced-motion

#### Cthulhu Canvas
- Tentacle/silhouette animation
- Subtle idle movement
- Reacts to thunder flashes
- Optimized for performance

### 8.3 Markdown Rendering

#### Supported Features (MVP)

| Feature | Syntax |
|---------|--------|
| Syntax highlighting | ` ```language ``` ` |
| Callout/admonitions | `:::info`, `:::warning`, `:::tip` |
| Table of contents | Auto-generated from headings |
| Footnotes | `[^1]` |
| Embedded content | YouTube, CodePen, Gist |
| Image captions | `![alt](url "caption")` |

#### Code Block Theme

Custom dark theme matching site palette:
- Background: `#121820`
- Comments: `#6b737c`
- Keywords: `#00d9c0`
- Strings: `#a5d6ff`
- Functions: `#d2a8ff`
- Numbers: `#79c0ff`

#### Supported Languages

JavaScript, TypeScript, HTML, CSS, SCSS, SQL, Python, Bash, JSON, YAML, Java, C#, Go, Rust, PHP, Ruby, Docker, GraphQL

### 8.4 Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, hamburger menu |
| Tablet | 640px - 1024px | Two columns where applicable |
| Desktop | > 1024px | Full layout, side-by-side editor |

### 8.5 Error Pages

**Lovecraftian themed:**
- 404: "You've wandered into the void..." + search box + home link
- 500: "The Old Ones stir..." + retry button
- Offline: "The connection to R'lyeh is lost..." + cached content option

### 8.6 Empty States

**Themed messages:**
- No posts: "The archives hold no such knowledge..."
- No search results: "The stars reveal nothing..."
- No notes: "The garden awaits its first seed..."

---

## 9. Internationalization (i18n)

### 9.1 Languages

| Language | Code | Direction | Primary |
|----------|------|-----------|---------|
| Arabic | ar | RTL | Yes |
| English | en | LTR | No |

### 9.2 URL Structure

```
/ar/blog/post-slug    # Arabic version
/en/blog/post-slug    # English version
/blog/post-slug       # Redirects based on browser preference
```

### 9.3 Language Detection

1. Check URL prefix (`/ar/` or `/en/`)
2. If no prefix, check browser `Accept-Language` header
3. Default to Arabic if no match

### 9.4 Content Model

**Linked translations:**
- Single entity with paired AR/EN fields
- Content shows only in available language
- No fallback to other language

### 9.5 RTL Support

| Aspect | Implementation |
|--------|----------------|
| Layout direction | CSS `dir="rtl"` attribute |
| Flexbox/Grid | `flex-direction` auto-reverses |
| Margins/Padding | Use logical properties (`margin-inline-start`) |
| Icons | Mirror directional icons |
| Animations | Keep symmetrical |
| Code blocks | Always LTR |

### 9.6 Date & Number Formatting

| Type | Arabic | English |
|------|--------|---------|
| Dates | `22 يناير 2026` | `January 22, 2026` |
| Numbers | Western (`1`, `2`, `3`) | Western (`1`, `2`, `3`) |
| Reading time | `5 دقائق للقراءة` | `5 min read` |

### 9.7 Dashboard

- Bilingual interface with language switcher
- Side-by-side editing for AR/EN content
- Language preference saved in user settings

---

## 10. Phase Breakdown

### 10.1 Phase 1 (MVP)

**Landing Page:**
- [x] Hero with Cthulhu canvas
- [x] Rain effect
- [x] Thunder effect (visual only)
- [x] Three portals
- [x] Bio/tagline
- [x] Social links
- [x] Login button
- [x] Language switcher

**Portfolio:**
- [x] All 7 sections (Hero, About, Experience, Projects, Skills, Education, Contact)
- [x] Project detail pages
- [x] Bilingual content

**Blog:**
- [x] Post listing with pagination
- [x] Single post view
- [x] Categories and tags
- [x] Series support
- [x] Related posts
- [x] Comments with moderation
- [x] Search
- [x] Reading progress bar
- [x] Share buttons
- [x] Table of contents

**Digital Garden:**
- [x] Note listing
- [x] Single note view
- [x] Tags
- [x] Maturity indicators
- [x] Wiki-links with backlinks
- [x] Broken link styling
- [x] Search

**Dashboard:**
- [x] Authentication (single user)
- [x] CRUD for all content types
- [x] Media library with folders
- [x] Preview (side-by-side)
- [x] SEO fields
- [x] Broken links dashboard
- [x] Bilingual editing

**Technical:**
- [x] Angular SSR for public pages
- [x] NestJS API
- [x] PostgreSQL with Drizzle ORM
- [x] Nx monorepo with proper lib structure
- [x] Bilingual (AR/EN) with RTL
- [x] PWA (installable, offline reading)
- [x] WCAG AA accessibility
- [x] Swagger API docs
- [x] Unit tests for critical paths

### 10.2 Phase 2 (Future)

**Landing Page:**
- [ ] Latest content preview cards

**Digital Garden:**
- [ ] Visual knowledge graph

**Dashboard:**
- [ ] Scheduled publishing
- [ ] Analytics overview (Umami integration)
- [ ] Bulk actions
- [ ] Activity log
- [ ] Multi-user with RBAC

**Technical:**
- [ ] E2E tests
- [ ] Performance monitoring
- [ ] Error tracking

---

## 11. Appendices

### 11.1 Glossary

| Term | Definition |
|------|------------|
| **Digital Garden** | A collection of notes and ideas at various stages of development, linked together |
| **Wiki-link** | A link using `[[double bracket]]` syntax to connect notes |
| **Backlinks** | References showing which notes link to the current note |
| **Maturity** | The development stage of a garden note (Seedling → Budding → Evergreen) |
| **Series** | A collection of related blog posts meant to be read in sequence |
| **SSR** | Server-Side Rendering - generating HTML on the server |
| **CSR** | Client-Side Rendering - generating HTML in the browser |
| **RTL** | Right-to-Left text direction (for Arabic) |
| **LTR** | Left-to-Right text direction (for English) |

### 11.2 External Dependencies

| Package | Purpose | License |
|---------|---------|---------|
| Angular | Frontend framework | MIT |
| NestJS | Backend framework | MIT |
| Drizzle ORM | Database ORM | Apache 2.0 |
| Nx | Monorepo tooling | MIT |
| IBM Plex Arabic | Typography | OFL |
| Shiki/Prism | Syntax highlighting | MIT |
| Marked/Remark | Markdown parsing | MIT |

### 11.3 Reference Links

- [Nx Documentation](https://nx.dev/docs)
- [Angular Documentation](https://angular.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Document End**

*This PRD is a living document and will be updated as requirements evolve.*
