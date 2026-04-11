import { Command } from "@nestjs/cqrs";

export class UpdateSessionCommand extends Command<void> {
    constructor(
        public readonly sessionId: string,
        public readonly startTime: Date,
        public readonly finishTime: Date,
        public readonly basePrice: number
    ) {
        super();
    }
}
