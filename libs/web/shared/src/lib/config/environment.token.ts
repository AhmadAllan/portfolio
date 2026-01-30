import { InjectionToken } from '@angular/core';

export interface Environment {
  production: boolean;
  apiUrl: string;
  apiVersion: string;
  authCookieDomain?: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export const ENVIRONMENT = new InjectionToken<Environment>('environment');
