import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { HallType } from "src/domain/hall/models/hall.entity";

export class UpdateHallInfoApiDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEnum(HallType)
    type: HallType;
}
