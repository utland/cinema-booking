import { Session } from "@app/catalog/domain/session/models/session.entity";
import { SessionWithHallDto } from "../queries/dtos/session-with-hall.dto";
import { Hall } from "@app/catalog/domain/hall/models/hall.entity";

export const SESSION_WITH_HALL_REPOSITORY_TOKEN = "SessionWithHallRepository";

export type SessionWithHallArgs = {
    sessionId: string;
    start: Date;
    end: Date;
    bookingTime: Date;
};

export interface SessionWithHallRepository {
    findById(sessionId: string): Promise<SessionWithHallDto | null>;
    save(sessionArgs: SessionWithHallArgs, hall: Hall): Promise<void>;
    updateSession(sessionArgs: SessionWithHallArgs): Promise<void>;
    updateHall(id: string, name: string, type: string): Promise<void>;
    updateSeat(sessionId: string, seatId: string, isAvailable: boolean): Promise<void>;
}
