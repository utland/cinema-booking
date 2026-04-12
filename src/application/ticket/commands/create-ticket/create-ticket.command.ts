import { Command } from "@nestjs/cqrs";

export class CreateTicketCommand extends Command<void> {
    constructor(
        public readonly sessionId: string,
        public readonly seatId: string,
        public readonly userId: string,
        public readonly hallId: string
    ) {
        super();
    }
}
