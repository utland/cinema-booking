import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { SESSION_WITH_HALL_REPOSITORY_TOKEN, type SessionWithHallRepository } from "../../../ports/session-with-hall.repository";
import { SessionUpdatedEvent } from "@app/catalog/application/common/events/session-updated.event";

@EventsHandler(SessionUpdatedEvent)
export class SessionWithHallUpdatedHandler implements IEventHandler<SessionUpdatedEvent> {
    constructor(
        @Inject(SESSION_WITH_HALL_REPOSITORY_TOKEN)
        private readonly sessionWithHallRepo: SessionWithHallRepository
    ) {}

    async handle({ sessionId, startTime, finishTime, bookingTime }: SessionUpdatedEvent) {
        await this.sessionWithHallRepo.updateSession(
            { sessionId, start: startTime, end: finishTime, bookingTime }
        );
    }
}