import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenGuard, JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ user: AuthResponseDto['user'] }> {
    const { user, tokens } = await this.authService.login(loginDto);

    // Set HttpOnly cookies
    response.cookie(
      'access_token',
      tokens.accessToken,
      this.authService.getAccessTokenCookieOptions()
    );
    response.cookie(
      'refresh_token',
      tokens.refreshToken,
      this.authService.getRefreshTokenCookieOptions()
    );

    return { user };
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    const refreshToken = request.cookies?.refresh_token;
    const tokens = await this.authService.refresh(refreshToken);

    // Set new cookies
    response.cookie(
      'access_token',
      tokens.accessToken,
      this.authService.getAccessTokenCookieOptions()
    );
    response.cookie(
      'refresh_token',
      tokens.refreshToken,
      this.authService.getRefreshTokenCookieOptions()
    );

    return { message: 'Token refreshed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and invalidate tokens' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    const refreshToken = request.cookies?.refresh_token;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    // Clear cookies
    response.clearCookie('access_token', this.authService.getClearCookieOptions());
    response.clearCookie('refresh_token', {
      ...this.authService.getClearCookieOptions(),
      path: '/api/v1/auth',
    });

    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from all devices' })
  @ApiResponse({ status: 200, description: 'Logged out from all devices' })
  async logoutAll(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    await this.authService.logoutAll(userId);

    // Clear cookies
    response.clearCookie('access_token', this.authService.getClearCookieOptions());
    response.clearCookie('refresh_token', {
      ...this.authService.getClearCookieOptions(),
      path: '/api/v1/auth',
    });

    return { message: 'Logged out from all devices' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'Current user info', type: AuthResponseDto })
  async me(@CurrentUser() user: AuthResponseDto['user']): Promise<{ user: AuthResponseDto['user'] }> {
    return { user };
  }
}
