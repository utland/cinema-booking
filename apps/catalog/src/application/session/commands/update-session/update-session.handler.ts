import { ConflictException, Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSessionCommand } from "./update-session.command";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "@app/catalog/domain/session/ports/session.repository";
import { SessionUpdatedEvent } from "@app/catalog/application/common/events/session-updated.event";

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionHandler implements ICommandHandler<UpdateSessionCommand> {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository,

        private readonly eventBus: EventBus
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

        this.eventBus.publish(new SessionUpdatedEvent(
            session.id,
            session.basePrice,
            session.timePeriod.startTime,
            session.timePeriod.endTime,
            session.bookingTime
        ));
    }
}
