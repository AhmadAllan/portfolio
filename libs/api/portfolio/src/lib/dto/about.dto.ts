import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUrl,
  IsArray,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  platform!: string;

  @IsUrl()
  url!: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;
}

export class CreateAboutDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  titleEn?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  bio!: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  bioEn?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  locationEn?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  @IsOptional()
  socialLinks?: SocialLinkDto[];

  @IsUrl()
  @IsOptional()
  cvUrl?: string;
}

export class UpdateAboutDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  titleEn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(5000)
  bioEn?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  locationEn?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  @IsOptional()
  socialLinks?: SocialLinkDto[];

  @IsUrl()
  @IsOptional()
  cvUrl?: string;
}
