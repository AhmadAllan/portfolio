import { IsString, IsOptional, IsEnum, IsUrl, IsInt, IsArray, Min } from 'class-validator';
import { postStatusEnum } from '@portfolio/api/core';

export class CreatePostDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsString()
  excerpt: string;

  @IsOptional()
  @IsString()
  excerptEn?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsEnum(postStatusEnum)
  status: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @IsOptional()
  @IsString()
  seriesId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  seriesOrder?: number;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaTitleEn?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaDescriptionEn?: string;

  @IsOptional()
  @IsUrl()
  ogImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedPostIds?: string[];
}
