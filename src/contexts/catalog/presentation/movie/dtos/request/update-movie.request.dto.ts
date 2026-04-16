import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsDate } from "class-validator";

export class UpdateMovieReqDto {
    @ApiProperty({ example: "The Matrix Reloaded", description: "Updated movie title" })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: 138, description: "Updated movie duration in minutes" })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    duration: number;

    @ApiProperty({ example: "The sequel continues the story.", description: "Updated movie description" })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: "Sci-Fi", description: "Updated movie genre" })
    @IsNotEmpty()
    @IsString()
    genre: string;

    @ApiProperty({ example: "2026-05-01T18:30:00.000Z", type: String, format: "date-time", description: "Updated rent start date" })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    rentStart: Date;

    @ApiProperty({ example: "2026-06-01T18:30:00.000Z", type: String, format: "date-time", description: "Updated rent end date" })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    rentEnd: Date;
}
