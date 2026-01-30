import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  institution!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  institutionEn?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  degree!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  degreeEn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  field?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  fieldEn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  descriptionEn?: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  isCertification!: boolean;

  @IsInt()
  @Min(0)
  order!: number;
}

export class UpdateEducationDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  institution?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  institutionEn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  degree?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  degreeEn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  field?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  fieldEn?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  descriptionEn?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isCertification?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}
