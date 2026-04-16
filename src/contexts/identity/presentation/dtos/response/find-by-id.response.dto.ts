
import { ApiProperty } from "@nestjs/swagger";

class TicketInfoDto {
    @ApiProperty({ example: "b5f7d7eb-56c1-4f2b-b9aa-2a5c1f6e1f3b", description: "Ticket identifier" })
    ticketId: string;

    @ApiProperty({ example: "The Matrix", description: "Title of the movie for the ticket" })
    movieTitle: string;

    @ApiProperty({ example: "2026-06-10T14:00:00.000Z", type: String, format: "date-time", description: "Show time for the ticket" })
    showTime: Date;

    @ApiProperty({ example: 1, description: "Row number of the reserved seat" })
    row: number;

    @ApiProperty({ example: 5, description: "Column number of the reserved seat" })
    column: number;
}

export class FindByIdResDto {
    @ApiProperty({ example: "f421d2e3-0abc-4b4b-a5bb-1234567890ab", description: "Unique identifier of the user" })
    id: string;

    @ApiProperty({ example: "user123", description: "Login username of the user" })
    login: string;

    @ApiProperty({ example: "user@example.com", description: "Email address of the user" })
    email: string;

    @ApiProperty({ example: "John", description: "First name of the user" })
    firstName: string;

    @ApiProperty({ example: "Doe", description: "Last name of the user" })
    lastName: string;

    @ApiProperty({ type: [TicketInfoDto], description: "Tickets purchased by the user" })
    tickets: TicketInfoDto[];
}
