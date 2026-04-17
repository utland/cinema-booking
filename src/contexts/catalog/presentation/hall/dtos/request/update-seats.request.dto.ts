import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsUUID, ValidateNested } from "class-validator";

class SeatInfoReq {
    @ApiProperty({ example: 2, description: "Row number of the seat" })
    @IsNotEmpty()
    @IsNumber()
    row: number;

    @ApiProperty({ example: 3, description: "Column number of the seat" })
    @IsNotEmpty()
    @IsNumber()
    column: number;
}

export class UpdateSeatsReqDto {
    @ApiProperty({
        example: "f2c9bfa5-70e9-4bf8-9ff3-4b311abad4b0",
        description: "Identifier of the hall to update seats for"
    })
    @IsNotEmpty()
    @IsUUID()
    hallId: string;

    @ApiProperty({ type: [SeatInfoReq], example: [{ row: 2, column: 3 }], description: "New seat layout for the hall" })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SeatInfoReq)
    seats: SeatInfoReq[];
}
