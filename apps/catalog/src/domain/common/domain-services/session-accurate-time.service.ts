import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "../../session/ports/session.repository";
import { Session } from "../../session/models/session.entity";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "../../movie/ports/movie.repository";
import { ConflictDomainException } from "@app/shared-kernel/domain/domain-exceptions/conflict.exception";

@Injectable()
export class SessionAccurateTimeService {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository,

        @Inject(MOVIE_REPOSITORY_TOKEN)
        private readonly movieRepo: MovieRepository
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

    public async checkRentRange(movieId: string, session: Session): Promise<void> {
        const movie = await this.movieRepo.findById(movieId);
        if (!movie) throw new NotFoundException("This movie is not found");

        const isInRange = session.timePeriod.isTimePeriodInside(movie.rentDate.start, movie.rentDate.end);
        if (!isInRange) throw new ConflictException("Session's time is out from rent date");

        const isBookingValid = session.bookingTime >= movie.rentDate.start;
        if (!isBookingValid) throw new ConflictException("Booking time should be after rent date");
    }
}
