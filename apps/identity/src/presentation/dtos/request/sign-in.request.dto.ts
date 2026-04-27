import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ValidateUserReqDto {
    @ApiProperty({ example: "user123", description: "Login username or email used for authentication" })
    @IsNotEmpty()
    @IsString()
    login: string;

    @ApiProperty({ example: "StrongPassword123", description: "Password used for authentication" })
    @IsNotEmpty()
    @IsString()
    password: string;
}
