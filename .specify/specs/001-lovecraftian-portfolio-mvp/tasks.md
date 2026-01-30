# Tasks: Lovecraftian Portfolio Platform MVP

**Input**: Design documents from `/specs/001-lovecraftian-portfolio-mvp/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md Nx monorepo structure:
- **Apps**: `apps/web/`, `apps/api/`
- **Frontend libs**: `libs/web/{domain}/{type}/`
- **Backend libs**: `libs/api/{domain}/src/lib/{entity}/`
- **Shared types**: `libs/shared/types/src/lib/`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create Nx workspace and generate all applications and libraries

- [X] T001 Create Nx workspace with pnpm: `npx create-nx-workspace@latest portfolio --preset=apps --packageManager=pnpm`
- [X] T002 Install Nx plugins: `pnpm add -D @nx/angular @nx/nest @nx/js`
- [X] T003 [P] Generate Angular SSR app: `nx g @nx/angular:app web --style=scss --routing=true --ssr=true --directory=apps/web`
- [X] T004 [P] Generate NestJS API app: `nx g @nx/nest:app api --directory=apps/api`
- [X] T005 [P] Generate shared types library: `nx g @nx/js:lib shared-types --directory=libs/shared/types --buildable`
- [X] T006 Install backend dependencies in package.json (drizzle-orm, postgres, @nestjs/jwt, @nestjs/passport, bcrypt, class-validator, sharp, ulid)
- [X] T007 Install frontend dependencies in package.json (@ngx-translate/core, marked, shiki) - Note: Using SCSS with BEM instead of Tailwind per user preference
- [X] T008 [P] Skipped - Using SCSS with BEM methodology instead of Tailwind CSS
- [X] T009 [P] Configure ESLint module boundary rules in eslint.config.mjs per constitution Principle IV
- [X] T010 [P] Create .env.example with DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, UPLOAD_DIR placeholders
- [X] T011 [P] Generate API core library: `nx g @nx/nest:lib core --directory=libs/api/core --buildable`
- [X] T012 [P] Generate API blog library: `nx g @nx/nest:lib blog --directory=libs/api/blog --buildable`
- [X] T013 [P] Generate API garden library: `nx g @nx/nest:lib garden --directory=libs/api/garden --buildable`
- [X] T014 [P] Generate API portfolio library: `nx g @nx/nest:lib portfolio --directory=libs/api/portfolio --buildable`
- [X] T015 [P] Generate API media library: `nx g @nx/nest:lib media --directory=libs/api/media --buildable`

**Checkpoint**: Nx workspace created with all apps and API libraries generated

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & Schema

- [X] T016 Configure Drizzle ORM connection in libs/api/core/src/lib/database/drizzle.config.ts
- [X] T017 Create PostgreSQL database and configure DATABASE_URL in .env
- [X] T018 [P] Define User entity schema in libs/api/core/src/lib/database/schema/user.schema.ts
- [X] T019 [P] Define Post, Category, Tag, Series schemas in libs/api/core/src/lib/database/schema/blog.schema.ts
- [X] T020 [P] Define Comment schema in libs/api/core/src/lib/database/schema/blog.schema.ts
- [X] T021 [P] Define Note, NoteLink schemas in libs/api/core/src/lib/database/schema/garden.schema.ts
- [X] T022 [P] Define Project, Experience, Skill, Education, About schemas in libs/api/core/src/lib/database/schema/portfolio.schema.ts
- [X] T023 [P] Define MediaFile, MediaFolder schemas in libs/api/core/src/lib/database/schema/media.schema.ts
- [X] T024 Create schema index file exporting all tables in libs/api/core/src/lib/database/schema/index.ts
- [X] T025 Run initial database migration with drizzle-kit push

### Shared Types

- [X] T026 [P] Define IUser interface in libs/shared/types/src/lib/common/user.interface.ts
- [X] T027 [P] Define IPost, ICategory, ITag, ISeries interfaces in libs/shared/types/src/lib/blog/index.ts
- [X] T028 [P] Define IComment interface in libs/shared/types/src/lib/blog/comment.interface.ts
- [X] T029 [P] Define INote, INoteLink interfaces in libs/shared/types/src/lib/garden/index.ts
- [X] T030 [P] Define IProject, IExperience, ISkill, IEducation, IAbout interfaces in libs/shared/types/src/lib/portfolio/index.ts
- [X] T031 [P] Define IMediaFile, IMediaFolder interfaces in libs/shared/types/src/lib/media/index.ts
- [X] T032 [P] Define common types (enums, pagination, JSend responses) in libs/shared/types/src/lib/common/index.ts
- [X] T033 Create shared types barrel export in libs/shared/types/src/index.ts

### API Core Infrastructure

- [X] T034 Implement ConfigModule with environment validation in libs/api/core/src/lib/config/config.module.ts
- [X] T035 [P] Create JSend response interceptor in libs/api/core/src/lib/interceptors/jsend.interceptor.ts
- [X] T036 [P] Create global exception filter in libs/api/core/src/lib/filters/http-exception.filter.ts
- [X] T037 [P] Create validation pipe configuration in libs/api/core/src/lib/pipes/validation.pipe.ts
- [X] T037b [P] Configure CSRF protection middleware for mutation endpoints in libs/api/core/src/lib/middleware/csrf.middleware.ts
- [X] T038 Configure Swagger/OpenAPI documentation in apps/api/src/main.ts
- [X] T039 Create CoreModule importing all core providers in libs/api/core/src/lib/core.module.ts
- [X] T040 Wire CoreModule into apps/api/src/app/app.module.ts

### Frontend Core Infrastructure

- [X] T041 Generate shared data-access library: `nx g @nx/angular:lib data-access --directory=libs/web/shared --standalone` (consolidated into single shared lib)
- [X] T042 Generate shared UI library: `nx g @nx/angular:lib ui --directory=libs/web/shared --standalone` (consolidated into single shared lib)
- [X] T043 Generate shared ui-layout library: `nx g @nx/angular:lib ui-layout --directory=libs/web/shared --standalone` (consolidated into single shared lib)
- [X] T044 Generate shared util-i18n library: `nx g @nx/angular:lib util-i18n --directory=libs/web/shared --standalone` (consolidated into single shared lib)
- [X] T045 Generate shared util-formatting library: `nx g @nx/angular:lib util-formatting --directory=libs/web/shared --standalone` (consolidated into single shared lib)
- [X] T046 [P] Create HTTP client service in libs/web/shared/src/lib/http/http-client.service.ts
- [X] T047 [P] Create API interceptor for error handling in libs/web/shared/src/lib/http/api.interceptor.ts
- [X] T048 [P] Implement i18n service with Arabic/English support in libs/web/shared/src/lib/i18n/i18n.service.ts
- [X] T049 [P] Create translation JSON files in apps/web/src/assets/i18n/ar.json and en.json
- [X] T050 [P] Implement date formatting utility with locale support in libs/web/shared/src/lib/formatting/date-format.pipe.ts
- [X] T051 Configure Angular SSR with provideClientHydration in apps/web/src/app/app.config.ts
- [X] T052 Configure i18n providers in apps/web/src/app/app.config.ts
- [X] T053 Create RTL-aware layout wrapper component in libs/web/shared/src/lib/layout/layout.component.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 11 - Bilingual Experience (Priority: P1) 🎯 FOUNDATION

**Goal**: Enable Arabic/English with RTL/LTR layout switching site-wide

**Independent Test**: Navigate site in both languages, verify content and layout direction change appropriately

**Why First**: US11 is foundational for all other public-facing user stories

### Implementation for User Story 11

- [X] T054 [US11] Implement language detection service in libs/web/shared/src/lib/i18n/language-detector.service.ts
- [X] T055 [US11] Create language switcher component in libs/web/shared/src/lib/ui/language-switcher/language-switcher.component.ts
- [X] T056 [US11] Implement URL-based language routing with /ar/ and /en/ prefixes in apps/web/src/app/app.routes.ts
- [X] T057 [US11] Add dir attribute binding (rtl/ltr) to layout wrapper in libs/web/shared/src/lib/layout/layout.component.ts
- [X] T058 [US11] Configure CSS logical properties base styles in apps/web/src/styles.scss
- [X] T059 [US11] Create LTR code block directive for maintaining LTR in code blocks in libs/web/shared/src/lib/directives/ltr-code.directive.ts
- [X] T060 [US11] Implement server-side language detection in apps/web/server.ts

**Checkpoint**: Bilingual infrastructure complete - all pages can now be built with i18n support

---

## Phase 4: User Story 5 - Admin Authentication (Priority: P1)

**Goal**: Secure admin login with JWT tokens in HttpOnly cookies

**Independent Test**: Login with valid/invalid credentials, verify token issuance, refresh, and logout

### Implementation for User Story 5

- [X] T061 [P] [US5] Create login DTO in libs/api/core/src/lib/auth/dto/login.dto.ts
- [X] T062 [P] [US5] Create auth response DTO in libs/api/core/src/lib/auth/dto/auth-response.dto.ts
- [X] T063 [US5] Implement AuthService with login, refresh, logout in libs/api/core/src/lib/auth/auth.service.ts
- [X] T064 [US5] Implement JwtStrategy for Passport in libs/api/core/src/lib/auth/jwt.strategy.ts
- [X] T065 [US5] Implement RefreshTokenStrategy in libs/api/core/src/lib/auth/refresh.strategy.ts
- [X] T066 [US5] Create JwtAuthGuard in libs/api/core/src/lib/guards/jwt-auth.guard.ts
- [X] T067 [US5] Create AuthController with /auth/login, /auth/refresh, /auth/logout in libs/api/core/src/lib/auth/auth.controller.ts
- [X] T068 [US5] Configure HttpOnly cookie settings in AuthService
- [X] T069 [US5] Create AuthModule in libs/api/core/src/lib/auth/auth.module.ts
- [X] T070 Generate dashboard feature-shell library (implemented as pages/dashboard in app for simplicity)
- [X] T071 [P] [US5] Create login page component in apps/web/src/app/pages/dashboard/login/login.component.ts
- [X] T072 [P] [US5] Create auth service (frontend) in libs/web/shared/src/lib/auth/auth.service.ts
- [X] T073 [US5] Create auth guard for dashboard routes in libs/web/shared/src/lib/auth/auth.guard.ts
- [X] T074 [US5] Implement token refresh interceptor in libs/web/shared/src/lib/auth/token-refresh.interceptor.ts
- [X] T075 [US5] Configure dashboard routes with auth guard in apps/web/src/app/pages/dashboard/dashboard.routes.ts

**Checkpoint**: Admin can login/logout, protected routes work

---

## Phase 5: User Story 9 - Manage Media Library (Priority: P1)

**Goal**: Upload, organize, and manage images with metadata

**Independent Test**: Upload image, create folder, move file, edit alt text

**Why Before Content Stories**: US6, US7, US8 all depend on media library for image insertion

### Implementation for User Story 9

- [X] T076 [P] [US9] Create upload DTO with file validation in libs/api/media/src/lib/file/dto/upload.dto.ts
- [X] T077 [P] [US9] Create media metadata DTO in libs/api/media/src/lib/file/dto/update-metadata.dto.ts
- [X] T078 [P] [US9] Create folder DTO in libs/api/media/src/lib/folder/dto/create-folder.dto.ts
- [X] T079 [US9] Implement MediaFileService with upload, optimize, delete in libs/api/media/src/lib/file/file.service.ts
- [X] T080 [US9] Implement Sharp image optimization (WebP, thumbnails) in libs/api/media/src/lib/file/image-optimizer.service.ts
- [X] T081 [US9] Implement MediaFolderService with CRUD in libs/api/media/src/lib/folder/folder.service.ts
- [X] T082 [US9] Create MediaFileController with upload, list, update, delete in libs/api/media/src/lib/file/file.controller.ts
- [X] T083 [US9] Create MediaFolderController in libs/api/media/src/lib/folder/folder.controller.ts
- [X] T084 [US9] Create MediaModule in libs/api/media/src/lib/media.module.ts
- [X] T085 [US9] Configure multer for file uploads with 10MB limit in libs/api/media/src/lib/file/file.controller.ts
- [X] T086 Media components consolidated into libs/web/shared (no separate feature library needed)
- [X] T087 [P] [US9] Create media data-access service in libs/web/shared/src/lib/media/media.service.ts
- [X] T088 [US9] Create media library grid component in libs/web/shared/src/lib/media/media-grid.component.ts
- [X] T089 [US9] Create upload dropzone component in libs/web/shared/src/lib/media/upload-dropzone.component.ts
- [X] T090 [US9] Create media detail panel with metadata editing in libs/web/shared/src/lib/media/media-detail.component.ts
- [X] T091 [US9] Create folder tree component in libs/web/shared/src/lib/media/folder-tree.component.ts
- [X] T092 [US9] Create media picker modal for insertion into content in libs/web/shared/src/lib/media/media-picker.component.ts

**Checkpoint**: Media library fully functional - images can be uploaded, organized, and metadata edited

---

## Phase 6: User Story 8 - Manage Portfolio Content (Priority: P1)

**Goal**: Admin can edit About, Experience, Projects, Skills, Education

**Independent Test**: Edit portfolio sections in dashboard, verify changes on public portfolio

### Implementation for User Story 8

- [X] T093 [P] [US8] Create About DTOs in libs/api/portfolio/src/lib/about/dto/
- [X] T094 [P] [US8] Create Project DTOs in libs/api/portfolio/src/lib/project/dto/
- [X] T095 [P] [US8] Create Experience DTOs in libs/api/portfolio/src/lib/experience/dto/
- [X] T096 [P] [US8] Create Skill DTOs in libs/api/portfolio/src/lib/skill/dto/
- [X] T097 [P] [US8] Create Education DTOs in libs/api/portfolio/src/lib/education/dto/
- [X] T098 [US8] Implement AboutService in libs/api/portfolio/src/lib/about/about.service.ts
- [X] T099 [US8] Implement ProjectService in libs/api/portfolio/src/lib/project/project.service.ts
- [X] T100 [US8] Implement ExperienceService in libs/api/portfolio/src/lib/experience/experience.service.ts
- [X] T101 [US8] Implement SkillService in libs/api/portfolio/src/lib/skill/skill.service.ts
- [X] T102 [US8] Implement EducationService in libs/api/portfolio/src/lib/education/education.service.ts
- [X] T103 [P] [US8] Create AboutController in libs/api/portfolio/src/lib/about/about.controller.ts
- [X] T104 [P] [US8] Create ProjectController in libs/api/portfolio/src/lib/project/project.controller.ts
- [X] T105 [P] [US8] Create ExperienceController in libs/api/portfolio/src/lib/experience/experience.controller.ts
- [X] T106 [P] [US8] Create SkillController in libs/api/portfolio/src/lib/skill/skill.controller.ts
- [X] T107 [P] [US8] Create EducationController in libs/api/portfolio/src/lib/education/education.controller.ts
- [X] T108 [US8] Create PortfolioModule in libs/api/portfolio/src/lib/portfolio.module.ts
- [X] T109 Generate dashboard feature-portfolio library: `nx g @nx/angular:lib feature-portfolio --directory=libs/web/dashboard --standalone`
- [X] T110 [P] [US8] Create portfolio data-access service in libs/web/dashboard/data-access/src/lib/portfolio.service.ts
- [X] T111 [US8] Create About editor component in libs/web/dashboard/feature-portfolio/src/lib/about-editor/about-editor.component.ts
- [X] T112 [US8] Create Project list/editor component in libs/web/dashboard/feature-portfolio/src/lib/projects-editor/projects-editor.component.ts
- [X] T113 [US8] Create Experience list/editor component in libs/web/dashboard/feature-portfolio/src/lib/experience-editor/experience-editor.component.ts
- [X] T114 [US8] Create Skills editor component in libs/web/dashboard/feature-portfolio/src/lib/skills-editor/skills-editor.component.ts
- [X] T115 [US8] Create Education editor component in libs/web/dashboard/feature-portfolio/src/lib/education-editor/education-editor.component.ts
- [X] T116 [US8] Create bilingual form component for side-by-side AR/EN editing in libs/web/dashboard/ui/src/lib/bilingual-form/bilingual-form.component.ts

**Checkpoint**: All portfolio sections can be managed via dashboard

---

## Phase 7: User Story 1 - View Portfolio as Visitor (Priority: P1) 🎯 MVP

**Goal**: Public portfolio with all 7 sections displaying correctly in both languages

**Independent Test**: Navigate to portfolio, verify all sections display with sample data in AR and EN

### Implementation for User Story 1

- [ ] T117 Generate portfolio feature libraries: `nx g @nx/angular:lib feature-shell --directory=libs/web/portfolio --standalone --routing`
- [ ] T118 [P] Generate portfolio feature-about: `nx g @nx/angular:lib feature-about --directory=libs/web/portfolio --standalone`
- [ ] T119 [P] Generate portfolio feature-projects: `nx g @nx/angular:lib feature-projects --directory=libs/web/portfolio --standalone`
- [ ] T120 [P] Generate portfolio feature-experience: `nx g @nx/angular:lib feature-experience --directory=libs/web/portfolio --standalone`
- [ ] T121 [P] Generate portfolio feature-skills: `nx g @nx/angular:lib feature-skills --directory=libs/web/portfolio --standalone`
- [ ] T122 [P] Generate portfolio feature-education: `nx g @nx/angular:lib feature-education --directory=libs/web/portfolio --standalone`
- [ ] T123 [P] Generate portfolio data-access: `nx g @nx/angular:lib data-access --directory=libs/web/portfolio --standalone`
- [ ] T124 [P] Generate portfolio UI library: `nx g @nx/angular:lib ui --directory=libs/web/portfolio --standalone`
- [ ] T125 [US1] Create portfolio data service in libs/web/portfolio/data-access/src/lib/portfolio-data.service.ts
- [ ] T126 [P] [US1] Create hero section component in libs/web/portfolio/ui/src/lib/hero/hero.component.ts
- [ ] T127 [P] [US1] Create about section component in libs/web/portfolio/feature-about/src/lib/about.component.ts
- [ ] T128 [P] [US1] Create experience section component in libs/web/portfolio/feature-experience/src/lib/experience.component.ts
- [ ] T129 [P] [US1] Create projects grid component in libs/web/portfolio/feature-projects/src/lib/projects-grid/projects-grid.component.ts
- [ ] T130 [US1] Create project card component in libs/web/portfolio/ui/src/lib/project-card/project-card.component.ts
- [ ] T131 [US1] Create project detail page in libs/web/portfolio/feature-projects/src/lib/project-detail/project-detail.component.ts
- [ ] T132 [P] [US1] Create skills section with category grouping in libs/web/portfolio/feature-skills/src/lib/skills.component.ts
- [ ] T133 [P] [US1] Create education section in libs/web/portfolio/feature-education/src/lib/education.component.ts
- [ ] T134 [US1] Create contact section component in libs/web/portfolio/ui/src/lib/contact/contact.component.ts
- [ ] T135 [US1] Create portfolio shell with all sections in libs/web/portfolio/feature-shell/src/lib/portfolio-shell.component.ts
- [ ] T136 [US1] Configure portfolio routes in libs/web/portfolio/feature-shell/src/lib/portfolio.routes.ts
- [ ] T137 [US1] Wire portfolio module into apps/web/src/app/app.routes.ts with SSR

**Checkpoint**: Public portfolio displays all 7 sections correctly - MVP deliverable!

---

## Phase 8: User Story 2 - Landing Page with Cosmic Horror Aesthetic (Priority: P1)

**Goal**: Dramatic landing page with Cthulhu canvas, rain, thunder, and three portal links

**Independent Test**: Load landing page, verify effects render, portals link correctly, mobile adapts

### Implementation for User Story 2

- [ ] T138 Generate landing feature library: `nx g @nx/angular:lib feature --directory=libs/web/landing --standalone`
- [ ] T139 Generate ui-effects library: `nx g @nx/angular:lib ui-effects --directory=libs/web/shared --standalone`
- [ ] T140 [P] [US2] Create Cthulhu canvas animation in libs/web/shared/ui-effects/src/lib/cthulhu-canvas/cthulhu-canvas.component.ts
- [ ] T141 [P] [US2] Create rain particle effect in libs/web/shared/ui-effects/src/lib/rain-effect/rain-effect.component.ts
- [ ] T142 [P] [US2] Create thunder flash effect in libs/web/shared/ui-effects/src/lib/thunder-flash/thunder-flash.component.ts
- [ ] T143 [US2] Implement prefers-reduced-motion detection in libs/web/shared/ui-effects/src/lib/motion-preference.service.ts
- [ ] T144 [US2] Create responsive effect intensity service in libs/web/shared/ui-effects/src/lib/effect-intensity.service.ts
- [ ] T145 [US2] Create portal card component in libs/web/landing/feature/src/lib/portal-card/portal-card.component.ts
- [ ] T146 [US2] Create landing hero component with effects in libs/web/landing/feature/src/lib/landing-hero/landing-hero.component.ts
- [ ] T147 [US2] Create bio/tagline section component in libs/web/landing/feature/src/lib/bio-section/bio-section.component.ts
- [ ] T148 [US2] Create social links component in libs/web/shared/ui/src/lib/social-links/social-links.component.ts
- [ ] T149 [US2] Create login button with navigation to dashboard in libs/web/landing/feature/src/lib/login-button/login-button.component.ts
- [ ] T150 [US2] Create landing page shell in libs/web/landing/feature/src/lib/landing.component.ts
- [ ] T151 [US2] Configure landing route as root in apps/web/src/app/app.routes.ts

**Checkpoint**: Landing page complete with all Lovecraftian effects

---

## Phase 9: User Story 6 - Manage Blog Content (Priority: P1)

**Goal**: Admin creates, edits, publishes blog posts with markdown editor

**Independent Test**: Create post via dashboard, preview, publish, verify on public blog

### Implementation for User Story 6

- [ ] T152 [P] [US6] Create Post DTOs (create, update, list) in libs/api/blog/src/lib/post/dto/
- [ ] T153 [P] [US6] Create Category DTOs in libs/api/blog/src/lib/category/dto/
- [ ] T154 [P] [US6] Create Tag DTOs in libs/api/blog/src/lib/tag/dto/
- [ ] T155 [P] [US6] Create Series DTOs in libs/api/blog/src/lib/series/dto/
- [ ] T156 [US6] Implement PostService with CRUD, status transitions in libs/api/blog/src/lib/post/post.service.ts
- [ ] T157 [US6] Implement reading time calculation in PostService
- [ ] T158 [US6] Implement CategoryService in libs/api/blog/src/lib/category/category.service.ts
- [ ] T159 [US6] Implement TagService in libs/api/blog/src/lib/tag/tag.service.ts
- [ ] T160 [US6] Implement SeriesService in libs/api/blog/src/lib/series/series.service.ts
- [ ] T161 [P] [US6] Create PostController with admin and public endpoints in libs/api/blog/src/lib/post/post.controller.ts
- [ ] T162 [P] [US6] Create CategoryController in libs/api/blog/src/lib/category/category.controller.ts
- [ ] T163 [P] [US6] Create TagController in libs/api/blog/src/lib/tag/tag.controller.ts
- [ ] T164 [P] [US6] Create SeriesController in libs/api/blog/src/lib/series/series.controller.ts
- [ ] T165 [US6] Create BlogModule in libs/api/blog/src/lib/blog.module.ts
- [ ] T166 Generate dashboard feature-posts library: `nx g @nx/angular:lib feature-posts --directory=libs/web/dashboard --standalone`
- [ ] T167 Generate util-markdown library: `nx g @nx/angular:lib util-markdown --directory=libs/web/shared --standalone`
- [ ] T168 [US6] Implement markdown parser with Shiki syntax highlighting in libs/web/shared/util-markdown/src/lib/markdown.service.ts
- [ ] T169 [P] [US6] Create blog data-access service in libs/web/dashboard/data-access/src/lib/blog.service.ts
- [ ] T170 [US6] Create markdown editor component with toolbar in libs/web/dashboard/ui/src/lib/markdown-editor/markdown-editor.component.ts
- [ ] T171 [US6] Create live preview pane component in libs/web/dashboard/ui/src/lib/live-preview/live-preview.component.ts
- [ ] T172 [US6] Create SEO fields component in libs/web/dashboard/ui/src/lib/seo-fields/seo-fields.component.ts
- [ ] T173 [US6] Create post editor page in libs/web/dashboard/feature-posts/src/lib/post-editor/post-editor.component.ts
- [ ] T174 [US6] Create post list page in libs/web/dashboard/feature-posts/src/lib/post-list/post-list.component.ts
- [ ] T175 [US6] Create category manager component in libs/web/dashboard/feature-posts/src/lib/category-manager/category-manager.component.ts
- [ ] T176 [US6] Create tag manager component in libs/web/dashboard/feature-posts/src/lib/tag-manager/tag-manager.component.ts
- [ ] T177 [US6] Create series manager component in libs/web/dashboard/feature-posts/src/lib/series-manager/series-manager.component.ts

**Checkpoint**: Blog content can be fully managed via dashboard

---

## Phase 10: User Story 3 - Read Blog Posts (Priority: P1)

**Goal**: Public blog with post listing, individual post pages, syntax highlighting

**Independent Test**: View blog listing, open post, verify markdown renders with syntax highlighting

### Implementation for User Story 3

- [ ] T178 Generate blog feature libraries: `nx g @nx/angular:lib feature-shell --directory=libs/web/blog --standalone --routing`
- [ ] T179 [P] Generate blog feature-list: `nx g @nx/angular:lib feature-list --directory=libs/web/blog --standalone`
- [ ] T180 [P] Generate blog feature-post: `nx g @nx/angular:lib feature-post --directory=libs/web/blog --standalone`
- [ ] T181 [P] Generate blog feature-series: `nx g @nx/angular:lib feature-series --directory=libs/web/blog --standalone`
- [ ] T182 [P] Generate blog data-access: `nx g @nx/angular:lib data-access --directory=libs/web/blog --standalone`
- [ ] T183 [P] Generate blog UI library: `nx g @nx/angular:lib ui --directory=libs/web/blog --standalone`
- [ ] T184 [US3] Create blog data service in libs/web/blog/data-access/src/lib/blog-data.service.ts
- [ ] T185 [P] [US3] Create post card component in libs/web/blog/ui/src/lib/post-card/post-card.component.ts
- [ ] T186 [US3] Create post list page with pagination in libs/web/blog/feature-list/src/lib/post-list/post-list.component.ts
- [ ] T187 [US3] Create post page with markdown rendering in libs/web/blog/feature-post/src/lib/post-page/post-page.component.ts
- [ ] T188 [US3] Create reading progress bar component in libs/web/blog/ui/src/lib/reading-progress/reading-progress.component.ts
- [ ] T189 [US3] Create table of contents component in libs/web/blog/ui/src/lib/toc/toc.component.ts
- [ ] T190 [US3] Create share buttons component in libs/web/blog/ui/src/lib/share-buttons/share-buttons.component.ts
- [ ] T191 [US3] Create related posts component in libs/web/blog/ui/src/lib/related-posts/related-posts.component.ts
- [ ] T192 [US3] Create series navigation component in libs/web/blog/ui/src/lib/series-nav/series-nav.component.ts
- [ ] T193 [US3] Create series landing page in libs/web/blog/feature-series/src/lib/series-page/series-page.component.ts
- [ ] T194 [US3] Create category/tag filter component in libs/web/blog/ui/src/lib/filters/filters.component.ts
- [ ] T195 [US3] Configure blog routes with SSR in libs/web/blog/feature-shell/src/lib/blog.routes.ts
- [ ] T196 [US3] Wire blog module into apps/web/src/app/app.routes.ts

**Checkpoint**: Public blog fully functional with all reading features

---

## Phase 11: User Story 4 - Explore Digital Garden (Priority: P2)

**Goal**: Public garden with note listing, wiki-links, backlinks, maturity indicators

**Independent Test**: View garden, navigate via wiki-links, verify backlinks section displays

### Implementation for User Story 4

- [ ] T197 Generate garden feature libraries: `nx g @nx/angular:lib feature-shell --directory=libs/web/garden --standalone --routing`
- [ ] T198 [P] Generate garden feature-note: `nx g @nx/angular:lib feature-note --directory=libs/web/garden --standalone`
- [ ] T199 [P] Generate garden data-access: `nx g @nx/angular:lib data-access --directory=libs/web/garden --standalone`
- [ ] T200 [P] Generate garden UI library: `nx g @nx/angular:lib ui --directory=libs/web/garden --standalone`
- [ ] T201 [P] Generate garden util-links library: `nx g @nx/angular:lib util-links --directory=libs/web/garden --standalone`
- [ ] T202 [US4] Implement wiki-link parser in libs/web/garden/util-links/src/lib/wiki-link-parser.service.ts
- [ ] T203 [US4] Create wiki-link renderer for existing/broken links in libs/web/garden/util-links/src/lib/wiki-link-renderer.service.ts
- [ ] T204 [US4] Create garden data service in libs/web/garden/data-access/src/lib/garden-data.service.ts
- [ ] T205 [P] [US4] Create note card component with maturity icon in libs/web/garden/ui/src/lib/note-card/note-card.component.ts
- [ ] T206 [P] [US4] Create maturity indicator component in libs/web/garden/ui/src/lib/maturity-indicator/maturity-indicator.component.ts
- [ ] T207 [US4] Create note list page in libs/web/garden/feature-note/src/lib/note-list/note-list.component.ts
- [ ] T208 [US4] Create note page with wiki-link rendering in libs/web/garden/feature-note/src/lib/note-page/note-page.component.ts
- [ ] T209 [US4] Create backlinks section component in libs/web/garden/ui/src/lib/backlinks/backlinks.component.ts
- [ ] T210 [US4] Configure garden routes with SSR in libs/web/garden/feature-shell/src/lib/garden.routes.ts
- [ ] T211 [US4] Wire garden module into apps/web/src/app/app.routes.ts

**Checkpoint**: Public garden functional with wiki-links and backlinks

---

## Phase 12: User Story 7 - Manage Digital Garden Notes (Priority: P2)

**Goal**: Admin creates/edits notes with wiki-links, maturity levels, broken links dashboard

**Independent Test**: Create note with wiki-links, set maturity, verify broken links dashboard

### Implementation for User Story 7

- [ ] T212 [P] [US7] Create Note DTOs in libs/api/garden/src/lib/note/dto/
- [ ] T213 [US7] Implement NoteService with CRUD in libs/api/garden/src/lib/note/note.service.ts
- [ ] T214 [US7] Implement wiki-link extraction and NoteLink updates in NoteService
- [ ] T215 [US7] Implement NoteLinkService for backlinks and broken links in libs/api/garden/src/lib/note-link/note-link.service.ts
- [ ] T216 [US7] Create NoteController with admin and public endpoints in libs/api/garden/src/lib/note/note.controller.ts
- [ ] T217 [US7] Create BrokenLinksController for dashboard in libs/api/garden/src/lib/note-link/broken-links.controller.ts
- [ ] T218 [US7] Create GardenModule in libs/api/garden/src/lib/garden.module.ts
- [ ] T219 Generate dashboard feature-notes library: `nx g @nx/angular:lib feature-notes --directory=libs/web/dashboard --standalone`
- [ ] T220 [P] [US7] Create garden data-access service for dashboard in libs/web/dashboard/data-access/src/lib/garden.service.ts
- [ ] T221 [US7] Create note editor with wiki-link preview in libs/web/dashboard/feature-notes/src/lib/note-editor/note-editor.component.ts
- [ ] T222 [US7] Create note list page in libs/web/dashboard/feature-notes/src/lib/note-list/note-list.component.ts
- [ ] T223 [US7] Create maturity selector component in libs/web/dashboard/feature-notes/src/lib/maturity-selector/maturity-selector.component.ts
- [ ] T224 [US7] Create broken links dashboard in libs/web/dashboard/feature-notes/src/lib/broken-links/broken-links.component.ts

**Checkpoint**: Garden notes can be fully managed via dashboard

---

## Phase 13: User Story 10 - Comment on Blog Posts (Priority: P2)

**Goal**: Visitors can comment, first-time requires approval, admin moderates

**Independent Test**: Submit comment as new visitor, approve in dashboard, verify subsequent auto-publish

### Implementation for User Story 10

- [ ] T225 [P] [US10] Create Comment DTOs in libs/api/blog/src/lib/comment/dto/
- [ ] T226 [US10] Implement CommentService with moderation logic in libs/api/blog/src/lib/comment/comment.service.ts
- [ ] T227 [US10] Implement email-based auto-approval in CommentService
- [ ] T228 [US10] Implement rate limiting (5/hour/IP) in libs/api/core/src/lib/guards/rate-limit.guard.ts
- [ ] T229 [US10] Create CommentController with submit and moderation endpoints in libs/api/blog/src/lib/comment/comment.controller.ts
- [ ] T230 [US10] Add honeypot field validation in comment submission
- [ ] T231 [US10] Create comment form component with honeypot in libs/web/blog/ui/src/lib/comment-form/comment-form.component.ts
- [ ] T232 [US10] Create comment list component in libs/web/blog/ui/src/lib/comment-list/comment-list.component.ts
- [ ] T233 [US10] Integrate comments into post page in libs/web/blog/feature-post/src/lib/post-page/post-page.component.ts
- [ ] T234 Generate dashboard feature-comments library: `nx g @nx/angular:lib feature-comments --directory=libs/web/dashboard --standalone`
- [ ] T235 [P] [US10] Create comment data-access service for dashboard in libs/web/dashboard/data-access/src/lib/comments.service.ts
- [ ] T236 [US10] Create comment moderation page in libs/web/dashboard/feature-comments/src/lib/moderation/moderation.component.ts

**Checkpoint**: Comment system fully functional with moderation

---

## Phase 14: User Story 12 - Search Content (Priority: P2)

**Goal**: Full-text search for blog posts and garden notes

**Independent Test**: Search for keyword, verify relevant results returned

### Implementation for User Story 12

- [ ] T237 [US12] Implement PostgreSQL full-text search in PostService in libs/api/blog/src/lib/post/post.service.ts
- [ ] T238 [US12] Implement full-text search in NoteService in libs/api/garden/src/lib/note/note.service.ts
- [ ] T239 [US12] Add search endpoint to PostController
- [ ] T240 [US12] Add search endpoint to NoteController
- [ ] T241 [US12] Create search input component in libs/web/shared/ui/src/lib/search-input/search-input.component.ts
- [ ] T242 [US12] Integrate search into blog listing in libs/web/blog/feature-list/src/lib/post-list/post-list.component.ts
- [ ] T243 [US12] Integrate search into garden listing in libs/web/garden/feature-note/src/lib/note-list/note-list.component.ts

**Checkpoint**: Search functional across blog and garden

---

## Phase 15: Polish & Cross-Cutting Concerns

**Purpose**: Performance, SEO, accessibility, PWA, seed data

### SEO & Meta

- [ ] T244 [P] Generate util-seo library: `nx g @nx/angular:lib util-seo --directory=libs/web/shared --standalone`
- [ ] T245 Implement meta tag service in libs/web/shared/util-seo/src/lib/meta.service.ts
- [ ] T246 Implement canonical URL and hreflang service in libs/web/shared/util-seo/src/lib/hreflang.service.ts
- [ ] T247 Create sitemap generation endpoint in libs/api/core/src/lib/sitemap/sitemap.controller.ts
- [ ] T247b Register sitemap route in apps/api/src/app/app.module.ts and configure XML response
- [ ] T248 Add meta tags to all public pages (portfolio, blog, garden)
- [ ] T248b Integrate hreflang service into all public page components (portfolio, blog, garden shells)

### Accessibility

- [ ] T249 Implement skip-to-content link in layout component
- [ ] T250 Add focus indicators to all interactive elements in global styles
- [ ] T251 Audit all forms for label associations
- [ ] T252 Add ARIA landmarks and roles to layout
- [ ] T253 Test keyboard navigation on all pages

### PWA

- [ ] T254 Configure service worker with Workbox in apps/web/
- [ ] T255 Create web manifest for installable PWA
- [ ] T256 Implement offline fallback page
- [ ] T257 Configure caching strategies (cache-first for assets, network-first for API)

### Error Pages

- [ ] T258 Create themed 404 page with search box in apps/web/src/app/not-found/
- [ ] T259 Create themed 500 error page with retry option in apps/web/src/app/error/

### Seed Data

- [ ] T260 Create database seed script in tools/seed/seed.ts
- [ ] T261 Add sample admin user to seed
- [ ] T262 Add sample portfolio data (About, 3 Projects, 3 Experiences, 10 Skills, 2 Education)
- [ ] T263 Add sample blog posts (3 posts, 2 categories, 5 tags, 1 series)
- [ ] T264 Add sample garden notes (5 notes with wiki-links demonstrating backlinks)
- [ ] T265 Wire seed script into package.json: `pnpm seed`

### Performance & Final Validation

- [ ] T266 Run Lighthouse audit on all public pages, verify scores > 90
- [ ] T267 Verify CLS < 0.1 on landing page with effects
- [ ] T268 Run accessibility audit, verify WCAG AA compliance
- [ ] T269 Test RTL/LTR switching on all pages
- [ ] T270 Run quickstart.md validation to verify setup instructions work
- [ ] T271 Run load testing with 100 concurrent users to validate SC-008

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS all user stories)
    ↓
Phase 3: US11 Bilingual (BLOCKS all public pages)
    ↓
Phase 4: US5 Auth (BLOCKS dashboard features)
    ↓
Phase 5: US9 Media (BLOCKS US6, US7, US8)
    ↓
Phases 6-10: Can proceed in priority order
    ↓
Phases 11-14: P2 stories after P1 complete
    ↓
Phase 15: Polish (after desired stories complete)
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US11 Bilingual | Foundational | Phase 2 |
| US5 Auth | US11 | Phase 3 |
| US9 Media | US5 | Phase 4 |
| US8 Portfolio Mgmt | US5, US9 | Phase 5 |
| US1 Portfolio View | US8 (for data) | Phase 6 |
| US2 Landing | US11 | Phase 3 |
| US6 Blog Mgmt | US5, US9 | Phase 5 |
| US3 Blog View | US6 (for data) | Phase 9 |
| US4 Garden View | US7 (for data) | Phase 12 |
| US7 Garden Mgmt | US5 | Phase 4 |
| US10 Comments | US3 | Phase 10 |
| US12 Search | US3, US4 | Phase 11 |

### Parallel Opportunities

- All `[P]` tasks within a phase can run in parallel
- Multiple developers can work on different user stories after Foundational
- Backend and frontend tasks for same story can partially parallelize

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 5, 8, 9, 11)

1. Complete Setup + Foundational
2. Complete US11 (Bilingual) - enables all public pages
3. Complete US5 (Auth) - enables dashboard
4. Complete US9 (Media) - enables content with images
5. Complete US8 (Portfolio Management) - enables portfolio data
6. Complete US1 (Portfolio View) - **MVP DELIVERABLE!**
7. Complete US2 (Landing) - **MVP COMPLETE!**

### Incremental Delivery

After MVP:
1. US6 + US3: Blog management and public blog
2. US7 + US4: Garden management and public garden
3. US10: Comments
4. US12: Search
5. Polish phase

---

## Summary

| Phase | Tasks | User Story |
|-------|-------|------------|
| 1: Setup | T001-T015 (15) | - |
| 2: Foundational | T016-T053 (38) | - |
| 3: US11 Bilingual | T054-T060 (7) | P1 |
| 4: US5 Auth | T061-T075 (15) | P1 |
| 5: US9 Media | T076-T092 (17) | P1 |
| 6: US8 Portfolio Mgmt | T093-T116 (24) | P1 |
| 7: US1 Portfolio View | T117-T137 (21) | P1 |
| 8: US2 Landing | T138-T151 (14) | P1 |
| 9: US6 Blog Mgmt | T152-T177 (26) | P1 |
| 10: US3 Blog View | T178-T196 (19) | P1 |
| 11: US4 Garden View | T197-T211 (15) | P2 |
| 12: US7 Garden Mgmt | T212-T224 (13) | P2 |
| 13: US10 Comments | T225-T236 (12) | P2 |
| 14: US12 Search | T237-T243 (7) | P2 |
| 15: Polish | T244-T271 (28) | - |
| **TOTAL** | **274 tasks** | **12 stories** |
