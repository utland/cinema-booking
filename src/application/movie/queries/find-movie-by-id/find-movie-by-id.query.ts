import { Query } from "@nestjs/cqrs";
import { MovieInfoDto } from "../dtos/movie-info.dto";

export class FindMovieByIdQuery extends Query<MovieInfoDto> {
    constructor(public readonly movieId: string) {
        super();
    }
}