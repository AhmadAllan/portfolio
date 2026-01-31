import { IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({
    description: 'Folder name',
    example: 'Blog Images',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9\s\-_\u0600-\u06FF]+$/, {
    message: 'Folder name can only contain letters, numbers, spaces, hyphens, underscores, and Arabic characters',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Parent folder ID (for nested folders)',
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateFolderDto {
  @ApiPropertyOptional({
    description: 'New folder name',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9\s\-_\u0600-\u06FF]+$/, {
    message: 'Folder name can only contain letters, numbers, spaces, hyphens, underscores, and Arabic characters',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'New parent folder ID',
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class FolderResponseDto {
  @ApiProperty({ description: 'Folder ID' })
  id: string;

  @ApiProperty({ description: 'Folder name' })
  name: string;

  @ApiPropertyOptional({ description: 'Parent folder ID' })
  parentId?: string;

  @ApiProperty({ description: 'Number of files in folder' })
  fileCount: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
}
