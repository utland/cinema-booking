import { Movie } from "src/domain/movie/models/movie.entity"
import { MovieListItemDto } from "../response/movie-list-item.dto";

export const toMovieListDto = (movies: Movie[]): MovieListItemDto[] => {
    return movies.map(item => ({
      movieId: item.id,
      name: item.title,
      rentEnd: item.rentDate.end,
      rentStart: item.rentDate.start,
      photoUrl: ""
    }));
}