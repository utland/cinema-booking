import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { HallUpdatedEvent } from "@app/catalog/application/common/events/hall-updated.event";
import { SESSION_IN_MOVIE_REPOSITORY_TOKEN, type SessionInMovieRepository } from "../../../ports/session-card.repository";

@EventsHandler(HallUpdatedEvent)
export class SessionCardOnHallUpdatedHandler implements IEventHandler<HallUpdatedEvent> {
    constructor(
        @Inject(SESSION_IN_MOVIE_REPOSITORY_TOKEN)
        private readonly sessionInMovieRepo: SessionInMovieRepository
    ) {}

    async handle({ name, seats }: HallUpdatedEvent) {
        await this.sessionInMovieRepo.updateHall(name, seats.length);
    }
}