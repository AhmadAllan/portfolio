import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiPropertyOptional({
    description: 'Folder ID to upload the file to',
  })
  @IsOptional()
  @IsString()
  folderId?: string;

  @ApiPropertyOptional({
    description: 'Arabic alt text for the image',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;

  @ApiPropertyOptional({
    description: 'English alt text for the image',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altTextEn?: string;
}

export class FileUploadResponseDto {
  @ApiProperty({ description: 'File ID' })
  id: string;

  @ApiProperty({ description: 'Stored filename' })
  filename: string;

  @ApiProperty({ description: 'Original filename' })
  originalFilename: string;

  @ApiProperty({ description: 'MIME type' })
  mimeType: string;

  @ApiProperty({ description: 'File type category' })
  fileType: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'Public URL to the file' })
  path: string;

  @ApiPropertyOptional({ description: 'Thumbnail URL for images' })
  thumbnailPath?: string;

  @ApiPropertyOptional({ description: 'Image width' })
  width?: number;

  @ApiPropertyOptional({ description: 'Image height' })
  height?: number;
}

// Allowed MIME types
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

export type AllowedMimeType = typeof ALLOWED_MIME_TYPES[number];

// Max file size: 10MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
