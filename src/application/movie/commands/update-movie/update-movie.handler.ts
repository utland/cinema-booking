import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "src/domain/movie/ports/movie.repository";
import { UpdateMovieCommand } from "./update-movie.command";

@CommandHandler(UpdateMovieCommand)
export class UpdateMovieHandler implements ICommandHandler<UpdateMovieCommand> {
    constructor(
        @Inject(MOVIE_REPOSITORY_TOKEN)
        private readonly movieRepository: MovieRepository
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

        movie.updateInfo(title, description, duration, genre);
        movie.changeRentDate(rentStart, rentEnd);

        await this.movieRepository.save(movie);
    }
}
