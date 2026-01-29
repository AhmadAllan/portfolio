# Data Model: Lovecraftian Portfolio Platform MVP

**Date**: 2026-01-28
**Feature**: 001-lovecraftian-portfolio-mvp

## Overview

This document defines all entities, their fields, relationships, and validation rules for the Lovecraftian Portfolio Platform MVP.

## Conventions

- **Primary Key**: ULID (26 characters, sortable, URL-safe)
- **Timestamps**: All tables include `created_at` and `updated_at`
- **Bilingual Fields**: Primary language (Arabic) uses base name, English uses `_en` suffix
- **Soft Delete**: Not implemented in MVP; hard delete with cascade

---

## Entity Relationship Diagram

```text
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │    Post     │────<│  Category   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │ │                   │
                          │ │     ┌─────────────┘
                          │ └────<│     Tag     │
                          │       └─────────────┘
                          │
                    ┌─────┴─────┐     ┌─────────────┐
                    │  Comment  │     │   Series    │
                    └───────────┘     └─────────────┘
                                            │
                                      ┌─────┴─────┐
                                      │   Post    │
                                      └───────────┘

┌─────────────┐     ┌─────────────┐
│    Note     │────<│  NoteLink   │
└─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   About     │     │ Experience  │     │   Project   │
└─────────────┘     └─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐
│   Skill     │     │  Education  │
└─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐
│ MediaFile   │────<│ MediaFolder │
└─────────────┘     └─────────────┘
```

---

## Entities

### 1. User

Single admin user for authentication (Phase 1).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| email | VARCHAR(255) | Yes | Unique email for login |
| passwordHash | VARCHAR(255) | Yes | Bcrypt hashed password |
| name | VARCHAR(100) | Yes | Display name |
| refreshToken | VARCHAR(255) | No | Current refresh token (hashed) |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Validation Rules:**
- Email must be valid format
- Password minimum 12 characters before hashing

**State Transitions:** None (static entity)

---

### 2. Post

Blog article with bilingual content.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| title | VARCHAR(255) | Yes | Arabic title |
| titleEn | VARCHAR(255) | No | English title |
| slug | VARCHAR(255) | Yes | URL slug (unique, English only) |
| content | TEXT | Yes | Arabic markdown content |
| contentEn | TEXT | No | English markdown content |
| excerpt | VARCHAR(500) | Yes | Arabic excerpt |
| excerptEn | VARCHAR(500) | No | English excerpt |
| featuredImage | VARCHAR(500) | No | URL to featured image |
| status | ENUM | Yes | draft, published, archived |
| publishedAt | TIMESTAMP | No | Publication date |
| readingTime | INTEGER | Auto | Minutes to read (calculated) |
| seriesId | ULID | No | FK to Series |
| seriesOrder | INTEGER | No | Position in series |
| seoTitle | VARCHAR(70) | No | Arabic SEO title |
| seoTitleEn | VARCHAR(70) | No | English SEO title |
| seoDescription | VARCHAR(160) | No | Arabic meta description |
| seoDescriptionEn | VARCHAR(160) | No | English meta description |
| ogImage | VARCHAR(500) | No | Open Graph image URL |
| searchVector | TSVECTOR | Auto | Full-text search index |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Relationships:**
- Many-to-Many with Category (via post_categories)
- Many-to-Many with Tag (via post_tags)
- Many-to-One with Series
- One-to-Many with Comment
- Many-to-Many with Post (related posts via post_related)

**Validation Rules:**
- Slug: lowercase, alphanumeric with hyphens, max 100 chars
- Excerpt: max 500 characters
- SEO title: max 70 characters
- SEO description: max 160 characters
- readingTime calculated as: ceil(wordCount / 200)

**State Transitions:**
- draft → published (requires publishedAt)
- published → draft
- published → archived
- draft → archived

---

### 3. Category

