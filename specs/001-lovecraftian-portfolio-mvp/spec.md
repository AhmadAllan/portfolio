# Feature Specification: Lovecraftian Portfolio Platform MVP

**Feature Branch**: `001-lovecraftian-portfolio-mvp`
**Created**: 2026-01-28
**Status**: Draft
**Input**: User description: "plan the process to build the app using lovecraftian-portfolio-prd.md for the requirements and structure and constitution"

## Clarifications

### Session 2026-01-28

- Q: Where should media files be stored? → A: Local filesystem (server disk, served directly or via reverse proxy)
- Q: How should initial content be handled for deployment? → A: Seed scripts with sample content (demo posts, portfolio entries) for dev/testing
- Q: What is the maximum upload file size? → A: 10MB maximum per file

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Portfolio as Visitor (Priority: P1)

A potential employer or client visits the portfolio site to learn about the developer's professional background, skills, and projects. They navigate through the hero section, read the bio, explore work experience, view project details, check technical skills, and find contact information.

**Why this priority**: The portfolio is the core professional presence and primary conversion point. Without it, the platform has no business value.

**Independent Test**: Can be tested by navigating to the portfolio URL and verifying all 7 sections (Hero, About, Experience, Projects, Skills, Education, Contact) display correctly with sample data in both Arabic and English.

**Acceptance Scenarios**:

1. **Given** I am a visitor on the landing page, **When** I click the Portfolio portal, **Then** I am navigated to the portfolio site showing the hero section with name, title, and avatar
2. **Given** I am viewing the portfolio, **When** I scroll through the page, **Then** I see all sections (About, Experience, Projects, Skills, Education, Contact) in order
3. **Given** I am viewing projects, **When** I click on a project card, **Then** I am taken to a detailed project page showing description, tech stack, role, gallery, and external links
4. **Given** I am viewing the portfolio in Arabic, **When** I switch to English using the language toggle, **Then** all content updates to English and the layout switches from RTL to LTR

---

### User Story 2 - Experience Landing Page with Cosmic Horror Aesthetic (Priority: P1)

A visitor arrives at the main domain and experiences the dramatic landing page with Lovecraftian effects including animated Cthulhu canvas, rain particles, and thunder flashes. They see three portals (Portfolio, Blog, Garden) and can navigate to any site.

**Why this priority**: The landing page is the first impression and brand differentiator. It establishes the unique identity and guides visitors to the three sites.

**Independent Test**: Can be tested by loading the landing page and verifying visual effects render, three portal links are functional, and the page adapts to different screen sizes.

**Acceptance Scenarios**:

1. **Given** I visit the root domain, **When** the page loads, **Then** I see the animated Cthulhu canvas in the hero section
2. **Given** I am on the landing page, **When** I observe the page for 15-45 seconds, **Then** I see a visual thunder flash effect
3. **Given** I am on the landing page, **When** I hover over the three portals, **Then** they display interactive hover effects indicating they are clickable
4. **Given** I am on mobile, **When** I view the landing page, **Then** effects are reduced for performance (static image instead of canvas animation)

---

### User Story 3 - Read Blog Posts (Priority: P1)

A visitor browses the technical blog, discovers posts through listing, tags, categories, or search, reads full articles with code syntax highlighting, and engages via comments.

**Why this priority**: The blog establishes thought leadership and is critical for SEO and professional visibility.

**Independent Test**: Can be tested by creating a sample post and verifying the listing displays it, the post page renders markdown correctly with syntax highlighting, and search/filter works.

**Acceptance Scenarios**:

1. **Given** I am on the blog listing page, **When** published posts exist, **Then** I see paginated post cards with title, excerpt, reading time, and featured image
2. **Given** I am on a blog post, **When** the content includes code blocks, **Then** syntax highlighting is applied with the custom dark theme
3. **Given** I am reading a post, **When** I scroll down, **Then** I see a reading progress bar at the top indicating my progress
4. **Given** I am on a post, **When** I want to share, **Then** I can use share buttons for Twitter/X, LinkedIn, or copy the link
5. **Given** I am on a post in a series, **When** I view the series navigation, **Then** I see "Part X of Y" with previous/next links

