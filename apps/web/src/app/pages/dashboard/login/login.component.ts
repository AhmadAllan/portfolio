import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@portfolio/web-shared';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login">
      <div class="login__card">
        <h1 class="login__title">Admin Login</h1>
        @if (error) {
          <div class="login__error" role="alert">{{ error }}</div>
        }
        <form (ngSubmit)="onSubmit()" class="login__form">
          <div class="login__field">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              autocomplete="email"
              [disabled]="isLoading"
            />
          </div>
          <div class="login__field">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              autocomplete="current-password"
              [disabled]="isLoading"
            />
          </div>
          <button type="submit" class="login__button" [disabled]="isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: var(--color-abyss, #0f0f1a);
    }

    .login__card {
      background: var(--color-deep, #1a1a2e);
      padding: 2rem;
      border-radius: var(--radius-md, 0.5rem);
      width: 100%;
      max-width: 400px;
      color: var(--color-text, #fff);
    }

    .login__title {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .login__error {
      background: rgba(220, 38, 38, 0.2);
      border: 1px solid #dc2626;
      color: #fca5a5;
      padding: 0.75rem;
      border-radius: var(--radius-sm, 0.25rem);
      margin-bottom: 1rem;
      text-align: center;
    }

    .login__field {
      margin-bottom: 1rem;
    }

    .login__field label {
      display: block;
      margin-bottom: 0.25rem;
    }

    .login__field input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #333;
      border-radius: var(--radius-sm, 0.25rem);
      background: var(--color-void, #0f0f1a);
      color: var(--color-text, #fff);
      transition: border-color var(--transition-fast, 150ms);
    }

    .login__field input:focus {
      outline: none;
      border-color: var(--color-tentacle, #4a4ae4);
    }

    .login__field input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login__button {
      width: 100%;
      padding: 0.75rem;
      background: var(--color-tentacle, #4a4ae4);
      color: #fff;
      border: none;
      border-radius: var(--radius-sm, 0.25rem);
      cursor: pointer;
      font-weight: 500;
      transition: background var(--transition-fast, 150ms);
    }

    .login__button:hover:not(:disabled) {
      background: #3a3ad4;
    }

    .login__button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;

    this.error = '';
    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.data?.message || 'Invalid email or password';
      },
    });
  }
}
