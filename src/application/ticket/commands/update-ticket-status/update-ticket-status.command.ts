import { Command } from "@nestjs/cqrs";
import { TicketStatus } from "src/domain/ticket/models/ticket.entity";

export class UpdateTicketStatusCommand extends Command<void> {
    constructor(
        public readonly ticketId: string,
        public readonly status: TicketStatus,
        public readonly userId: string
    ) {
        super();
    }
}