import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../guards/jwt-auth.guard';

/**
 * Decorator to mark a route as public (no authentication required)
 *
 * Usage:
 * @Public()
 * @Get('public-route')
 * publicEndpoint() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
