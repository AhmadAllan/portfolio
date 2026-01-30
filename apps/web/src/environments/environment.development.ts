import { Environment } from '@portfolio/web-shared';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  apiVersion: 'v1',
  authCookieDomain: 'localhost',
  logLevel: 'debug',
};
