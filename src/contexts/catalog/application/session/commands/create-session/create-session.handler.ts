import { Inject, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateSessionCommand } from "./create-session.command";
import {
    SESSION_REPOSITORY_TOKEN,
    type SessionRepository
} from "src/contexts/catalog/domain/session/ports/session.repository";
import { SessionFactory } from "src/contexts/catalog/domain/session/factories/session.factory";

@CommandHandler(CreateSessionCommand)
export class CreateSessionHandler implements ICommandHandler<CreateSessionCommand> {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository,

        private readonly sessionFactory: SessionFactory
    ) {}

    public async execute({ startTime, finishTime, basePrice, movieId, hallId, bookingTime }: CreateSessionCommand): Promise<void> {
        const session = await this.sessionFactory.create(
            { movieId, hallId, basePrice, startTime, endTime: finishTime, bookingTime }
        );

        await this.sessionRepo.save(session);
    }
}
