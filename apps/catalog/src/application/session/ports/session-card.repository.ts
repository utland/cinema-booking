import { Session } from "@app/catalog/domain/session/models/session.entity";
import { Hall } from "@app/catalog/domain/hall/models/hall.entity";
import { SessionInMovieDto } from "../queries/dtos/session-in-movie.dto";

export const SESSION_IN_MOVIE_REPOSITORY_TOKEN = "SessionInMovieRepository";

export type SessionInMovieArgs = {
    sessionId: string;
    start: Date;
    end: Date;
    bookingTime: Date;
    basePrice: number;
};

export interface SessionInMovieRepository {
    findByMovieId(movieId: string, dateOfSession: Date): Promise<SessionInMovieDto[]>;
    save(sessionArgs: SessionInMovieArgs, hall: Hall): Promise<void>;
    updateSession(sessionArgs: SessionInMovieArgs): Promise<void>;
    updateHall(name: string, seatsAmount: number): Promise<void>;
    updateAvailable(sessionId: string, operation: "increase" | "decrease"): Promise<void>;
}
