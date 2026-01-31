import { IsString, IsOptional, IsArray, IsBoolean, IsInt, IsUrl, Min, ArrayMinSize } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsString()
  thumbnail: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  techStack: string[];

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  roleEn?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  durationEn?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  teamSize?: number;

  @IsString()
  @IsOptional()
  challenges?: string;

  @IsString()
  @IsOptional()
  challengesEn?: string;

  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gallery?: string[];

  @IsInt()
  @Min(0)
  displayOrder: number;

  @IsBoolean()
  featured: boolean;
}
