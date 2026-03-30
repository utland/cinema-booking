import { TicketStatus } from "src/domain/ticket/models/ticket.entity";

export type UpdateTicketStatusDto = {
    ticketId: string;
    status: TicketStatus;
    userId: string;
}