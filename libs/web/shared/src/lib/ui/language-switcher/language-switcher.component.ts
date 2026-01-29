import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { I18nService, Language } from '../../i18n/i18n.service';
import { LanguageDetectorService } from '../../i18n/language-detector.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="toggleLanguage()"
      class="language-switcher"
      [attr.aria-label]="currentLang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'"
    >
      <span class="language-switcher__current">{{ currentLang === 'ar' ? 'ع' : 'En' }}</span>
      <span class="language-switcher__label">{{ currentLang === 'ar' ? 'English' : 'العربية' }}</span>
    </button>
  `,
  styles: [`
    .language-switcher {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid currentColor;
      border-radius: 0.25rem;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.875rem;
      transition: background-color 0.2s, color 0.2s;
    }

    .language-switcher:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .language-switcher:focus {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }

    .language-switcher__current {
      font-weight: 600;
    }

    .language-switcher__label {
      opacity: 0.8;
    }
  `],
})
export class LanguageSwitcherComponent implements OnInit, OnDestroy {
  currentLang: Language = 'ar';
  private destroy$ = new Subject<void>();

  constructor(
    private i18nService: I18nService,
    private languageDetector: LanguageDetectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.i18nService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLang = lang;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLang === 'ar' ? 'en' : 'ar';
    this.switchLanguage(newLang);
  }

  switchLanguage(lang: Language): void {
    // Store preference
    this.languageDetector.storeLanguage(lang);

    // Update i18n service
    this.i18nService.setLanguage(lang);

    // Update URL if using language prefix routing
    const currentUrl = this.router.url;
    const newUrl = this.replaceLanguageInUrl(currentUrl, lang);

    if (newUrl !== currentUrl) {
      this.router.navigateByUrl(newUrl);
    }
  }

  private replaceLanguageInUrl(url: string, newLang: Language): string {
    // Replace /ar/ with /en/ or vice versa
    if (url.startsWith('/ar')) {
      return url.replace(/^\/ar/, `/${newLang}`);
    }
    if (url.startsWith('/en')) {
      return url.replace(/^\/en/, `/${newLang}`);
    }
    // If no language prefix, add one
    return `/${newLang}${url}`;
  }
}
