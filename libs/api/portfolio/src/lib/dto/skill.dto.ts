import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { SkillCategory } from '@portfolio/shared-types';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nameEn?: string;

  @IsEnum(SkillCategory)
  category!: SkillCategory;

  @IsInt()
  @Min(0)
  @Max(100)
  proficiency!: number;

  @IsInt()
  @Min(0)
  order!: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  icon?: string;
}

export class UpdateSkillDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nameEn?: string;

  @IsEnum(SkillCategory)
  @IsOptional()
  category?: SkillCategory;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  proficiency?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  icon?: string;
}
