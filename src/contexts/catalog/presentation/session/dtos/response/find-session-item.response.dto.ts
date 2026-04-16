import { ApiProperty } from "@nestjs/swagger";

export class FindSessionItemByMovieResDto {
    @ApiProperty({ example: "a1b2c3d4-5e6f-7a8b-9c0d-1234567890ab", description: "Unique identifier of the session" })
    sessionId: string;

    @ApiProperty({ example: "Main Hall", description: "Name of the hall where the session occurs" })
    hallName: string;

    @ApiProperty({ example: "2026-06-10T14:00:00.000Z", type: String, format: "date-time", description: "Session start time" })
    startTime: Date;

    @ApiProperty({ example: "2026-06-10T16:30:00.000Z", type: String, format: "date-time", description: "Session end time" })
    endTime: Date;

    @ApiProperty({ example: "2026-06-09T14:00:00.000Z", type: String, format: "date-time", description: "Deadline for booking tickets for this session" })
    bookingTime: Date;

    @ApiProperty({ example: 250, description: "Base ticket price for the session" })
    basePrice: number;

    @ApiProperty({ example: 45, description: "Number of available seats for the session" })
    availableSeats: number;

    @ApiProperty({ example: 120, description: "Total number of seats in the hall" })
    totalSeats: number;
}
