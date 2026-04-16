import { ApiProperty } from "@nestjs/swagger";
import { HallType } from "src/contexts/catalog/domain/hall/models/hall.entity";

class SeatInfoDto {
    @ApiProperty({ example: 1, description: "Seat row" })
    row: number;

    @ApiProperty({ example: 5, description: "Seat column" })
    column: number;
}

export class FindHallByIdResDto {
    @ApiProperty({ example: "Main Hall", description: "Name of the hall" })
    name: string;

    @ApiProperty({ enum: HallType, example: HallType.STANDART, description: "Type of the hall" })
    type: HallType;

    @ApiProperty({ type: [SeatInfoDto], description: "List of seats in the hall" })
    seats: SeatInfoDto[];
}
