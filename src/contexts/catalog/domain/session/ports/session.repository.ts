import { Session } from "../models/session.entity";

export const SESSION_REPOSITORY_TOKEN = "SessionRepository";

export interface SessionRepository {
    findById(id: string): Promise<Session | null>;
    findByHall(hallId: string): Promise<Session[]>;
    save(session: Session): Promise<void>;
    delete(session: Session): Promise<void>;
}
