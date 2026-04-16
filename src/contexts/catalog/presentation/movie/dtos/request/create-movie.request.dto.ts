import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsDate } from "class-validator";

export class CreateMovieReqDto {
    @ApiProperty({ example: "The Matrix", description: "Movie title" })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: 136, description: "Movie duration in minutes" })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    duration: number;

    @ApiProperty({ example: "A hacker discovers the true nature of reality.", description: "Movie description" })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: "Sci-Fi", description: "Movie genre" })
    @IsNotEmpty()
    @IsString()
    genre: string;

    @ApiProperty({ example: "2026-05-01T18:30:00.000Z", type: String, format: "date-time", description: "Start date of the movie rent period" })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    rentStart: Date;

    @ApiProperty({ example: "2026-06-01T18:30:00.000Z", type: String, format: "date-time", description: "End date of the movie rent period" })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    rentEnd: Date;
}
