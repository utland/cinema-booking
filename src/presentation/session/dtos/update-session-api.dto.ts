import { Type } from "class-transformer";
import { IsNotEmpty, IsDate, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateSessionApiDto {
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
}