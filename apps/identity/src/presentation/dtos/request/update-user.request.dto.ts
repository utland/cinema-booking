import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserReqDto {
    @ApiProperty({ example: "John", description: "Updated first name of the user" })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ example: "Doe", description: "Updated last name of the user" })
    @IsNotEmpty()
    @IsString()
    lastName: string;
}
