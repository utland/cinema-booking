import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteMovieCommand } from "./delete-movie.command";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "@app/catalog/domain/movie/ports/movie.repository";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { type Cache } from "cache-manager";

@CommandHandler(DeleteMovieCommand)
export class DeleteMovieHandler implements ICommandHandler<DeleteMovieCommand> {
    constructor(
        @Inject(MOVIE_REPOSITORY_TOKEN)
        private readonly movieRepository: MovieRepository,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    public async execute({ movieId }: DeleteMovieCommand): Promise<void> {
        const movie = await this.movieRepository.findById(movieId);
        if (!movie) throw new NotFoundException("Movie is not found");

        movie.validateDeleteOperation();

        await this.movieRepository.delete(movie);

        await this.cacheManager.del(`movie:${movieId}`);
    }
}
