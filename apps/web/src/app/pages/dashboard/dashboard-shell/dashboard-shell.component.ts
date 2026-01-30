import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@portfolio/web-shared';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="dashboard">
      <aside class="dashboard__sidebar">
        <div class="dashboard__brand">
          <h2>Dashboard</h2>
        </div>
        <nav class="dashboard__nav">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Overview
          </a>
          <a routerLink="/dashboard/posts" routerLinkActive="active">
            Blog Posts
          </a>
          <a routerLink="/dashboard/notes" routerLinkActive="active">
            Garden Notes
          </a>
          <a routerLink="/dashboard/portfolio" routerLinkActive="active">
            Portfolio
          </a>
          <a routerLink="/dashboard/media" routerLinkActive="active">
            Media Library
          </a>
          <a routerLink="/dashboard/comments" routerLinkActive="active">
            Comments
          </a>
        </nav>
        <div class="dashboard__footer">
          <button (click)="logout()" class="dashboard__logout">
            Logout
          </button>
        </div>
      </aside>
      <main class="dashboard__content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      min-height: 100vh;
      background: var(--color-abyss, #0f0f1a);
    }

    .dashboard__sidebar {
      width: 250px;
      background: var(--color-deep, #1a1a2e);
      color: var(--color-text, #fff);
      display: flex;
      flex-direction: column;
    }

    .dashboard__brand {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dashboard__brand h2 {
      font-size: 1.25rem;
      margin: 0;
    }

    .dashboard__nav {
      flex: 1;
      padding: 1rem 0;
    }

    .dashboard__nav a {
      display: block;
      padding: 0.75rem 1.5rem;
      color: var(--color-text-muted, #a1a1aa);
      text-decoration: none;
      transition: background var(--transition-fast, 150ms), color var(--transition-fast, 150ms);
    }

    .dashboard__nav a:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--color-text, #fff);
    }

    .dashboard__nav a.active {
      background: rgba(74, 74, 228, 0.2);
      color: var(--color-glow, #7f7fff);
      border-inline-start: 3px solid var(--color-tentacle, #4a4ae4);
    }

    .dashboard__footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dashboard__logout {
      width: 100%;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-sm, 0.25rem);
      color: var(--color-text, #fff);
      cursor: pointer;
      transition: background var(--transition-fast, 150ms);
    }

    .dashboard__logout:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .dashboard__content {
      flex: 1;
      background: var(--color-abyss, #0f0f1a);
      color: var(--color-text, #fff);
      overflow-y: auto;
    }
  `],
})
export class DashboardShellComponent {
  private destroyRef = inject(DestroyRef);

  constructor(private authService: AuthService) {}

  logout(): void {
    const subscription = this.authService.logout().subscribe();
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
