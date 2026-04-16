import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsDate } from "class-validator";

export class FindSessionsByMovieReqDto {
    @ApiProperty({ example: "f421d2e3-0abc-4b4b-a5bb-1234567890ab", description: "Movie identifier to search sessions for" })
    @IsNotEmpty()
    @IsString()
    movieId: string;

    @ApiProperty({ example: "2026-06-10T00:00:00.000Z", type: String, format: "date-time", description: "Date of the session search" })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dateOfSession: Date;
}
