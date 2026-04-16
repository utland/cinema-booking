import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { HallType } from "../../../../domain/hall/models/hall.entity";

export class UpdateHallInfoReqDto {
    @ApiProperty({ example: "Premium Hall", description: "Updated hall name" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ enum: HallType, example: HallType.STANDART, description: "Updated hall type" })
    @IsNotEmpty()
    @IsEnum(HallType)
    type: HallType;
}
