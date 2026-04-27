import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "@app/catalog/domain/movie/ports/movie.repository";
import { UpdateMovieCommand } from "./update-movie.command";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { type Cache } from "cache-manager";

@CommandHandler(UpdateMovieCommand)
export class UpdateMovieHandler implements ICommandHandler<UpdateMovieCommand> {
    constructor(
        @Inject(MOVIE_REPOSITORY_TOKEN)
        private readonly movieRepository: MovieRepository,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    public async execute({
        movieId,
        title,
        duration,
        genre,
        description,
        rentStart,
        rentEnd
    }: UpdateMovieCommand): Promise<void> {
        const movie = await this.movieRepository.findById(movieId);
        if (!movie) throw new NotFoundException("Movie is not found");

        movie.checkStateToModify();

        movie.updateInfo(title, description, duration, genre);
        movie.changeRentDate(rentStart, rentEnd);

        await this.movieRepository.save(movie);

        await this.cacheManager.del(`movie:${movieId}`);
    }
}