Hierarchical grouping for posts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| name | VARCHAR(100) | Yes | Arabic name |
| nameEn | VARCHAR(100) | No | English name |
| slug | VARCHAR(100) | Yes | URL slug (unique) |
| description | TEXT | No | Arabic description |
| descriptionEn | TEXT | No | English description |
| parentId | ULID | No | FK to parent Category |
| displayOrder | INTEGER | Yes | Sort order (default 0) |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Relationships:**
- Self-referential (parent-child hierarchy)
- Many-to-Many with Post

**Validation Rules:**
- Max hierarchy depth: 2 levels
- Slug unique within same parent

---

### 4. Tag

Flat labeling system for posts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| name | VARCHAR(50) | Yes | Arabic name |
| nameEn | VARCHAR(50) | No | English name |
| slug | VARCHAR(50) | Yes | URL slug (unique) |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Relationships:**
- Many-to-Many with Post

---

### 5. Series

Collection of related posts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| title | VARCHAR(255) | Yes | Arabic title |
| titleEn | VARCHAR(255) | No | English title |
| slug | VARCHAR(100) | Yes | URL slug (unique) |
| description | TEXT | Yes | Arabic description |
| descriptionEn | TEXT | No | English description |
| coverImage | VARCHAR(500) | No | Cover image URL |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Relationships:**
- One-to-Many with Post (ordered by seriesOrder)

---

### 6. Comment

User-submitted comment on posts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| postId | ULID | Yes | FK to Post |
| parentId | ULID | No | FK to parent Comment (for replies) |
| authorName | VARCHAR(100) | Yes | Commenter's name |
| authorEmail | VARCHAR(255) | Yes | Commenter's email (not displayed) |
| authorWebsite | VARCHAR(255) | No | Commenter's website |
| content | TEXT | Yes | Comment content (markdown subset) |
| status | ENUM | Yes | pending, approved, spam, deleted |
| ipAddress | VARCHAR(45) | Yes | IPv4 or IPv6 for rate limiting |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Relationships:**
- Many-to-One with Post
- Self-referential (parent-child for threading)

**Validation Rules:**
- authorName: 2-100 characters
- authorEmail: valid email format
- content: max 5000 characters, limited markdown (bold, italic, links, code)
- Max nesting depth: 2 levels

**State Transitions:**
- pending → approved (manual or auto if email previously approved)
- pending → spam
- approved → deleted
- spam → deleted

---

### 7. Note

Digital garden entry with wiki-links.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| title | VARCHAR(255) | Yes | Arabic title |
| titleEn | VARCHAR(255) | No | English title |
| slug | VARCHAR(255) | Yes | URL slug (unique) |
| content | TEXT | Yes | Arabic markdown with wiki-links |
| contentEn | TEXT | No | English markdown with wiki-links |
| maturity | ENUM | Yes | seedling, budding, evergreen |
| tags | VARCHAR[] | No | Array of tag slugs |
| searchVector | TSVECTOR | Auto | Full-text search index |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Relationships:**
- One-to-Many with NoteLink (as source)
- One-to-Many with NoteLink (as target, for backlinks)

**Validation Rules:**
- Slug: lowercase, alphanumeric with hyphens
- Tags: array of lowercase alphanumeric strings

---

### 8. NoteLink

Tracks wiki-link connections between notes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| sourceNoteId | ULID | Yes | FK to source Note |
| targetNoteId | ULID | No | FK to target Note (null if broken) |
| targetSlug | VARCHAR(255) | Yes | Target slug from wiki-link |
| displayText | VARCHAR(255) | No | Custom display text if provided |
| isBroken | BOOLEAN | Yes | True if target note doesn't exist |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Relationships:**
- Many-to-One with Note (source)
- Many-to-One with Note (target, nullable)

**Processing:**
- Extracted during note save by parsing `[[slug]]` and `[[slug|text]]` patterns
- isBroken set based on target note existence
- Re-evaluated when notes are created/deleted

---

### 9. Project

