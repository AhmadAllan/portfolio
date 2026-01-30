import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutComponent, LanguageSwitcherComponent } from '@portfolio/web-shared';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, LayoutComponent, LanguageSwitcherComponent],
  template: `
    <app-layout>
      <header class="home__header">
        <app-language-switcher></app-language-switcher>
      </header>
      <main class="home__main">
        <h1>{{ 'nav.home' | translate }}</h1>
        <p>{{ 'common.loading' | translate }}</p>
      </main>
    </app-layout>
  `,
  styles: [`
    .home__header {
      display: flex;
      justify-content: flex-end;
      padding: 1rem;
    }

    .home__main {
      padding: 2rem;
      text-align: center;
    }
  `],
})
export class HomeComponent {}
