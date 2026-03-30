import { IsNotEmpty, IsString, IsEnum, IsUUID } from "class-validator";
import { TicketStatus } from "src/domain/ticket/models/ticket.entity";

export class UpdateTicketStatusApiDto {
    @IsNotEmpty()
    @IsUUID()
    ticketId: string;

    @IsNotEmpty()
    @IsEnum(TicketStatus)
    status: TicketStatus;
}