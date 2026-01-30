# Portfolio

A modern, full-stack portfolio application built with Angular 19 and NestJS 11, following best practices and OWASP security standards.

## Features

- Bilingual support (Arabic/English)
- Lovecraftian-themed UI
- Comprehensive admin dashboard
- Type-safe API with JSend response pattern
- JWT authentication with refresh tokens
- PostgreSQL database with Drizzle ORM
- Monorepo architecture with Nx

## Architecture

This project uses an Nx monorepo structure with the following key components:

```text
apps/
├── api/              # NestJS backend application
└── web/              # Angular frontend application

libs/
├── api/              # Backend libraries
│   ├── core/         # Core services (auth, config, logging, middleware)
│   └── portfolio/    # Portfolio domain logic
├── web/              # Frontend libraries
│   ├── shared/       # Shared UI components and services
│   ├── portfolio/    # Portfolio feature
│   ├── landing/      # Landing page
│   └── dashboard/    # Admin dashboard
└── shared/
    └── types/        # Shared TypeScript interfaces
```

## Tech Stack

**Frontend:**
- Angular 19+ (standalone components, signals, modern control flow)
- TypeScript 5.x (strict mode)
- TailwindCSS
- RxJS with proper subscription management

**Backend:**
- NestJS 11
- TypeScript 5.x (strict mode)
- Drizzle ORM
- PostgreSQL
- JWT authentication
- class-validator for input validation

**Development:**
- Nx monorepo
- ESLint + Prettier
- Git hooks (future)

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Backend (.env):**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values
# Required variables:
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
FRONTEND_URL=http://localhost:4200
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
JWT_SECRET=your-secret-here-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-here-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
CORS_ORIGIN=http://localhost:4200
COOKIE_DOMAIN=localhost
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**Frontend (apps/web/src/environments/):**
- `environment.development.ts` - Development configuration
- `environment.production.ts` - Production configuration

4. Set up the database:
```bash
# Run migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

## Development

### Start Development Servers

**Both frontend and backend:**
```bash
npm run dev
```

**Backend only:**
```bash
npx nx serve api
```

**Frontend only:**
```bash
npx nx serve web
```

The application will be available at:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api/v1

### Project Graph

Visualize the project structure and dependencies:
```bash
npx nx graph
```

## Building

**Build all projects:**
```bash
npm run build
```

**Build specific project:**
```bash
npx nx build api
npx nx build web
```

**Production build:**
```bash
npx nx build api --configuration=production
npx nx build web --configuration=production
```

## Testing

**Run all tests:**
```bash
npm test
```

**Run specific project tests:**
```bash
npx nx test api
npx nx test web
```

**Run with coverage:**
```bash
npx nx test api --coverage
```

## Linting

**Lint all projects:**
```bash
npm run lint
```

**Lint specific project:**
```bash
npx nx lint api
npx nx lint web
```

**Auto-fix issues:**
```bash
npx nx lint api --fix
```

## Code Quality

This project follows modern Angular and NestJS best practices:

- **TypeScript Strict Mode**: Full type safety with all strict compiler options enabled
- **Modern Angular Syntax**: Uses @if/@for/@switch control flow (Angular 17+)
- **Memory Safety**: Proper RxJS subscription management with takeUntilDestroyed/DestroyRef
- **Input Validation**: Backend DTOs with class-validator decorators
- **Error Handling**: Centralized error logging and user notifications
- **Security**: OWASP Top 10 coverage, input sanitization, secure cookies, CSRF protection
- **Environment Config**: No hardcoded values, Joi validation on startup

See [docs/REFACTORING-SUMMARY.md](docs/REFACTORING-SUMMARY.md) for detailed improvements.

## Documentation

- [Refactoring Summary](docs/REFACTORING-SUMMARY.md) - Complete overview of all improvements
- [Architecture Decision Records (ADRs)](docs/adr/) - Key architectural decisions
  - [ADR 001: Angular Control Flow Migration](docs/adr/001-angular-control-flow-migration.md)
  - [ADR 002: Environment-Based Configuration](docs/adr/002-environment-based-configuration.md)
  - [ADR 003: RxJS Subscription Management](docs/adr/003-rxjs-subscription-management.md)
- [Subscription Management Guide](libs/web/shared/src/lib/utils/subscription-management.md)

## Security

This project implements OWASP Top 10 security practices:

- JWT authentication with HttpOnly, Secure cookies
- CSRF protection (double-submit cookie pattern)
- Input validation (backend: class-validator, frontend: sanitization utilities)
- SQL injection prevention (Drizzle ORM parameterized queries)
- XSS prevention (Angular automatic escaping + manual sanitization)
- Environment-based secrets management
- Secure cookie configuration (SameSite, Domain)
- Rate limiting (TODO)
- Security headers via Helmet (TODO)

## Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| NODE_ENV | Environment | Yes | development |
| PORT | Server port | No | 3000 |
| API_PREFIX | API route prefix | No | api/v1 |
| FRONTEND_URL | Frontend URL for CORS | Yes | - |
| DATABASE_URL | PostgreSQL connection | Yes | - |
| JWT_SECRET | JWT signing secret (min 32 chars) | Yes | - |
| JWT_REFRESH_SECRET | Refresh token secret (min 32 chars) | Yes | - |
| JWT_ACCESS_EXPIRATION | Access token expiry | No | 15m |
| JWT_REFRESH_EXPIRATION | Refresh token expiry | No | 7d |
| CORS_ORIGIN | Allowed CORS origins | Yes | - |
| COOKIE_DOMAIN | Cookie domain | No | localhost |
| UPLOAD_DIR | File upload directory | No | ./uploads |
| MAX_FILE_SIZE | Max upload size (bytes) | No | 10485760 |

### Frontend (environment.ts)

```typescript
{
  production: boolean;
  apiUrl: string;
  apiVersion: string;
  authCookieDomain?: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}
