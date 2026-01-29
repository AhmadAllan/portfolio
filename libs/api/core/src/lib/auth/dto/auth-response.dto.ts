import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ description: 'User ID (ULID)' })
  id: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'User display name' })
  name: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'Authenticated user data' })
  user: AuthUserDto;
}

export class TokenPayload {
  sub: string; // User ID
  email: string;
  iat?: number;
  exp?: number;
}

export class RefreshTokenPayload extends TokenPayload {
  tokenVersion?: number;
}