Portfolio project entry.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| title | VARCHAR(255) | Yes | Arabic title |
| titleEn | VARCHAR(255) | No | English title |
| slug | VARCHAR(100) | Yes | URL slug (unique) |
| description | TEXT | Yes | Arabic markdown description |
| descriptionEn | TEXT | No | English markdown description |
| thumbnail | VARCHAR(500) | Yes | Thumbnail image URL |
| gallery | VARCHAR[] | No | Array of image URLs |
| techStack | VARCHAR[] | Yes | Array of technology names |
| role | VARCHAR(100) | No | Arabic role description |
| roleEn | VARCHAR(100) | No | English role description |
| duration | VARCHAR(50) | No | Arabic duration string |
| durationEn | VARCHAR(50) | No | English duration string |
| teamSize | INTEGER | No | Number of team members |
| challenges | TEXT | No | Arabic challenges description |
| challengesEn | TEXT | No | English challenges description |
| liveUrl | VARCHAR(500) | No | Live project URL |
| githubUrl | VARCHAR(500) | No | GitHub repository URL |
| displayOrder | INTEGER | Yes | Sort order |
| featured | BOOLEAN | Yes | Show on landing page |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Validation Rules:**
- techStack: non-empty array
- displayOrder: non-negative integer
- URLs: valid URL format

---

### 10. Experience

Work history entry.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| company | VARCHAR(255) | Yes | Arabic company name |
| companyEn | VARCHAR(255) | No | English company name |
| logo | VARCHAR(500) | No | Company logo URL |
| title | VARCHAR(255) | Yes | Arabic job title |
| titleEn | VARCHAR(255) | No | English job title |
| location | VARCHAR(100) | No | Arabic location |
| locationEn | VARCHAR(100) | No | English location |
| employmentType | ENUM | Yes | full-time, part-time, contract, freelance, internship |
| startDate | DATE | Yes | Start date |
| endDate | DATE | No | End date (null if current) |
| current | BOOLEAN | Yes | Currently employed here |
| description | TEXT | Yes | Arabic description (markdown) |
| descriptionEn | TEXT | No | English description (markdown) |
| displayOrder | INTEGER | Yes | Sort order |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Validation Rules:**
- endDate must be after startDate if provided
- current=true implies endDate=null

---

### 11. Skill

Technical skill entry.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| name | VARCHAR(100) | Yes | Arabic skill name |
| nameEn | VARCHAR(100) | No | English skill name |
| category | ENUM | Yes | languages, frameworks, tools, databases, cloud, other |
| icon | VARCHAR(100) | No | Icon identifier (e.g., "devicon-angular") |
| displayOrder | INTEGER | Yes | Sort order within category |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

---

### 12. Education

Academic and certification entry.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| institution | VARCHAR(255) | Yes | Arabic institution name |
| institutionEn | VARCHAR(255) | No | English institution name |
| degree | VARCHAR(255) | Yes | Arabic degree/certification |
| degreeEn | VARCHAR(255) | No | English degree/certification |
| field | VARCHAR(255) | Yes | Arabic field of study |
| fieldEn | VARCHAR(255) | No | English field of study |
| year | INTEGER | Yes | Graduation/completion year |
| type | ENUM | Yes | degree, certification, course |
| displayOrder | INTEGER | Yes | Sort order |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

---

### 13. About

Profile information (singleton).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key (single record) |
| name | VARCHAR(100) | Yes | Arabic name |
| nameEn | VARCHAR(100) | No | English name |
| title | VARCHAR(255) | Yes | Arabic professional title |
| titleEn | VARCHAR(255) | No | English professional title |
| tagline | VARCHAR(255) | Yes | Arabic tagline |
| taglineEn | VARCHAR(255) | No | English tagline |
| bio | TEXT | Yes | Arabic bio (markdown) |
| bioEn | TEXT | No | English bio (markdown) |
| avatar | VARCHAR(500) | No | Avatar image URL |
| email | VARCHAR(255) | Yes | Contact email |
| socialLinks | JSONB | Yes | Array of social link objects |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**socialLinks Structure:**
```json
[
  { "platform": "github", "url": "https://github.com/...", "displayOrder": 1 },
  { "platform": "linkedin", "url": "https://linkedin.com/...", "displayOrder": 2 }
]
```

