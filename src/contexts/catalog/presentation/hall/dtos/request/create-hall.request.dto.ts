import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsEnum, IsNumber, ValidateNested, IsArray } from "class-validator";
import { HallType } from "src/contexts/catalog/domain/hall/models/hall.entity";

class SeatInfoApi {
    @ApiProperty({ example: 1, description: "Row number of the seat" })
    @IsNotEmpty()
    @IsNumber()
    row: number;

    @ApiProperty({ example: 5, description: "Column number of the seat" })
    @IsNotEmpty()
    @IsNumber()
    column: number;
}

export class CreateHallReqDto {
    @ApiProperty({ example: "Main Hall", description: "Name of the hall" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ enum: HallType, example: HallType.STANDART, description: "Type of hall" })
    @IsNotEmpty()
    @IsEnum(HallType)
    type: HallType;

    @ApiProperty({ type: [SeatInfoApi], example: [{ row: 1, column: 1 }], description: "List of seats in the hall" })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SeatInfoApi)
    seats: SeatInfoApi[];
}
