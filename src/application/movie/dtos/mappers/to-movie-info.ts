import { Movie } from "src/domain/movie/models/movie.entity"
import { MovieInfoDto } from "../response/movie-info.dto";

export const toMovieInfoDto = (movie: Movie): MovieInfoDto => {
    return {
      title: movie.title,
      duration: movie.duration,
      description: movie.description,
      genre: movie.genre,
      rentStart: movie.rentDate.start,
      rentEnd: movie.rentDate.end,
      photoUrl: ""
    };
}