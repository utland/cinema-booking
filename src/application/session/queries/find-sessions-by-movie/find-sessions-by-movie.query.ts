import { Query } from "@nestjs/cqrs";
import { SessionInMovieDto } from "../dtos/session-in-movie.dto";

export class FindSessionsByMovieQuery extends Query<SessionInMovieDto[]> {
    constructor(
        public readonly movieId: string,
        public readonly dateOfSession: Date
    ) {
        super();
    }
}