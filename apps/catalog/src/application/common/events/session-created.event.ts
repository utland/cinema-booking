import { Hall } from "@app/catalog/domain/hall/models/hall.entity";
import { Session } from "@app/catalog/domain/session/models/session.entity";

export class SessionCreatedEvent {
    constructor(
        public readonly sessionId: string,
        public readonly movieId: string,
        public readonly hallId: string,
        public readonly basePrice: number,
        public readonly startTime: Date,
        public readonly finishTime: Date,
        public readonly bookingTime: Date
    ) {}
}
