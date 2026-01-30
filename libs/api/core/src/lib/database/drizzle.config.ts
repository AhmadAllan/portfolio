import { defineConfig } from 'drizzle-kit';

const getDatabaseUrl = () => {
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = process.env.POSTGRES_PORT || '5432';
  const user = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || '';
  const database = process.env.POSTGRES_DB || 'portfolio';

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

export default defineConfig({
  schema: './libs/api/core/src/lib/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
