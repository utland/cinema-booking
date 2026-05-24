import { SessionCreatedEvent } from "@app/catalog/application/common/events/session-created.event";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import {
    SESSION_WITH_HALL_REPOSITORY_TOKEN,
    type SessionWithHallRepository
} from "../../../ports/session-with-hall.repository";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "@app/catalog/domain/hall/ports/hall.repository";

@EventsHandler(SessionCreatedEvent)
export class SessionWithHallCreatedHandler implements IEventHandler<SessionCreatedEvent> {
    constructor(
        @Inject(SESSION_WITH_HALL_REPOSITORY_TOKEN)
        private readonly sessionWithHallRepo: SessionWithHallRepository,

        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository
    ) {}

    async handle({ sessionId, hallId, startTime, finishTime, bookingTime }: SessionCreatedEvent) {
        const hall = await this.hallRepo.findById(hallId);
        if (!hall) return;

        await this.sessionWithHallRepo.save({ sessionId, start: startTime, end: finishTime, bookingTime }, hall);
    }
}
