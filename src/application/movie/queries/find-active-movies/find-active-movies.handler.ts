import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "src/domain/movie/ports/movie.repository";
import { MovieListItemDto } from "../dtos/movie-list-item.dto";
import { FindActiveMoviesQuery } from "./find-active-movies.query";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { MOVIE_READ_REPOSITORY_TOKEN, type MovieReadRepository } from "../../ports/movie.read-repository";

@QueryHandler(FindActiveMoviesQuery)
export class FindActiveMoviesHandler implements IQueryHandler<FindActiveMoviesQuery> {
    constructor(
        @Inject(MOVIE_READ_REPOSITORY_TOKEN)
        private readonly movieReadRepository: MovieReadRepository
    ) {}

    async execute(): Promise<MovieListItemDto[]> {
        const activeMovies = await this.movieReadRepository.findActive();
        return activeMovies;
    }
}
