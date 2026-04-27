import { Controller, Inject, Injectable } from "@nestjs/common";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "./domain/hall/ports/hall.repository";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "./domain/session/ports/session.repository";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "./domain/movie/ports/movie.repository";
import { HallCatalogDto } from "@app/shared-kernel/application/services/dtos/catalog/hall-catalog.dto";
import { SessionCatalogDto } from "@app/shared-kernel/application/services/dtos/catalog/session-catalog.dto";
import { MovieCatalogDto } from "@app/shared-kernel/application/services/dtos/catalog/movie-catalog.dto";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class CatalogApiController {
    constructor(
        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository,

        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository,

        @Inject(MOVIE_REPOSITORY_TOKEN)
        private readonly movieRepo: MovieRepository
    ) {}

    @MessagePattern("get_hall_info")
    public async getHallInfo(hallId: string): Promise<HallCatalogDto | null> {
        const hall = await this.hallRepo.findById(hallId);
        if (!hall) return null;

        return { name: hall.name, seats: hall.seats };
    }

    @MessagePattern("get_session_info")
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

    @MessagePattern("get_movie_info")
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
