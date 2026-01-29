import { IsString, IsOptional, IsInt, IsEnum, Min } from 'class-validator';

export const skillCategoryEnum = ['languages', 'frameworks', 'tools', 'databases', 'cloud', 'other'] as const;
export type SkillCategory = typeof skillCategoryEnum[number];

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsEnum(skillCategoryEnum)
  category: SkillCategory;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsInt()
  @Min(0)
  displayOrder: number;
}
