import { IsOptional, IsEnum, IsString, IsInt, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { postStatusEnum } from '@portfolio/api/core';

export class ListPostsDto {
  @IsOptional()
  @IsEnum(postStatusEnum)
  status?: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  tagId?: string;

  @IsOptional()
  @IsString()
  seriesId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'publishedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
