import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class UpdateSeatDto {
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @IsNotEmpty()
    @IsString()
    id: string;
}

export class UpdateSeatsDto {
    @IsNotEmpty()
    @IsString()
    hallId: string;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateSeatDto)
    seats: UpdateSeatDto[];
}