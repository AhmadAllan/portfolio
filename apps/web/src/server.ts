import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Supported languages for the bilingual portfolio
 */
type Language = 'ar' | 'en';
const DEFAULT_LANGUAGE: Language = 'ar';
const SUPPORTED_LANGUAGES: Language[] = ['ar', 'en'];

/**
 * Detect preferred language from request headers
 */
function detectLanguageFromRequest(req: Request): Language {
  // Check Accept-Language header
  const acceptLanguage = req.headers['accept-language'] || '';

  // Parse Accept-Language header (e.g., "ar-SA,ar;q=0.9,en-US;q=0.8,en;q=0.7")
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, qValue] = lang.trim().split(';q=');
      return {
        code: code.split('-')[0].toLowerCase(), // Get primary subtag (e.g., 'ar' from 'ar-SA')
        quality: qValue ? parseFloat(qValue) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first supported language
  for (const lang of languages) {
    if (SUPPORTED_LANGUAGES.includes(lang.code as Language)) {
      return lang.code as Language;
    }
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Check if URL has a language prefix
 */
function hasLanguagePrefix(url: string): boolean {
  return SUPPORTED_LANGUAGES.some((lang) =>
    url.startsWith(`/${lang}/`) || url === `/${lang}`
  );
}

/**
 * Language detection and redirect middleware
 * Redirects requests without language prefix to the appropriate language version
 */
function languageRedirectMiddleware(req: Request, res: Response, next: NextFunction): void {
  const url = req.url;

  // Skip for static assets, API routes, and dashboard
  if (
    url.startsWith('/assets/') ||
    url.startsWith('/api/') ||
    url.startsWith('/dashboard') ||
    url.includes('.')  // Static files with extensions
  ) {
    next();
    return;
  }

  // If URL already has language prefix, continue
  if (hasLanguagePrefix(url)) {
    next();
    return;
  }

  // Detect language and redirect
  const detectedLang = detectLanguageFromRequest(req);
  const newUrl = `/${detectedLang}${url === '/' ? '' : url}`;

  res.redirect(302, newUrl);
}

/**
 * Apply language redirect middleware
 */
app.use(languageRedirectMiddleware);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
