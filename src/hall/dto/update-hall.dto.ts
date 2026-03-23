import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateHallDto } from './create-hall.dto';

export class UpdateHallDto extends PartialType(
  PickType(CreateHallDto, ['name', 'type'] as const),
) {}
