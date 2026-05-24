import { Inject, Injectable } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateSessionCommand } from "./create-session.command";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "@app/catalog/domain/session/ports/session.repository";
import { SessionFactory } from "@app/catalog/domain/session/factories/session.factory";
import { SessionCreatedEvent } from "@app/catalog/application/common/events/session-created.event";

@CommandHandler(CreateSessionCommand)
export class CreateSessionHandler implements ICommandHandler<CreateSessionCommand> {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository,

        private readonly sessionFactory: SessionFactory,

        private readonly eventBus: EventBus
    ) {}

    public async execute({
        startTime,
        finishTime,
        basePrice,
        movieId,
        hallId,
        bookingTime
    }: CreateSessionCommand): Promise<void> {
        const session = await this.sessionFactory.create({
            movieId,
            hallId,
            basePrice,
            startTime,
            endTime: finishTime,
            bookingTime
        });

        await this.sessionRepo.save(session);

        this.eventBus.publish(
            new SessionCreatedEvent(
                session.id,
                session.movieId,
                session.hallId,
                session.basePrice,
                session.timePeriod.startTime,
                session.timePeriod.endTime,
                session.bookingTime
            )
        );
    }
}
