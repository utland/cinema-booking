import { Inject, Injectable } from "@nestjs/common";
import { SESSION_WITH_HALL_REPOSITORY_TOKEN, type SessionWithHallRepository } from "../../../ports/session-with-hall.repository";
import { SessionUpdatedEvent } from "@app/catalog/application/common/events/session-updated.event";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { TicketUpdatedEvent } from "@app/shared-kernel/application/events/ticket-updated.event";

@Injectable()
export class SessionWithHallOnTicketUpdatedHandler {
    constructor(
        @Inject(SESSION_WITH_HALL_REPOSITORY_TOKEN)
        private readonly sessionWithHallRepo: SessionWithHallRepository
    ) {}

    @RabbitSubscribe({
        exchange: "domain_events",
        routingKey: "ticket.updated",
        queue: "catalog-queue"
    })
    async handle(msg: TicketUpdatedEvent) {
        const { sessionId, seatId, ticketType } = msg;
        const isAvailable = ticketType === "canceled" ? true : false;
        
        await this.sessionWithHallRepo.updateSeat(sessionId, seatId, isAvailable);
    }
}