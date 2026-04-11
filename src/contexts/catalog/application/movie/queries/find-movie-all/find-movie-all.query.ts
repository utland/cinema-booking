import { Query } from "@nestjs/cqrs";
import { MovieListItemDto } from "../dtos/movie-list-item.dto";

export class FindMovieAllQuery extends Query<MovieListItemDto[]> {
    constructor() {
        super();
    }
}
