import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMovieByIdQuery } from "./find-movie-by-id.query";
import { MovieInfoDto } from "../dtos/movie-info.dto";
import { MOVIE_READ_REPOSITORY_TOKEN, type MovieReadRepository } from "../../ports/movie.read-repository";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { type Cache } from "cache-manager";

@QueryHandler(FindMovieByIdQuery)
export class FindMovieByIdHandler implements IQueryHandler<FindMovieByIdQuery> {
    constructor(
        @Inject(MOVIE_READ_REPOSITORY_TOKEN)
        private readonly movieReadRepository: MovieReadRepository,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    public async execute({ movieId }: FindMovieByIdQuery): Promise<MovieInfoDto> {
        const key = `movie:${movieId}`;

        const cachedMovie = await this.cacheManager.get<MovieInfoDto>(key);
        if (cachedMovie) return cachedMovie;

        const movie = await this.movieReadRepository.findById(movieId);
        if (!movie) throw new NotFoundException("This movie doesn't exist");

        await this.cacheManager.set(key, movie);

        return movie;
    }
}