---

### User Story 4 - Explore Digital Garden (Priority: P2)

A visitor explores the digital garden to discover interconnected notes on various topics. They navigate via wiki-links, see maturity indicators, and find related content through backlinks.

**Why this priority**: The digital garden is a unique differentiator but secondary to core portfolio and blog functionality.

**Independent Test**: Can be tested by creating sample notes with wiki-links and verifying bidirectional link rendering, backlinks section, and maturity icons display correctly.

**Acceptance Scenarios**:

1. **Given** I am on the garden listing, **When** notes exist, **Then** I see notes with their title, maturity indicator icon, and tags
2. **Given** I am reading a note with wiki-links `[[other-note]]`, **When** the linked note exists, **Then** the link is styled as a functional hyperlink
3. **Given** I am reading a note with wiki-links `[[non-existent]]`, **When** the linked note does not exist, **Then** the link is styled as dimmed/dashed indicating a broken link
4. **Given** I am reading a note, **When** other notes link to this note, **Then** I see a "Backlinks" section listing those notes

---

### User Story 5 - Admin Authentication (Priority: P1)

The site owner (single admin user) logs into the dashboard to manage content. Authentication uses JWT tokens stored in HttpOnly cookies with automatic refresh.

**Why this priority**: Authentication is the gatekeeper for all content management. Without it, the dashboard cannot be secured.

**Independent Test**: Can be tested by attempting login with valid/invalid credentials and verifying token issuance, refresh behavior, and logout.

**Acceptance Scenarios**:

1. **Given** I am on the login page, **When** I enter valid credentials, **Then** I am redirected to the dashboard and my session is active
2. **Given** I am logged in, **When** my access token expires (15 min), **Then** the system automatically refreshes using the refresh token
3. **Given** I am logged in, **When** I click logout, **Then** my tokens are invalidated and I am redirected to the login page
4. **Given** I am not authenticated, **When** I try to access the dashboard, **Then** I am redirected to the login page

---

### User Story 6 - Manage Blog Content (Priority: P1)

The admin creates, edits, publishes, and deletes blog posts through the dashboard. The editor supports markdown with live preview, image insertion from media library, and SEO fields.

**Why this priority**: Content management is the core admin function. Without it, the platform cannot be maintained.

**Independent Test**: Can be tested by creating a post through the dashboard, previewing it, publishing it, and verifying it appears on the public blog.

**Acceptance Scenarios**:

1. **Given** I am in the dashboard, **When** I create a new post, **Then** I see a markdown editor with toolbar and live preview pane
2. **Given** I am editing a post, **When** I switch between Arabic and English tabs, **Then** I can enter bilingual content that is stored separately
3. **Given** I am editing a post, **When** I click the image button, **Then** I can browse and insert images from the media library
4. **Given** I save a post as draft, **When** I view the public blog, **Then** the draft post is not visible
5. **Given** I publish a post, **When** I view the public blog, **Then** the post appears in the listing

---

### User Story 7 - Manage Digital Garden Notes (Priority: P2)

The admin creates, edits, and organizes garden notes with wiki-link syntax, maturity levels, and tags. The dashboard shows a broken links report.

**Why this priority**: Garden management follows blog management in importance as secondary content type.

**Independent Test**: Can be tested by creating notes with wiki-links, setting maturity levels, and verifying the broken links dashboard accurately reports non-existent link targets.

**Acceptance Scenarios**:

1. **Given** I am creating a note, **When** I type `[[note-slug]]` in the content, **Then** the preview renders it as a wiki-link
2. **Given** I am editing a note, **When** I select a maturity level, **Then** the note displays the corresponding icon (seedling/budding/evergreen) on the public site
3. **Given** notes have broken wiki-links, **When** I view the broken links dashboard, **Then** I see a list of all notes with non-existent link targets

