import { IsString, IsOptional, IsBoolean, IsInt, IsEnum, Min, IsDateString } from 'class-validator';

export const employmentTypeEnum = ['full-time', 'part-time', 'contract', 'freelance', 'internship'] as const;
export type EmploymentType = typeof employmentTypeEnum[number];

export class CreateExperienceDto {
  @IsString()
  company: string;

  @IsString()
  @IsOptional()
  companyEn?: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  locationEn?: string;

  @IsEnum(employmentTypeEnum)
  employmentType: EmploymentType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  current: boolean;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsInt()
  @Min(0)
  displayOrder: number;
}
