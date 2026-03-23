import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  finishTime: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNotEmpty()
  @IsString()
  movieId: string;

  @IsNotEmpty()
  @IsString()
  hallId: string;
}
