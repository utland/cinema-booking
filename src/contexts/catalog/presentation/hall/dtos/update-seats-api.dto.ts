import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from "class-validator";

class SeatInfoApi {
    @IsNotEmpty()
    @IsNumber()
    row: number;

    @IsNotEmpty()
    @IsNumber()
    column: number;
}

export class UpdateSeatsApiDto {
    @IsNotEmpty()
    @IsUUID()
    hallId: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SeatInfoApi)
    seats: SeatInfoApi[];
}
