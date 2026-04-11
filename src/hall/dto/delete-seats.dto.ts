import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class DeleteSeatsDto {
    @IsNotEmpty()
    @IsString()
    hallId: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    seatsId: string[];
}
