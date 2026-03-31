import { Command } from "@nestjs/cqrs";

export class CreateSessionCommand extends Command<void> {
    constructor(
        public readonly startTime: Date,
        public readonly finishTime: Date,
        public readonly basePrice: number,
        public readonly movieId: string,
        public readonly hallId: string
    ) {
        super();
    }
}