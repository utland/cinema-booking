import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsDate } from "class-validator";

export class FindSessionsByMovieApiDto {
    @IsNotEmpty()
    @IsString()
    movieId: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dateOfSession: Date;
}