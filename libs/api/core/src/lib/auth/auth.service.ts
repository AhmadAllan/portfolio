import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db, users, refreshTokens } from '../database/db';
import { LoginDto } from './dto/login.dto';
import { AuthUserDto, TokenPayload } from './dto/auth-response.dto';
import { ulid } from 'ulid';

/**
 * JWT access and refresh tokens pair
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Cookie configuration options for secure token storage
 */
export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge: number;
  domain?: string;
}

/**
 * Authentication service handling JWT-based authentication with refresh tokens
 *
 * Implements secure authentication flow:
 * - Password hashing with bcrypt
 * - JWT access tokens (15 minutes)
 * - JWT refresh tokens (7 days) stored in database
 * - HttpOnly, Secure cookies for token storage
 * - Token rotation on refresh
 *
 * @example
 * // Login user
 * const { user, tokens } = await authService.login({ email, password });
 *
 * @example
 * // Refresh access token
 * const newTokens = await authService.refresh(refreshToken);
 */
@Injectable()
export class AuthService {
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly isProduction: boolean;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.accessTokenExpiry = '15m';
    this.refreshTokenExpiry = '7d';
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  /**
   * Validate user credentials
   *
   * @param email - User email address
   * @param password - Plain text password
   * @returns Authenticated user DTO or null if invalid
   */
  async validateUser(email: string, password: string): Promise<AuthUserDto | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  /**
   * Authenticate user with email and password
   *
   * @param loginDto - Login credentials
   * @returns User data and JWT tokens
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<{ user: AuthUserDto; tokens: AuthTokens }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    // Store refresh token in database
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  /**
   * Refresh access token using a valid refresh token
   *
   * Validates the refresh token, generates new tokens, and rotates the refresh token
   *
   * @param refreshToken - Current refresh token
   * @returns New access and refresh tokens
   * @throws UnauthorizedException if refresh token is invalid or expired
   */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check if refresh token exists in database
      const [storedToken] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, refreshToken))
        .limit(1);

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.sub))
        .limit(1);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email);

      // Update refresh token in database
      await this.updateRefreshToken(storedToken.id, tokens.refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user by invalidating their refresh token
   *
   * @param refreshToken - Refresh token to invalidate
   */
  async logout(refreshToken: string): Promise<void> {
    // Delete refresh token from database
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
  }

  /**
   * Logout user from all devices by invalidating all refresh tokens
   *
   * @param userId - User ID
   */
  async logoutAll(userId: string): Promise<void> {
    // Delete all refresh tokens for user
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  }

  private async generateTokens(userId: string, email: string): Promise<AuthTokens> {
    const payload: TokenPayload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.accessTokenExpiry,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.refreshTokenExpiry,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await db.insert(refreshTokens).values({
      id: ulid(),
      userId,
      token,
      expiresAt,
    });
  }

  private async updateRefreshToken(tokenId: string, newToken: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db
      .update(refreshTokens)
      .set({ token: newToken, expiresAt })
      .where(eq(refreshTokens.id, tokenId));
  }

  /**
   * Get secure cookie options for access token
   *
   * Features:
   * - HttpOnly: Prevents XSS attacks
   * - Secure: Requires HTTPS
   * - SameSite: CSRF protection (strict in production, lax in development)
   * - 15 minute expiration
   *
   * @returns Cookie configuration object
   */
  getAccessTokenCookieOptions(): CookieOptions {
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    return {
      httpOnly: true,
      secure: true, // Always use secure cookies (HTTPS required)
      sameSite: this.isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
      ...(cookieDomain && { domain: cookieDomain }),
    };
  }

  /**
   * Get secure cookie options for refresh token
   *
   * Features:
   * - HttpOnly: Prevents XSS attacks
   * - Secure: Requires HTTPS
   * - SameSite: CSRF protection (strict in production, lax in development)
   * - Scoped to /api/v1/auth for additional security
   * - 7 day expiration
   *
   * @returns Cookie configuration object
   */
  getRefreshTokenCookieOptions(): CookieOptions {
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    return {
      httpOnly: true,
      secure: true, // Always use secure cookies (HTTPS required)
      sameSite: this.isProduction ? 'strict' : 'lax',
      path: '/api/v1/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      ...(cookieDomain && { domain: cookieDomain }),
    };
  }

  /**
   * Get cookie options for clearing authentication cookies
   *
   * Sets maxAge to 0 to immediately expire the cookie
   *
   * @returns Cookie configuration object
   */
  getClearCookieOptions(): CookieOptions {
    const cookieDomain = this.configService.get<string>('COOKIE_DOMAIN');

    return {
      httpOnly: true,
      secure: true, // Always use secure cookies
      sameSite: this.isProduction ? 'strict' : 'lax',
      path: '/',
      maxAge: 0,
      ...(cookieDomain && { domain: cookieDomain }),
    };
  }
}
