import { Command } from "@nestjs/cqrs";
import { TicketStatus } from "src/domain/ticket/models/ticket.entity";

export class PayTicketCommand extends Command<void> {
    constructor(
        public readonly ticketId: string,
        public readonly userId: string,
        public readonly token: string
    ) {
        super();
    }
}