**Platforms:** github, linkedin, twitter, youtube, devto, medium, website

---

### 14. MediaFile

Uploaded file with metadata.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| filename | VARCHAR(255) | Yes | Stored filename (ULID-based) |
| originalFilename | VARCHAR(255) | Yes | Original upload filename |
| mimeType | VARCHAR(100) | Yes | File MIME type |
| size | INTEGER | Yes | File size in bytes |
| width | INTEGER | No | Image width (if applicable) |
| height | INTEGER | No | Image height (if applicable) |
| url | VARCHAR(500) | Yes | Public URL to file |
| thumbnailUrl | VARCHAR(500) | No | Thumbnail URL (for images) |
| altText | VARCHAR(255) | No | Arabic alt text |
| altTextEn | VARCHAR(255) | No | English alt text |
| caption | VARCHAR(500) | No | Arabic caption |
| captionEn | VARCHAR(500) | No | English caption |
| folderId | ULID | No | FK to MediaFolder |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Validation Rules:**
- size: max 10MB (10,485,760 bytes)
- mimeType: image/jpeg, image/png, image/gif, image/webp

---

### 15. MediaFolder

Organizational container for files.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | ULID | Auto | Primary key |
| name | VARCHAR(100) | Yes | Folder name |
| parentId | ULID | No | FK to parent MediaFolder |
| createdAt | TIMESTAMP | Auto | Creation timestamp |
| updatedAt | TIMESTAMP | Auto | Last update timestamp |

**Relationships:**
- Self-referential (parent-child hierarchy)
- One-to-Many with MediaFile

**Validation Rules:**
- Max nesting depth: 3 levels
- Name: alphanumeric with spaces and hyphens

---

## Junction Tables

### post_categories

| Field | Type | Description |
|-------|------|-------------|
| postId | ULID | FK to Post |
| categoryId | ULID | FK to Category |

Primary key: (postId, categoryId)

### post_tags

| Field | Type | Description |
|-------|------|-------------|
| postId | ULID | FK to Post |
| tagId | ULID | FK to Tag |

Primary key: (postId, tagId)

### post_related

| Field | Type | Description |
|-------|------|-------------|
| postId | ULID | FK to Post |
| relatedPostId | ULID | FK to related Post |
| displayOrder | INTEGER | Sort order |
| isManual | BOOLEAN | Manual override vs auto-suggested |

Primary key: (postId, relatedPostId)

---

## Indexes

### Performance Indexes

```sql
-- Posts
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_series ON posts(series_id, series_order);
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);

-- Notes
CREATE INDEX idx_notes_slug ON notes(slug);
CREATE INDEX idx_notes_maturity ON notes(maturity);
CREATE INDEX idx_notes_search ON notes USING GIN(search_vector);

-- Note Links
CREATE INDEX idx_note_links_source ON note_links(source_note_id);
CREATE INDEX idx_note_links_target ON note_links(target_note_id);
CREATE INDEX idx_note_links_broken ON note_links(is_broken) WHERE is_broken = true;

-- Comments
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_email ON comments(author_email);

-- Media
CREATE INDEX idx_media_folder ON media_files(folder_id);
```

---

## Data Volume Estimates

| Entity | Expected Records | Growth Rate |
|--------|-----------------|-------------|
| User | 1 | Static (Phase 1) |
| Post | 100-500 | 2-4/month |
| Category | 10-20 | Rare |
| Tag | 50-100 | Occasional |
| Series | 5-10 | Occasional |
| Comment | 500-2000 | Variable |
| Note | 200-1000 | 5-10/month |
| NoteLink | 1000-5000 | Proportional to notes |
| Project | 10-30 | Occasional |
| Experience | 5-15 | Occasional |
| Skill | 30-50 | Occasional |
| Education | 5-10 | Rare |
| About | 1 | Static |
| MediaFile | 500-2000 | Proportional to content |
| MediaFolder | 10-30 | Rare |
