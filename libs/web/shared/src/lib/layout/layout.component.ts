import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { I18nService, Language, Direction } from '../i18n/i18n.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [attr.dir]="direction" [attr.lang]="language" class="layout">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .layout {
      min-height: 100vh;
    }

    /* RTL-aware layout using CSS logical properties */
    :host {
      display: block;
    }

    /* Base font settings for Arabic/English */
    :host ::ng-deep [dir="rtl"] {
      font-family: 'Noto Kufi Arabic', 'Segoe UI', Tahoma, sans-serif;
    }

    :host ::ng-deep [dir="ltr"] {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
  `],
})
export class LayoutComponent implements OnInit, OnDestroy {
  direction: Direction = 'rtl';
  language: Language = 'ar';
  private destroy$ = new Subject<void>();

  constructor(
    private i18nService: I18nService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.i18nService.currentDirection$
      .pipe(takeUntil(this.destroy$))
      .subscribe((dir) => {
        this.direction = dir;
        this.updateDocumentAttributes();
      });

    this.i18nService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.language = lang;
        this.updateDocumentAttributes();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateDocumentAttributes(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.setAttribute('dir', this.direction);
      this.document.documentElement.setAttribute('lang', this.language);
    }
  }
}
