import { Type } from "class-transformer";
import { IsNotEmpty, IsDate, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateSessionApiDto {
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
    @IsPositive()
    basePrice: number;

    @IsNotEmpty()
    @IsString()
    movieId: string;

    @IsNotEmpty()
    @IsString()
    hallId: string;
}