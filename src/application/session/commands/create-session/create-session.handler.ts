import { Inject, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateSessionCommand } from "./create-session.command";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "src/domain/session/ports/session.repository";
import { Session } from "src/domain/session/models/session.entity";

@CommandHandler(CreateSessionCommand)
export class CreateSessionHandler implements ICommandHandler<CreateSessionCommand> {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository
    ) {}

    public async execute({ startTime, finishTime, basePrice, movieId, hallId }: CreateSessionCommand): Promise<void> {
        const session = new Session(movieId, hallId, basePrice, startTime, finishTime);

        await this.sessionRepo.save(session);
    }
}
