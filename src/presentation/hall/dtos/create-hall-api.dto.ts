import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsNumber, ValidateNested, IsArray } from "class-validator";
import { HallType, SeatInfoType } from "src/domain/hall/models/hall.entity";

class SeatInfoApi {
    @IsNotEmpty()
    @IsNumber()
    row: number;

    @IsNotEmpty()
    @IsNumber()
    column: number;
}

export class CreateHallApiDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(HallType)
    type: HallType;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SeatInfoApi)
    seats: SeatInfoApi[]
}