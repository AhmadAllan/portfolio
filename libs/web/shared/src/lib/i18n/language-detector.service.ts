import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageDetectorService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  detectLanguage(): Language {
    // Check URL path first
    const pathLang = this.detectFromUrl();
    if (pathLang) return pathLang;

    // Check localStorage preference
    const storedLang = this.getStoredLanguage();
    if (storedLang) return storedLang;

    // Check browser language
    const browserLang = this.detectFromBrowser();
    if (browserLang) return browserLang;

    // Default to Arabic
    return 'ar';
  }

  detectFromUrl(): Language | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const path = window.location.pathname;
    if (path.startsWith('/ar')) return 'ar';
    if (path.startsWith('/en')) return 'en';
    return null;
  }

  detectFromBrowser(): Language | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const browserLang = navigator.language?.toLowerCase() || '';
    if (browserLang.startsWith('ar')) return 'ar';
    if (browserLang.startsWith('en')) return 'en';
    return null;
  }

  getStoredLanguage(): Language | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const stored = localStorage.getItem('preferredLanguage');
    if (stored === 'ar' || stored === 'en') return stored;
    return null;
  }

  storeLanguage(lang: Language): void {
    if (!isPlatformBrowser(this.platformId)) return;

    localStorage.setItem('preferredLanguage', lang);
  }

  isValidLanguage(lang: string | null | undefined): lang is Language {
    return lang === 'ar' || lang === 'en';
  }
}
