import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMediaMetadataDto {
  @ApiPropertyOptional({
    description: 'Arabic alt text for accessibility',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altText?: string;

  @ApiPropertyOptional({
    description: 'English alt text for accessibility',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  altTextEn?: string;

  @ApiPropertyOptional({
    description: 'Arabic caption for the image',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @ApiPropertyOptional({
    description: 'English caption for the image',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  captionEn?: string;

  @ApiPropertyOptional({
    description: 'Folder ID to move the file to',
  })
  @IsOptional()
  @IsString()
  folderId?: string;
}
