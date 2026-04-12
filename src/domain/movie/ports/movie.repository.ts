import { Movie } from "../models/movie.entity";

export const MOVIE_REPOSITORY_TOKEN = "MovieRepository";

export interface MovieRepository {
    findById(movieId: string): Promise<Movie | null>;
    save(movie: Movie): Promise<void>;
    delete(movie: Movie): Promise<void>;
}
