import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ValidateUserApiDto {
    @IsNotEmpty()
    @IsString()
    login: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}