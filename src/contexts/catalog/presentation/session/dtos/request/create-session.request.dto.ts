import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsDate, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateSessionReqDto {
    @ApiProperty({
        example: "2026-06-10T14:00:00.000Z",
        type: String,
        format: "date-time",
        description: "Start time of the session"
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startTime: Date;

    @ApiProperty({
        example: "2026-06-10T16:30:00.000Z",
        type: String,
        format: "date-time",
        description: "End time of the session"
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    finishTime: Date;

    @ApiProperty({
        example: "2026-06-09T14:00:00.000Z",
        type: String,
        format: "date-time",
        description: "Deadline for booking tickets for this session"
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    bookingTime: Date;

    @ApiProperty({ example: 250, description: "Base ticket price for the session" })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    basePrice: number;

    @ApiProperty({ example: "f421d2e3-0abc-4b4b-a5bb-1234567890ab", description: "Movie identifier for this session" })
    @IsNotEmpty()
    @IsString()
    movieId: string;

    @ApiProperty({
        example: "1f39c2f5-3b67-4b20-8c7a-ae9f1a6b2cfa",
        description: "Hall identifier where the session takes place"
    })
    @IsNotEmpty()
    @IsString()
    hallId: string;
}
