import { ApiProperty } from "@nestjs/swagger";

export class ValidateUserResDto {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    accessToken: string;
}
