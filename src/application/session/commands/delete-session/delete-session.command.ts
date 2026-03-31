import { Command } from "@nestjs/cqrs";

export class DeleteSessionCommand extends Command<void> {
    constructor(
        public readonly sessionId: string
    ) {
        super();
    }
}