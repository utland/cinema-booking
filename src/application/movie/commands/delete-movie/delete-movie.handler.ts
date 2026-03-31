import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "src/domain/movie/ports/movie.repository";
import { DeleteMovieCommand } from "./delete-movie.command";

@CommandHandler(DeleteMovieCommand)
export class DeleteMovieHandler implements ICommandHandler<DeleteMovieCommand> {
    constructor(
        @Inject(MOVIE_REPOSITORY_TOKEN)
        private readonly movieRepository: MovieRepository
    ) {}

    public async execute(
        { movieId }: DeleteMovieCommand
    ): Promise<void> {
        const movie = await this.movieRepository.findById(movieId);
        if (!movie) throw new NotFoundException('Movie is not found');
        
        movie.validateDeleteOperation();
        
        await this.movieRepository.delete(movie);
    }
}