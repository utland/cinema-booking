import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { FindSessionsByMovieQuery } from "./find-sessions-by-movie.query";
import { SessionInMovieDto } from "../dtos/session-in-movie.dto";
import { SESSION_READ_REPOSITORY_TOKEN, type SessionReadRepository } from "../../ports/session.read-repository";

@QueryHandler(FindSessionsByMovieQuery)
export class FindSessionsByMovieHandler implements IQueryHandler<FindSessionsByMovieQuery> {
    constructor(
        @Inject(SESSION_READ_REPOSITORY_TOKEN)
        private readonly sessionReadRepository: SessionReadRepository
    ) {}

    async execute({ movieId, dateOfSession }: FindSessionsByMovieQuery): Promise<SessionInMovieDto[]> {
        const result = await this.sessionReadRepository.findSessionsInMovie(movieId, dateOfSession);

        return result;
    }
}
