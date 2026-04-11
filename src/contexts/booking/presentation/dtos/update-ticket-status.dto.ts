import { IsNotEmpty, IsString, IsEnum, IsUUID } from "class-validator";
import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";

export class UpdateTicketStatusApiDto {
    @IsNotEmpty()
    @IsUUID()
    ticketId: string;

    @IsNotEmpty()
    @IsEnum(TicketStatus)
    status: TicketStatus;
}
