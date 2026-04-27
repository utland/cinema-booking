import { ApiProperty } from "@nestjs/swagger";

class SeatInSessionResDto {
    @ApiProperty({ example: "s1a2b3c4-d5e6-7f8a-9b0c-1234567890ab", description: "Unique seat identifier" })
    seatId: string;

    @ApiProperty({ example: 1, description: "Row number of the seat" })
    row: number;

    @ApiProperty({ example: 5, description: "Column number of the seat" })
    column: number;

    @ApiProperty({ example: true, description: "Indicates whether the seat is available" })
    isAvailable: boolean;
}

export class FindSessionResDto {
    @ApiProperty({ example: "a1b2c3d4-5e6f-7a8b-9c0d-1234567890ab", description: "Unique identifier of the session" })
    sessionId: string;

    @ApiProperty({
        example: "2026-06-10T14:00:00.000Z",
        type: String,
        format: "date-time",
        description: "Session start time"
    })
    startTime: Date;

    @ApiProperty({
        example: "2026-06-10T16:30:00.000Z",
        type: String,
        format: "date-time",
        description: "Session end time"
    })
    endTime: Date;

    @ApiProperty({
        example: "1f39c2f5-3b67-4b20-8c7a-ae9f1a6b2cfa",
        description: "Hall identifier where the session takes place"
    })
    hallId: string;

    @ApiProperty({
        example: "2026-06-09T14:00:00.000Z",
        type: String,
        format: "date-time",
        description: "Deadline for booking tickets for this session"
    })
    bookingTime: Date;

    @ApiProperty({ example: "Main Hall", description: "Name of the hall where the session takes place" })
    hallName: string;

    @ApiProperty({ example: "Standard", description: "Type of the hall" })
    hallType: string;

    @ApiProperty({ type: [SeatInSessionResDto], description: "Seat availability map for the session" })
    seats: SeatInSessionResDto[];
}
