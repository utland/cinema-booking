import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "src/domain/movie/ports/movie.repository";
import { CreateMovieCommand } from "./create-movie.command";
import { Movie } from "src/domain/movie/models/movie.entity";

@CommandHandler(CreateMovieCommand)
export class CreateMovieHandler implements ICommandHandler<CreateMovieCommand> {
    constructor(
        @Inject(MOVIE_REPOSITORY_TOKEN)
        private readonly movieRepository: MovieRepository
    ) {}

    public async execute({
        title,
        duration,
        genre,
        description,
        rentStart,
        rentEnd
    }: CreateMovieCommand): Promise<void> {
        const movie = new Movie(title, duration, description, genre, rentStart, rentEnd);
        await this.movieRepository.save(movie);
    }
}
