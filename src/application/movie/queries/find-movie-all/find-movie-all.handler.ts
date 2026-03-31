import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindMovieAllQuery } from "./find-movie-all.query";
import { MovieListItemDto } from "../dtos/movie-list-item.dto";
import { MOVIE_READ_REPOSITORY_TOKEN, type MovieReadRepository } from "../../ports/movie.read-repository";

@QueryHandler(FindMovieAllQuery)
export class FindMovieAllHandler implements IQueryHandler<FindMovieAllQuery>{
    constructor(
        @Inject(MOVIE_READ_REPOSITORY_TOKEN)
        private readonly movieReadRepository: MovieReadRepository
    ) {}

    public async execute(): Promise<MovieListItemDto[]> {
        const movies = await this.movieReadRepository.findAll();
        return movies;
    }
}