import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { SESSION_WITH_HALL_REPOSITORY_TOKEN, type SessionWithHallRepository } from "../../../ports/session-with-hall.repository";
import { HallUpdatedEvent } from "@app/catalog/application/common/events/hall-updated.event";

@EventsHandler(HallUpdatedEvent)
export class SessionWithHallOnHallUpdatedHandler implements IEventHandler<HallUpdatedEvent> {
    constructor(
        @Inject(SESSION_WITH_HALL_REPOSITORY_TOKEN)
        private readonly sessionWithHallRepo: SessionWithHallRepository
    ) {}

    async handle({ hallId, name, type }: HallUpdatedEvent) {
        await this.sessionWithHallRepo.updateHall(hallId, name, type);
    }
}