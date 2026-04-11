import { Command } from "@nestjs/cqrs";

export class PayTicketCommand extends Command<void> {
    constructor(
        public readonly ticketId: string,
        public readonly userId: string,
        public readonly token: string
    ) {
        super();
    }
}
