import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateTicketReqDto {
    @ApiProperty({
        example: "d4a7181f-1f9a-4e47-bf0a-5c8c87444d1a",
        description: "Session identifier for which the ticket is being booked",
    })
    @IsNotEmpty()
    @IsUUID()
    sessionId: string;

    @ApiProperty({
        example: "f5a2260a-2e4f-4584-b21f-94dc1c2b8f07",
        description: "Seat identifier inside the hall",
    })
    @IsNotEmpty()
    @IsUUID()
    seatId: string;

    @ApiProperty({
        example: "8b1d8a27-9d57-4d70-88a4-321d52e01b7f",
        description: "Hall identifier where the session takes place",
    })
    @IsNotEmpty()
    @IsUUID()
    hallId: string;
}
