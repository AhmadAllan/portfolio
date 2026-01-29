import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, AuthUser } from '@portfolio/web-shared';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overview">
      <h1 class="overview__title">Dashboard</h1>
      @if (user) {
        <p class="overview__welcome">Welcome back, {{ user.name }}!</p>
      }
      <div class="overview__grid">
        <div class="overview__card">
          <h3>Blog Posts</h3>
          <p class="overview__stat">0</p>
        </div>
        <div class="overview__card">
          <h3>Garden Notes</h3>
          <p class="overview__stat">0</p>
        </div>
        <div class="overview__card">
          <h3>Media Files</h3>
          <p class="overview__stat">0</p>
        </div>
        <div class="overview__card">
          <h3>Comments</h3>
          <p class="overview__stat">0</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview {
      padding: 1.5rem;
    }

    .overview__title {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .overview__welcome {
      color: var(--color-text-muted, #a1a1aa);
      margin-bottom: 2rem;
    }

    .overview__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .overview__card {
      background: var(--color-deep, #1a1a2e);
      padding: 1.5rem;
      border-radius: var(--radius-md, 0.5rem);
    }

    .overview__card h3 {
      font-size: 0.875rem;
      color: var(--color-text-muted, #a1a1aa);
      margin-bottom: 0.5rem;
    }

    .overview__stat {
      font-size: 2rem;
      font-weight: 600;
    }
  `],
})
export class OverviewComponent implements OnInit {
  user: AuthUser | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }
}
