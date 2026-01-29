import { Route } from '@angular/router';
import { languageGuard } from './guards/language.guard';

// Language-prefixed routes for bilingual support
export const appRoutes: Route[] = [
  // Redirect root to default language (Arabic)
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'ar',
  },
  // Arabic routes
  {
    path: 'ar',
    canActivate: [languageGuard],
    data: { lang: 'ar' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      // Portfolio routes will be added here
      // Blog routes will be added here
      // Garden routes will be added here
    ],
  },
  // English routes
  {
    path: 'en',
    canActivate: [languageGuard],
    data: { lang: 'en' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      // Portfolio routes will be added here
      // Blog routes will be added here
      // Garden routes will be added here
    ],
  },
  // Dashboard routes (not language-prefixed)
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
  // Fallback - redirect unknown paths
  {
    path: '**',
    redirectTo: 'ar',
  },
];
