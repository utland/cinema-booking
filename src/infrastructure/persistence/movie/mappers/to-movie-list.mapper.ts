import { MovieListItemDto } from "src/application/movie/queries/dtos/movie-list-item.dto";
import { TypeOrmMovie } from "../entities/typeorm-movie.entity";

export const toMovieListDto = (movies: TypeOrmMovie[]): MovieListItemDto[] => {
    return movies.map((item) => ({
        movieId: item.id,
        name: item.title,
        rentEnd: item.rentEnd,
        rentStart: item.rentStart,
        photoUrl: ""
    }));
};
