import { SessionCreatedEvent } from "@app/catalog/application/common/events/session-created.event";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { SESSION_IN_MOVIE_REPOSITORY_TOKEN, type SessionInMovieRepository } from "../../../ports/session-card.repository";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "@app/catalog/domain/hall/ports/hall.repository";

@EventsHandler(SessionCreatedEvent)
export class SessionCardCreatedHandler implements IEventHandler<SessionCreatedEvent> {
    constructor(
        @Inject(SESSION_IN_MOVIE_REPOSITORY_TOKEN)
        private readonly sessionInMovieRepo: SessionInMovieRepository,

        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository
    ) {}

    async handle({ sessionId, hallId, startTime, finishTime, bookingTime, basePrice }: SessionCreatedEvent) {
        const hall = await this.hallRepo.findById(hallId);
        if (!hall) return;

        await this.sessionInMovieRepo.save(
            { sessionId, start: startTime, end: finishTime, bookingTime, basePrice }, 
            hall
        );
    }
}