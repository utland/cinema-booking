import { ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSessionCommand } from "./update-session.command";
import {
    SESSION_REPOSITORY_TOKEN,
    type SessionRepository
} from "src/contexts/catalog/domain/session/ports/session.repository";

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionHandler implements ICommandHandler<UpdateSessionCommand> {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository
    ) {}

    public async execute({
        sessionId,
        startTime,
        finishTime,
        basePrice,
        bookingTime
    }: UpdateSessionCommand): Promise<void> {
        const session = await this.sessionRepo.findById(sessionId);
        if (!session) throw new NotFoundException("This session is not found");

        if (session.isActive()) throw new ConflictException("You cannot update active session");

        session.setPrice(basePrice);
        session.changeTime(startTime, finishTime, bookingTime);

        await this.sessionRepo.save(session);
    }
}
