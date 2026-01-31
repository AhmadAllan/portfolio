import { IsString, IsEmail, IsOptional, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinkDto {
  @IsString()
  platform: string;

  @IsString()
  url: string;

  @IsOptional()
  displayOrder?: number;
}

export class CreateAboutDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  tagline: string;

  @IsString()
  @IsOptional()
  taglineEn?: string;

  @IsString()
  bio: string;

  @IsString()
  @IsOptional()
  bioEn?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  @ArrayMinSize(1)
  socialLinks: SocialLinkDto[];
}
