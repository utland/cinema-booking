import { SessionWithHallDto } from "../queries/dtos/session-with-hall.dto";
import { SessionInMovieDto } from "../queries/dtos/session-in-movie.dto";

export const SESSION_READ_REPOSITORY_TOKEN = "SessionReadRepository";

export interface SessionReadRepository {
    findSessionsInMovie(movieId: string, sessionDate: Date): Promise<SessionInMovieDto[]>;
    findSessionWithHall(sessionId: string): Promise<SessionWithHallDto>;
}