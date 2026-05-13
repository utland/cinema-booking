import { Inject, Injectable } from "@nestjs/common";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { TicketUpdatedEvent } from "@app/shared-kernel/application/events/ticket-updated.event";
import { SESSION_IN_MOVIE_REPOSITORY_TOKEN, type SessionInMovieRepository } from "../../../ports/session-card.repository";

@Injectable()
export class SessionCardOnTicketUpdatedHandler {
    constructor(
        @Inject(SESSION_IN_MOVIE_REPOSITORY_TOKEN)
        private readonly sessionInMovieRepo: SessionInMovieRepository,
    ) {}

    @RabbitSubscribe({
        exchange: "domain_events",
        routingKey: "ticket.updated",
        queue: "catalog-queue"
    })
    async handle(msg: TicketUpdatedEvent) {
        const { sessionId, ticketType } = msg;
        const operation = ticketType !== "canceled" ? "increase" : "decrease";
        
        await this.sessionInMovieRepo.updateAvailable(sessionId, operation);
    }
}