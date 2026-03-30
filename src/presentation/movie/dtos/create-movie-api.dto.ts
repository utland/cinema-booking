import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsDate } from "class-validator";

export class CreateMovieApiDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    duration: number;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    genre: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    rentStart: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    rentEnd: Date;
}