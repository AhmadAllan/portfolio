import { IsString, IsOptional } from 'class-validator';

export class CreateTagDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameEn?: string;
}