```

## API Response Format

This project uses the JSend specification for all API responses:

**Success:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Error message",
  "code": "ERROR_CODE",
  "data": { ... }
}
```

**Fail (validation errors):**
```json
{
  "status": "fail",
  "data": {
    "field": "Validation error message"
  }
}
```

## Database Migrations

**Create a new migration:**
```bash
npm run db:generate
```

**Run migrations:**
```bash
npm run db:migrate
```

**Drop all tables (careful!):**
```bash
npm run db:drop
```

## Common Tasks

**Generate a new Angular component:**
```bash
npx nx g @nx/angular:component my-component --project=web-shared
```

**Generate a new NestJS module:**
```bash
npx nx g @nx/nest:module my-module --project=api
```

**Generate a new library:**
```bash
npx nx g @nx/js:library my-lib --directory=libs/shared/my-lib
```

## Deployment

**Production Checklist:**

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Configure secure `DATABASE_URL`
- [ ] Set correct `FRONTEND_URL` and `CORS_ORIGIN`
- [ ] Set `COOKIE_DOMAIN` to your domain
- [ ] Enable HTTPS (cookies require secure flag)
- [ ] Configure production logging/monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure rate limiting
- [ ] Run database migrations
- [ ] Build production bundles

**Build for production:**
```bash
npm run build:prod
```

**Run production backend:**
```bash
cd dist/apps/api
NODE_ENV=production node main.js
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## Troubleshooting

**Database connection errors:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in .env
- Ensure database exists

**Cookie/CORS issues:**
- Verify `FRONTEND_URL` matches your dev server
- Check `COOKIE_DOMAIN` setting
- For local development, use `localhost` not `127.0.0.1`

**TypeScript errors:**
- Run `npm install` to ensure all dependencies are installed
- Check that `tsconfig.base.json` has correct paths

## Learn More

- [Nx Documentation](https://nx.dev)
- [Angular Documentation](https://angular.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

## License

[Add your license here]

## Contact

[Add your contact information here]
