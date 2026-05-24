import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import {
    SESSION_IN_MOVIE_REPOSITORY_TOKEN,
    type SessionInMovieRepository
} from "../../../ports/session-card.repository";
import { Inject } from "@nestjs/common";
import { SessionUpdatedEvent } from "@app/catalog/application/common/events/session-updated.event";

@EventsHandler(SessionUpdatedEvent)
export class SessionCardUpdatedHandler implements IEventHandler<SessionUpdatedEvent> {
    constructor(
        @Inject(SESSION_IN_MOVIE_REPOSITORY_TOKEN)
        private readonly sessionInMovieRepo: SessionInMovieRepository
    ) {}

    async handle({ sessionId, startTime, finishTime, bookingTime, basePrice }: SessionUpdatedEvent) {
        await this.sessionInMovieRepo.updateSession({
            sessionId,
            start: startTime,
            end: finishTime,
            bookingTime,
            basePrice
        });
    }
}
