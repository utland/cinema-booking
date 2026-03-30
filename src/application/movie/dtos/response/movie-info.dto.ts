import { SessionInMovieDto } from "src/application/session/dtos/response/session-in-movie.dto";

export class MovieInfoDto {
    title: string;
    duration: number;
    description: string;
    genre: string;
    rentStart: Date;
    rentEnd: Date;
    photoUrl: string;
}