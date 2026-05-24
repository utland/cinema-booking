import { Hall } from "@app/catalog/domain/hall/models/hall.entity";
import { Session } from "@app/catalog/domain/session/models/session.entity";

export class SessionUpdatedEvent {
    constructor(
        public readonly sessionId: string,
        public readonly basePrice: number,
        public readonly startTime: Date,
        public readonly finishTime: Date,
        public readonly bookingTime: Date
    ) {}
}
