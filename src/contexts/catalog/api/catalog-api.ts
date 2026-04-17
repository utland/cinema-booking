import { Inject, Injectable } from "@nestjs/common";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "../domain/hall/ports/hall.repository";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "../domain/session/ports/session.repository";
import { HallCatalogDto } from "./dto/hall-catalog.dto";
import { SessionCatalogDto } from "./dto/session-catalog.dto";
import { MovieCatalogDto } from "./dto/movie-catalog.dto";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "../domain/movie/ports/movie.repository";

@Injectable()
export class CatalogApi {
    constructor(
        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository,

        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository,

        @Inject(MOVIE_REPOSITORY_TOKEN)
        private readonly movieRepo: MovieRepository
    ) {}

    public async getHallInfo(hallId: string): Promise<HallCatalogDto | null> {
        const hall = await this.hallRepo.findById(hallId);
        if (!hall) return null;

        return { name: hall.name, seats: hall.seats };
    }

    public async getSessionInfo(sessionId: string): Promise<SessionCatalogDto | null> {
        const session = await this.sessionRepo.findById(sessionId);
        if (!session) return null;

        return {
            id: session.id,
            price: session.basePrice,
            startTime: session.timePeriod.startTime,
            finishTime: session.timePeriod.endTime,
            bookingTime: session.bookingTime
        };
    }

    public async getMovieInfo(movieId: string): Promise<MovieCatalogDto | null> {
        const movie = await this.movieRepo.findById(movieId);
        if (!movie) return null;

        return {
            title: movie.title,
            duration: movie.duration,
            description: movie.description,
            genre: movie.genre,
            rentStart: movie.rentDate.start,
            rentEnd: movie.rentDate.end
        };
    }
}
