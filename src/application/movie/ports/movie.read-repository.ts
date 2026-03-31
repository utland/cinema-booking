import { MovieInfoDto } from "../queries/dtos/movie-info.dto";
import { MovieListItemDto } from "../queries/dtos/movie-list-item.dto";

export const MOVIE_READ_REPOSITORY_TOKEN = "MovieReadRepository";

export interface MovieReadRepository {
    findById(movieId: string): Promise<MovieInfoDto | null>;
    findAll(): Promise<MovieListItemDto[]>;
    findActive(): Promise<MovieListItemDto[]>;
}