import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateMovieCommand } from "./create-movie.command";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "src/contexts/catalog/domain/movie/ports/movie.repository";
import { Movie } from "src/contexts/catalog/domain/movie/models/movie.entity";

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
