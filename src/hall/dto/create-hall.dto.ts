import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { HallType } from '../entities/hall.entity';
import { Type } from 'class-transformer';

export class CreateSeatDto {
  @IsNotEmpty()
  @IsNumber()
  rowNumber: number;

  @IsNotEmpty()
  @IsNumber()
  seatNumber: number;
}

export class CreateHallDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(HallType)
  type: HallType;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSeatDto)
  seats: CreateSeatDto[];
}
