import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { I18nService } from '@portfolio/web-shared';

export const languageGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const i18nService = inject(I18nService);
  const lang = route.data['lang'] as 'ar' | 'en';

  if (lang && (lang === 'ar' || lang === 'en')) {
    i18nService.setLanguage(lang);
  }

  return true;
};
