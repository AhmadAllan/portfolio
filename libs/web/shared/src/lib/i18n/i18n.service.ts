import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private currentLang = new BehaviorSubject<Language>('ar');
  private currentDir = new BehaviorSubject<Direction>('rtl');

  currentLanguage$ = this.currentLang.asObservable();
  currentDirection$ = this.currentDir.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['ar', 'en']);
    this.translate.setDefaultLang('ar');
  }

  initLanguage(preferredLang?: string): void {
    const browserLang = this.translate.getBrowserLang();
    const lang = this.isValidLanguage(preferredLang)
      ? (preferredLang as Language)
      : this.isValidLanguage(browserLang)
        ? (browserLang as Language)
        : 'ar';

    this.setLanguage(lang);
  }

  setLanguage(lang: Language): void {
    this.translate.use(lang);
    this.currentLang.next(lang);
    this.currentDir.next(lang === 'ar' ? 'rtl' : 'ltr');

    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  getCurrentLanguage(): Language {
    return this.currentLang.value;
  }

  getCurrentDirection(): Direction {
    return this.currentDir.value;
  }

  private isValidLanguage(lang: string | undefined): boolean {
    return lang === 'ar' || lang === 'en';
  }
}