---

### User Story 8 - Manage Portfolio Content (Priority: P1)

The admin edits all portfolio sections (About, Experience, Projects, Skills, Education) through the dashboard.

**Why this priority**: Portfolio content management is essential for keeping professional information current.

**Independent Test**: Can be tested by editing portfolio sections in the dashboard and verifying changes appear on the public portfolio.

**Acceptance Scenarios**:

1. **Given** I am in the portfolio management section, **When** I edit the About content, **Then** the changes are reflected on the public portfolio
2. **Given** I am adding a new project, **When** I fill in all required fields (title, description, thumbnail, tech stack), **Then** the project appears in the portfolio projects section
3. **Given** I am managing experiences, **When** I reorder them, **Then** they display in the new order on the public portfolio

---

### User Story 9 - Manage Media Library (Priority: P1)

The admin uploads, organizes, and manages images through a folder-based media library with metadata editing.

**Why this priority**: Media management supports all content types and is required for inserting images into posts and projects.

**Independent Test**: Can be tested by uploading an image, creating folders, moving files, and editing metadata like alt text.

**Acceptance Scenarios**:

1. **Given** I am in the media library, **When** I upload an image, **Then** it is automatically optimized and a thumbnail is generated
2. **Given** I am viewing a media file, **When** I edit the alt text and caption, **Then** the metadata is saved and used when the image is displayed
3. **Given** I have media files, **When** I create a folder and move files into it, **Then** the files are organized within that folder

---

### User Story 10 - Comment on Blog Posts (Priority: P2)

Visitors can leave comments on blog posts. First-time commenters require approval; approved users' comments are auto-published.

**Why this priority**: Comments add community engagement but are not essential for core platform functionality.

**Independent Test**: Can be tested by submitting a comment as a new visitor, verifying it requires approval, approving it in the dashboard, and verifying subsequent comments from the same email auto-publish.

**Acceptance Scenarios**:

1. **Given** I am a new commenter, **When** I submit a comment, **Then** I see a message indicating it awaits moderation
2. **Given** the admin approves my first comment, **When** I submit another comment from the same email, **Then** it is automatically published
3. **Given** I am the admin, **When** I view pending comments, **Then** I can approve, mark as spam, or delete them

---

### User Story 11 - Bilingual Experience (Priority: P1)

All public pages support both Arabic and English with proper RTL/LTR layout switching and language detection.

**Why this priority**: Bilingual support is a core requirement and affects all user-facing content.

**Independent Test**: Can be tested by navigating the site in both languages and verifying content, layout direction, and date formatting change appropriately.

**Acceptance Scenarios**:

1. **Given** I visit without a language prefix, **When** my browser prefers Arabic, **Then** I am served the Arabic version with RTL layout
2. **Given** I am on an Arabic page, **When** I click the language switcher, **Then** I am navigated to the English version at `/en/...` with LTR layout
3. **Given** I am viewing dates, **When** in Arabic mode, **Then** dates display as "22 يناير 2026" format

---

### User Story 12 - Search Content (Priority: P2)

Visitors can search blog posts and garden notes using full-text search.

**Why this priority**: Search improves discoverability but basic navigation suffices for MVP.

**Independent Test**: Can be tested by searching for keywords that exist in posts/notes and verifying relevant results are returned.

**Acceptance Scenarios**:

1. **Given** I am on the blog, **When** I search for "TypeScript", **Then** I see posts containing that term ranked by relevance
2. **Given** I am in the garden, **When** I search for a term, **Then** notes containing that term are displayed

---

### Edge Cases

