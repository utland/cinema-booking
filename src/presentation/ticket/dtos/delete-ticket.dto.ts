import { IsNotEmpty, IsUUID } from "class-validator";

export class DeleteTicketApiDto {
    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsUUID ()
    ticketId: string;
}