import { IsString, IsOptional, IsInt, IsEnum, Min } from 'class-validator';

export const educationTypeEnum = ['degree', 'certification', 'course'] as const;
export type EducationType = typeof educationTypeEnum[number];

export class CreateEducationDto {
  @IsString()
  institution: string;

  @IsString()
  @IsOptional()
  institutionEn?: string;

  @IsString()
  degree: string;

  @IsString()
  @IsOptional()
  degreeEn?: string;

  @IsString()
  field: string;

  @IsString()
  @IsOptional()
  fieldEn?: string;

  @IsInt()
  @Min(1900)
  year: number;

  @IsEnum(educationTypeEnum)
  type: EducationType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsInt()
  @Min(0)
  displayOrder: number;
}