- What happens when a visitor accesses a post that was unpublished after being indexed by search engines? Display a themed 404 page with search box.
- How does the system handle concurrent admin sessions? Only one admin user exists; concurrent logins are allowed with the same token.
- What happens when uploading an image that exceeds size limits? Display validation error with size limit guidance.
- How does wiki-link parsing handle malformed syntax like `[[` without closing brackets? Render as plain text.
- What happens when a post has no featured image? Display a themed placeholder or gradient background.
- How does the system behave when the database is unavailable? Display themed 500 error page with retry option.

## Requirements *(mandatory)*

### Functional Requirements

**Landing Page**
- **FR-001**: System MUST display an animated Cthulhu canvas in the hero section on desktop/tablet
- **FR-002**: System MUST render a canvas-based rain particle effect with configurable intensity based on screen size
- **FR-003**: System MUST display periodic visual thunder flash effects (every 15-45 seconds)
- **FR-004**: System MUST display three portal links to Portfolio, Blog, and Garden sites
- **FR-005**: System MUST display a brief bio/tagline and social links
- **FR-006**: System MUST provide a language switcher between Arabic and English
- **FR-007**: System MUST reduce or disable effects when user has prefers-reduced-motion enabled
- **FR-008**: System MUST provide a login button navigating to dashboard authentication

**Portfolio**
- **FR-009**: System MUST display 7 sections: Hero, About, Experience, Projects, Skills, Education, Contact
- **FR-010**: System MUST render project detail pages with full information (description, gallery, tech stack, links)
- **FR-011**: System MUST display experience entries with company, title, dates, location, type, and description
- **FR-012**: System MUST display skills grouped by category (Languages, Frameworks, Tools, Databases, Cloud, Other)
- **FR-013**: System MUST display education and certifications combined in one section

**Blog**
- **FR-014**: System MUST display paginated post listings with title, excerpt, featured image, reading time
- **FR-015**: System MUST render individual posts with full markdown content and syntax highlighting
- **FR-016**: System MUST auto-calculate reading time from content length
- **FR-017**: System MUST support hierarchical categories for post organization
- **FR-018**: System MUST support flat tags for post labeling
- **FR-019**: System MUST support multi-part post series with in-post navigation
- **FR-020**: System MUST display related posts (3 posts, auto-suggested with manual override capability)
- **FR-021**: System MUST render reading progress bar while scrolling posts
- **FR-022**: System MUST provide share buttons for Twitter/X, LinkedIn, and copy link
- **FR-023**: System MUST auto-generate table of contents from post headings
- **FR-024**: System MUST support full-text search for posts
- **FR-025**: System MUST support commenting with hybrid moderation (first-time approval, then auto-publish)
- **FR-026**: System MUST implement honeypot fields and rate limiting (5/hour/IP) for comment spam prevention

**Digital Garden**
- **FR-027**: System MUST display note listings with title, maturity indicator, and tags
- **FR-028**: System MUST parse and render wiki-link syntax `[[slug]]` and `[[slug|display text]]`
- **FR-029**: System MUST style wiki-links to existing notes as functional hyperlinks
- **FR-030**: System MUST style wiki-links to non-existent notes as dimmed/dashed placeholders
- **FR-031**: System MUST display a backlinks section showing all notes that reference the current note
- **FR-032**: System MUST display maturity indicators (Seedling, Budding, Evergreen) with icons
- **FR-033**: System MUST support full-text search for notes

**Dashboard**
- **FR-034**: System MUST authenticate admin via JWT with access tokens (15 min) and refresh tokens (7 days) in HttpOnly cookies
- **FR-035**: System MUST provide CRUD operations for blog posts with markdown editor and live preview
- **FR-036**: System MUST provide CRUD operations for garden notes with wiki-link preview
- **FR-037**: System MUST provide editing for all portfolio sections
- **FR-038**: System MUST provide a media library with folder organization, stored on local filesystem
- **FR-039**: System MUST auto-optimize uploaded images (compression, WebP conversion) with 10MB maximum file size limit
- **FR-040**: System MUST support editing metadata (alt text, caption) for media files
- **FR-041**: System MUST provide side-by-side editing for Arabic/English content
- **FR-042**: System MUST provide SEO fields (meta title, description, OG image) for posts and pages
- **FR-043**: System MUST display a broken wiki-links dashboard showing notes with non-existent link targets
- **FR-044**: System MUST provide comment moderation interface (approve, spam, delete)

