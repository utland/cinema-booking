import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class FindSessionByMovieDto {
  @IsNotEmpty()
  @IsString()
  movieId: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateSession: Date;
}
