import { Command } from "@nestjs/cqrs";

export class CancelTicketCommand extends Command<void> {
    constructor(
        public readonly ticketId: string,
        public readonly userId: string
    ) {
        super();
    }
}