**Internationalization**
- **FR-045**: System MUST support Arabic (RTL) and English (LTR) languages
- **FR-046**: System MUST detect browser language preference and default to Arabic if ambiguous
- **FR-047**: System MUST use URL path prefixes (`/ar/`, `/en/`) for language routing
- **FR-048**: System MUST use CSS logical properties for RTL/LTR layout switching
- **FR-049**: System MUST format dates according to locale (Arabic: "22 يناير 2026", English: "January 22, 2026")
- **FR-050**: System MUST keep code blocks in LTR direction regardless of page language

**Technical**
- **FR-051**: System MUST use server-side rendering (SSR) for all public pages (Landing, Portfolio, Blog, Garden)
- **FR-052**: System MUST use client-side rendering (CSR) for the Dashboard
- **FR-053**: System MUST expose a RESTful API following JSend specification
- **FR-054**: System MUST generate automatic XML sitemap for SEO
- **FR-055**: System MUST implement proper canonical URLs and hreflang tags
- **FR-056**: System MUST support PWA features (installable, offline reading for cached content)
- **FR-057**: System MUST meet WCAG AA accessibility standards
- **FR-058**: System MUST provide Swagger/OpenAPI documentation for all API endpoints
- **FR-059**: System MUST implement CSRF protection for mutation endpoints
- **FR-060**: System MUST provide database seed scripts with sample content (admin user, demo posts, portfolio entries, garden notes) for development and testing

### Key Entities

- **Post**: Blog article with bilingual content, status (draft/published/archived), categories, tags, series association, and SEO metadata
- **Category**: Hierarchical grouping for posts with bilingual name and description
- **Tag**: Flat label for posts with bilingual name
- **Series**: Collection of related posts meant to be read in sequence with bilingual title and description
- **Comment**: User-submitted comment on a post with moderation status and optional parent for threading
- **Note**: Digital garden entry with bilingual content, maturity level, and tags
- **NoteLink**: Relationship between notes tracking wiki-link connections and broken link status
- **Project**: Portfolio project with bilingual content, tech stack, gallery, and external links
- **Experience**: Work history entry with company, role, dates, and bilingual description
- **Skill**: Technical skill with category grouping and bilingual name
- **Education**: Academic and certification entry with bilingual institution and degree
- **About**: Profile information with name, title, bio, avatar, and social links
- **MediaFile**: Uploaded file with dimensions, alt text, caption, and folder organization
- **MediaFolder**: Organizational container for media files
- **User**: Admin user for authentication (single user in Phase 1)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can navigate from landing page to any site section (Portfolio, Blog, Garden) within 2 clicks
- **SC-002**: All public pages load with First Contentful Paint under 1.5 seconds
- **SC-003**: All public pages achieve Lighthouse Performance Score above 90
- **SC-004**: All public pages achieve Lighthouse Accessibility Score above 90 (WCAG AA compliance)
- **SC-005**: Content is fully readable and navigable in both Arabic and English with correct text direction
- **SC-006**: Admin can create and publish a blog post within 5 minutes using the dashboard editor
- **SC-007**: Search returns relevant results for queries within 1 second
- **SC-008**: The platform supports 100 concurrent visitors without performance degradation
- **SC-009**: All forms and interactive elements are fully keyboard navigable
- **SC-010**: Visual effects (rain, thunder, Cthulhu canvas) render without causing layout shift (CLS < 0.1)
- **SC-011**: Admin can complete full login-to-publish workflow using only the dashboard (no direct database access required)
- **SC-012**: Wiki-links correctly identify and display backlinks with 100% accuracy
