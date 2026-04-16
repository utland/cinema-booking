import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class CreateUserReqDto {
    @ApiProperty({ example: "user@example.com", description: "Email address of the new user" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: "StrongPassword123", description: "Password for the new user account" })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ example: "user123", description: "Login username for the new user" })
    @IsNotEmpty()
    @IsString()
    login: string;

    @ApiProperty({ example: "John", description: "First name of the new user" })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ example: "Doe", description: "Last name of the new user" })
    @IsNotEmpty()
    @IsString()
    lastName: string;
}
