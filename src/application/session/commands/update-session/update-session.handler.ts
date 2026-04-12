import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSessionCommand } from "./update-session.command";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "src/domain/session/ports/session.repository";

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionHandler implements ICommandHandler<UpdateSessionCommand> {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository
    ) {}

    public async execute({ sessionId, startTime, finishTime, basePrice }: UpdateSessionCommand): Promise<void> {
        const session = await this.sessionRepo.findById(sessionId);

        if (!session) throw new NotFoundException("This session is not found");

        session.setPrice(basePrice);
        session.changeTime(startTime, finishTime);

        await this.sessionRepo.save(session);
    }
}
