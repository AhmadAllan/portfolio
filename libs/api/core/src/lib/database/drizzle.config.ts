import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './libs/api/core/src/lib/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL'] || 'postgresql://localhost:5432/portfolio',
  },
});
