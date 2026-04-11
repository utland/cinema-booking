import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TicketStatus } from "../entities/ticket.entity";

export class UpdateTicketStatusDto {
    @IsNotEmpty()
    @IsEnum(TicketStatus)
    status: TicketStatus;

    @IsNotEmpty()
    @IsString()
    ticketId: string;
}
