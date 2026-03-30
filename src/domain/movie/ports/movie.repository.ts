import { Movie } from "../models/movie.entity";

export const MOVIE_REPOSITORY_TOKEN = "MovieRepository";

export interface MovieRepository {
    findById(id: string): Promise<Movie | null>;
    findAll(): Promise<Movie[]>;
    findActive(): Promise<Movie[]>;
    save(movie: Movie): Promise<void>;
    delete(movie: Movie): Promise<void>;
}