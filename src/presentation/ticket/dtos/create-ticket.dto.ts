import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateTicketApiDto {
    @IsNotEmpty()
    @IsUUID()
    sessionId: string;

    @IsNotEmpty()
    @IsUUID()
    seatId: string;

    @IsNotEmpty()
    @IsUUID()
    hallId: string;
}
