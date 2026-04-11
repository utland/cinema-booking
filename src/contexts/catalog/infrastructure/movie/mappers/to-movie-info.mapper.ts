import { MovieInfoDto } from "src/contexts/catalog/application/movie/queries/dtos/movie-info.dto";
import { TypeOrmMovie } from "../entities/typeorm-movie.entity";

export const toMovieInfoDto = (movie: TypeOrmMovie): MovieInfoDto => {
    return {
        title: movie.title,
        duration: movie.duration,
        description: movie.description,
        genre: movie.genre,
        rentStart: movie.rentStart,
        rentEnd: movie.rentEnd,
        photoUrl: ""
    };
};
