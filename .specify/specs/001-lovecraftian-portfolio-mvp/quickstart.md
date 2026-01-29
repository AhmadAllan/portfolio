# Quickstart: Lovecraftian Portfolio Platform MVP

**Date**: 2026-01-28
**Feature**: 001-lovecraftian-portfolio-mvp

## Prerequisites

- **Node.js**: 20.x LTS or higher
- **pnpm**: 8.x or higher
- **PostgreSQL**: 15.x or higher
- **Git**: 2.x or higher

## Initial Setup

### 1. Create Nx Workspace

```bash
# Create Nx workspace with Angular and NestJS
npx create-nx-workspace@latest portfolio --preset=apps --packageManager=pnpm

cd portfolio

# Install Angular and NestJS plugins
pnpm add -D @nx/angular @nx/nest @nx/js
```

### 2. Generate Applications

```bash
# Generate Angular SSR application
nx g @nx/angular:app web --style=scss --routing=true --ssr=true --directory=apps/web

# Generate NestJS API application
nx g @nx/nest:app api --directory=apps/api
```

### 3. Generate Shared Types Library

```bash
nx g @nx/js:lib shared-types --directory=libs/shared/types --buildable
```

### 4. Generate Frontend Libraries

```bash
# Landing
nx g @nx/angular:lib feature --directory=libs/web/landing --standalone

# Portfolio
nx g @nx/angular:lib feature-shell --directory=libs/web/portfolio --standalone --routing
nx g @nx/angular:lib feature-about --directory=libs/web/portfolio --standalone
nx g @nx/angular:lib feature-projects --directory=libs/web/portfolio --standalone
nx g @nx/angular:lib feature-experience --directory=libs/web/portfolio --standalone
nx g @nx/angular:lib feature-skills --directory=libs/web/portfolio --standalone
nx g @nx/angular:lib feature-education --directory=libs/web/portfolio --standalone
nx g @nx/angular:lib data-access --directory=libs/web/portfolio --standalone
nx g @nx/angular:lib ui --directory=libs/web/portfolio --standalone

# Blog
nx g @nx/angular:lib feature-shell --directory=libs/web/blog --standalone --routing
nx g @nx/angular:lib feature-post --directory=libs/web/blog --standalone
nx g @nx/angular:lib feature-list --directory=libs/web/blog --standalone
nx g @nx/angular:lib feature-series --directory=libs/web/blog --standalone
nx g @nx/angular:lib data-access --directory=libs/web/blog --standalone
nx g @nx/angular:lib ui --directory=libs/web/blog --standalone

# Garden
nx g @nx/angular:lib feature-shell --directory=libs/web/garden --standalone --routing
nx g @nx/angular:lib feature-note --directory=libs/web/garden --standalone
nx g @nx/angular:lib data-access --directory=libs/web/garden --standalone
nx g @nx/angular:lib ui --directory=libs/web/garden --standalone
nx g @nx/angular:lib util-links --directory=libs/web/garden --standalone

# Dashboard
nx g @nx/angular:lib feature-shell --directory=libs/web/dashboard --standalone --routing
nx g @nx/angular:lib feature-posts --directory=libs/web/dashboard --standalone
nx g @nx/angular:lib feature-notes --directory=libs/web/dashboard --standalone
nx g @nx/angular:lib feature-portfolio --directory=libs/web/dashboard --standalone
nx g @nx/angular:lib feature-media --directory=libs/web/dashboard --standalone
nx g @nx/angular:lib feature-comments --directory=libs/web/dashboard --standalone
nx g @nx/angular:lib data-access --directory=libs/web/dashboard --standalone
nx g @nx/angular:lib ui --directory=libs/web/dashboard --standalone

# Shared
nx g @nx/angular:lib data-access --directory=libs/web/shared --standalone
nx g @nx/angular:lib ui --directory=libs/web/shared --standalone
nx g @nx/angular:lib ui-layout --directory=libs/web/shared --standalone
nx g @nx/angular:lib ui-effects --directory=libs/web/shared --standalone
nx g @nx/angular:lib util-i18n --directory=libs/web/shared --standalone
nx g @nx/angular:lib util-formatting --directory=libs/web/shared --standalone
nx g @nx/angular:lib util-seo --directory=libs/web/shared --standalone
nx g @nx/angular:lib util-markdown --directory=libs/web/shared --standalone
```

### 5. Generate Backend Libraries

```bash
# Core
nx g @nx/nest:lib core --directory=libs/api/core --buildable

# Domain libraries
nx g @nx/nest:lib blog --directory=libs/api/blog --buildable
nx g @nx/nest:lib garden --directory=libs/api/garden --buildable
nx g @nx/nest:lib portfolio --directory=libs/api/portfolio --buildable
nx g @nx/nest:lib media --directory=libs/api/media --buildable
```

### 6. Install Dependencies

