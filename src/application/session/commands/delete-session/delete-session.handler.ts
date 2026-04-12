import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteSessionCommand } from "./delete-session.command";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "src/domain/session/ports/session.repository";

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionHandler implements ICommandHandler<DeleteSessionCommand> {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository
    ) {}

    public async execute({ sessionId }: DeleteSessionCommand): Promise<void> {
        const session = await this.sessionRepo.findById(sessionId);
        if (!session) throw new NotFoundException("This session is not found");

        session.checkDeleteCondition();

        await this.sessionRepo.delete(session);
    }
}
