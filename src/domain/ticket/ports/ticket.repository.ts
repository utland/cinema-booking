import { Ticket } from "../models/ticket.entity";

export const TICKET_REPOSITORY_TOKEN = "TicketRepository";

export interface TicketRepository {
    findById(id: string): Promise<Ticket | null>;
    findBySeat(seatId: string, sessionId: string): Promise<Ticket[]>;
    findByUser(userId: string, sessionId: string): Promise<Ticket[]>;
    save(ticket: Ticket): Promise<void>;
    delete(ticket: Ticket): Promise<void>;
}