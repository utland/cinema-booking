import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "src/domain/hall/ports/hall.repository";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "src/domain/movie/ports/movie.repository";
import { Session } from "src/domain/session/models/session.entity";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "src/domain/session/ports/session.repository";
import { NotFoundDomainException } from "../exceptions/not-found.exception";
import { ConflictDomainException } from "../exceptions/conflict.exception";
import { isWithinInterval } from "date-fns";

@Injectable()
export class SessionAccurateTimeService {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository
    ) {}

    public async checkTimeSlot(hallId: string, session: Session): Promise<void> {
        const sessions = await this.sessionRepo.findByHall(hallId);

        const isOccupied = sessions.some(item => {
            const { id, timePeriod } = item;

            if (session.id === id) return false;

            return session.timePeriod.isOverlapped(timePeriod.startTime, timePeriod.endTime);
        });

        if (isOccupied) {
            throw new ConflictDomainException("This time slot is occupied");
        }
    }

    public async checkRentRange(rentStart: Date, rentEnd: Date, session: Session): Promise<void> {
        const isInRange = session.timePeriod.isInRange(rentStart, rentEnd);

        if (!isInRange) {
            throw new ConflictException("Session's time is out from rent date");
        } 
    }
}