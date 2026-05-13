import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { FindSessionsByMovieQuery } from "./find-sessions-by-movie.query";
import { SessionInMovieDto } from "../dtos/session-in-movie.dto";
import { SESSION_IN_MOVIE_REPOSITORY_TOKEN, type SessionInMovieRepository } from "../../ports/session-card.repository";

@QueryHandler(FindSessionsByMovieQuery)
export class FindSessionsByMovieHandler implements IQueryHandler<FindSessionsByMovieQuery> {
    constructor(
        @Inject(SESSION_IN_MOVIE_REPOSITORY_TOKEN)
        private readonly sessionInMovieRepo: SessionInMovieRepository
    ) {}

    async execute({ movieId, dateOfSession }: FindSessionsByMovieQuery): Promise<SessionInMovieDto[]> {
        const result = await this.sessionInMovieRepo.findByMovieId(movieId, dateOfSession);
        return result;
    }
}
