import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../i18n/i18n.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [attr.dir]="direction" class="layout">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .layout {
      min-height: 100vh;
    }
  `],
})
export class LayoutComponent implements OnInit {
  direction: 'rtl' | 'ltr' = 'rtl';

  constructor(private i18nService: I18nService) {}

  ngOnInit(): void {
    this.i18nService.currentDirection$.subscribe((dir) => {
      this.direction = dir;
    });
  }
}
