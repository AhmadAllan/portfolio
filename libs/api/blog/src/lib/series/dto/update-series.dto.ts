import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSeriesDto } from './create-series.dto';

export class UpdateSeriesDto extends PartialType(
  OmitType(CreateSeriesDto, ['slug'] as const)
) {}
