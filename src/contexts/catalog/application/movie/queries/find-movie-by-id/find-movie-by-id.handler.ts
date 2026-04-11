import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMovieByIdQuery } from "./find-movie-by-id.query";
import { MovieInfoDto } from "../dtos/movie-info.dto";
import { MOVIE_READ_REPOSITORY_TOKEN, type MovieReadRepository } from "../../ports/movie.read-repository";

@QueryHandler(FindMovieByIdQuery)
export class FindMovieByIdHandler implements IQueryHandler<FindMovieByIdQuery> {
    constructor(
        @Inject(MOVIE_READ_REPOSITORY_TOKEN)
        private readonly movieReadRepository: MovieReadRepository
    ) {}

    public async execute({ movieId }: FindMovieByIdQuery): Promise<MovieInfoDto> {
        const movie = await this.movieReadRepository.findById(movieId);
        if (!movie) throw new NotFoundException("This movie doesn't exist");

        return movie;
    }
}
