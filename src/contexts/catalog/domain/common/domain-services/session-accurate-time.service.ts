import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "../../session/ports/session.repository";
import { Session } from "../../session/models/session.entity";
import { ConflictDomainException } from "src/common/domain/domain-exceptions/conflict.exception";

@Injectable()
export class SessionAccurateTimeService {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository
    ) {}

    public async checkTimeSlot(hallId: string, session: Session): Promise<void> {
        const sessions = await this.sessionRepo.findByHall(hallId);

        const isOccupied = sessions.some((item) => {
            const { id, timePeriod } = item;

            if (session.id === id) return false;

            return session.timePeriod.isOverlapped(timePeriod.startTime, timePeriod.endTime);
        });

        if (isOccupied) {
            throw new ConflictDomainException("This time slot is occupied");
        }
    }

    public async checkRentRange(rentStart: Date, rentEnd: Date, session: Session): Promise<void> {
        const isInRange = session.timePeriod.isRangeInside(rentStart, rentEnd);

        if (!isInRange) {
            throw new ConflictException("Session's time is out from rent date");
        }
    }
}
