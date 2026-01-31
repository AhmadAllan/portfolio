import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

/**
 * Modern CSRF protection using double-submit cookie pattern
 * Replaces the deprecated csurf package
 *
 * How it works:
 * 1. Server generates a random token and sends it in a cookie
 * 2. Client reads the token from cookie and sends it in request header
 * 3. Server verifies both values match
 *
 * This is secure because:
 * - Attackers can't read cookies from other domains (Same-Origin Policy)
 * - They can't set custom headers from forms
 * - Even if they could send cookies, they can't read them to set the header
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private readonly COOKIE_NAME = 'XSRF-TOKEN';
  private readonly HEADER_NAME = 'x-xsrf-token';
  private readonly TOKEN_LENGTH = 32;

  // Methods that require CSRF protection
  private readonly PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const method = req.method.toUpperCase();

    // Skip CSRF check for safe methods (GET, HEAD, OPTIONS)
    if (!this.PROTECTED_METHODS.includes(method)) {
      this.ensureTokenCookie(req, res);
      return next();
    }

    // Get tokens
    const cookieToken = req.cookies[this.COOKIE_NAME];
    const headerToken = req.headers[this.HEADER_NAME] as string | undefined;

    // Validate tokens
    if (!cookieToken || !headerToken) {
      throw new ForbiddenException('CSRF token missing');
    }

    // Compare tokens (constant-time comparison to prevent timing attacks)
    if (!this.secureCompare(cookieToken, headerToken)) {
      throw new ForbiddenException('CSRF token mismatch');
    }

    // Token is valid, continue
    next();
  }

  /**
   * Ensure CSRF token cookie exists
   * If not, generate and set a new one
   */
  private ensureTokenCookie(req: Request, res: Response): void {
    if (!req.cookies[this.COOKIE_NAME]) {
      const token = this.generateToken();
      const isProduction =
        this.configService.get('NODE_ENV') === 'production';

      res.cookie(this.COOKIE_NAME, token, {
        httpOnly: false, // Must be readable by JavaScript
        secure: true, // Always use secure cookies
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });
    }
  }

  /**
   * Generate a cryptographically secure random token
   */
  private generateToken(): string {
    return randomBytes(this.TOKEN_LENGTH).toString('base64url');
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   * This is important for security - don't use === for token comparison
   */
  private secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}