```bash
# Backend dependencies
pnpm add @nestjs/config @nestjs/passport @nestjs/jwt passport passport-jwt bcrypt class-validator class-transformer drizzle-orm postgres sharp ulid

# Backend dev dependencies
pnpm add -D @types/bcrypt @types/passport-jwt drizzle-kit

# Frontend dependencies
pnpm add @angular/ssr @ngx-translate/core @ngx-translate/http-loader marked shiki

# Development tools
pnpm add -D @nx/eslint-plugin eslint-plugin-prettier prettier postcss autoprefixer
```

### 7. Database Setup

```bash
# Create PostgreSQL database
createdb lovecraftian_portfolio

# Create .env file in apps/api
cat > apps/api/.env << 'EOF'
DATABASE_URL=postgresql://localhost:5432/lovecraftian_portfolio
JWT_SECRET=your-secret-key-min-32-chars-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
UPLOAD_DIR=./uploads
EOF
```

### 8. Configure Nx Tags

Update `nx.json` to include dependency rules:

```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "sharedGlobals": []
  },
  "plugins": ["@nx/eslint/plugin"]
}
```

Update each `project.json` with appropriate tags:

```json
{
  "tags": ["scope:web", "domain:blog", "type:feature"]
}
```

### 9. Configure ESLint for Dependency Rules

Add to `.eslintrc.json`:

```json
{
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "depConstraints": [
              { "sourceTag": "type:feature", "onlyDependOnLibsWithTags": ["type:data-access", "type:ui", "type:util", "scope:shared"] },
              { "sourceTag": "type:ui", "onlyDependOnLibsWithTags": ["type:util", "scope:shared"] },
              { "sourceTag": "type:data-access", "onlyDependOnLibsWithTags": ["type:util", "scope:shared"] },
              { "sourceTag": "type:util", "onlyDependOnLibsWithTags": ["scope:shared"] },
              { "sourceTag": "scope:web", "notDependOnLibsWithTags": ["scope:api"] },
              { "sourceTag": "scope:api", "notDependOnLibsWithTags": ["scope:web"] }
            ]
          }
        ]
      }
    }
  ]
}
```

## Running the Application

### Development Mode

```bash
# Start API (port 3000)
nx serve api

# Start Web (port 4200)
nx serve web

# Run both in parallel
nx run-many --target=serve --projects=api,web --parallel
```

### Database Migrations

```bash
# Generate migration
nx run api:drizzle-generate

# Run migrations
nx run api:drizzle-migrate

# Seed database
nx run api:seed
```

### Building for Production

```bash
# Build all
nx run-many --target=build --all --configuration=production

# Build specific app
nx build web --configuration=production
nx build api --configuration=production
```

## Project URLs

| Environment | Web | API | API Docs |
|-------------|-----|-----|----------|
| Development | http://localhost:4200 | http://localhost:3000 | http://localhost:3000/api/docs |
| Production | https://yourdomain.com | https://yourdomain.com/api | https://yourdomain.com/api/docs |

## Key Commands

| Command | Description |
|---------|-------------|
| `nx serve web` | Start Angular dev server |
| `nx serve api` | Start NestJS dev server |
| `nx build web` | Build Angular app |
| `nx build api` | Build NestJS app |
| `nx test web` | Run Angular tests |
| `nx test api` | Run NestJS tests |
| `nx lint web` | Lint Angular code |
| `nx lint api` | Lint NestJS code |
| `nx affected:test` | Test affected projects |
| `nx affected:build` | Build affected projects |
| `nx graph` | View dependency graph |

## Directory Structure After Setup

```
portfolio/
├── apps/
│   ├── web/                    # Angular SSR app
│   └── api/                    # NestJS app
├── libs/
│   ├── web/                    # Frontend libraries
│   │   ├── landing/
│   │   ├── portfolio/
│   │   ├── blog/
│   │   ├── garden/
│   │   ├── dashboard/
│   │   └── shared/
│   ├── api/                    # Backend libraries
│   │   ├── core/
│   │   ├── blog/
│   │   ├── garden/
│   │   ├── portfolio/
│   │   └── media/
│   └── shared/
│       └── types/              # Shared interfaces
├── tools/
├── nx.json
├── package.json
├── tsconfig.base.json
└── .env
```

## Next Steps

1. **Set up i18n** - Configure @ngx-translate with Arabic/English JSON files
2. **Create Drizzle schema** - Define database tables in `libs/api/core/src/lib/database/schema/`
3. **Implement auth module** - JWT authentication in `libs/api/core/src/lib/auth/`
4. **Build shared types** - Define interfaces in `libs/shared/types/`
5. **Create seed script** - Sample data for development

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Nx cache issues:**
```bash
nx reset
```

**TypeScript path resolution:**
Ensure `tsconfig.base.json` has paths for all libraries:
```json
{
  "compilerOptions": {
    "paths": {
      "@portfolio/shared/types": ["libs/shared/types/src/index.ts"],
      "@portfolio/web/shared/ui": ["libs/web/shared/ui/src/index.ts"]
    }
  }
}
```
