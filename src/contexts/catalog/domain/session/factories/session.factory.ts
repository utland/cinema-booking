import { Inject, Injectable } from "@nestjs/common";
import { Session } from "../models/session.entity";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "../../movie/ports/movie.repository";
import { DomainFactory } from "src/common/interfaces/domain-factory.i";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "../../hall/ports/hall.repository";
import { SessionAccurateTimeService } from "../../common/domain-services/session-accurate-time.service";
import { NotFoundDomainException } from "src/common/domain/domain-exceptions/not-found.exception";

interface SessionFactoryArgs {
    movieId: string;
    hallId: string;
    basePrice: number;
    startTime: Date;
    endTime: Date;
}

@Injectable()
export class SessionFactory implements DomainFactory<Session> {
    constructor(
        @Inject(MOVIE_REPOSITORY_TOKEN)
        private readonly movieRepo: MovieRepository,

        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository,

        private readonly sessionAccurateTimeService: SessionAccurateTimeService
    ) {}

    public async create(args: SessionFactoryArgs): Promise<Session> {
        const { movieId, hallId, basePrice, startTime, endTime } = args;

        const hall = await this.hallRepo.findById(hallId);
        if (!hall) throw new NotFoundDomainException("This hall is not found");

        const movie = await this.movieRepo.findById(movieId);
        if (!movie) throw new NotFoundDomainException("This movie is not found");

        const session = new Session(movieId, hallId, basePrice, startTime, endTime);

        await this.sessionAccurateTimeService.checkTimeSlot(hallId, session);
        await this.sessionAccurateTimeService.checkRentRange(movie.rentDate.start, movie.rentDate.end, session);

        return session;
    }
}
