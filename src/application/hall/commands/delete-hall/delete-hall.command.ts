import { Command } from "@nestjs/cqrs";

export class DeleteHallCommand extends Command<void> {
    constructor(
        public readonly hallId: string
    ) {
        super();
    }
}