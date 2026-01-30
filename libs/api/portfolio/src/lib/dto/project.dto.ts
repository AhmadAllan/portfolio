import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsInt,
  IsUrl,
  MaxLength,
  Min,
  IsDateString,
  ArrayMinSize,
} from 'class-validator';
import { ProjectStatus } from '@portfolio/shared-types';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  slug!: string;

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
  @MaxLength(2000)
  description!: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  descriptionEn?: string;

  @IsUrl()
  @IsOptional()
  thumbnail?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  techStack!: string[];

  @IsString()
  @IsOptional()
  @MaxLength(100)
  role?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  roleEn?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  gallery?: string[];

  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @IsEnum(ProjectStatus)
  status!: ProjectStatus;

  @IsInt()
  @Min(0)
  order!: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  slug?: string;

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
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  descriptionEn?: string;

  @IsUrl()
  @IsOptional()
  thumbnail?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  techStack?: string[];

  @IsString()
  @IsOptional()
  @MaxLength(100)
  role?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  roleEn?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  gallery?: string[];

  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
