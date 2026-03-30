import { Hall } from "src/domain/hall/models/hall.entity";
import { SessionWithHallDto } from "../response/session-with-hall.dto";
import { Session } from "src/domain/session/models/session.entity";
import { Ticket, TicketStatus } from "src/domain/ticket/models/ticket.entity";

export const toSessionWithHallDto = (
    session: Session, hall: Hall, tickets: Ticket[]
): SessionWithHallDto => {
    const seats = hall.seats.map(seat => {
        const isAvailable = tickets.every(
            ticket => ticket.id !== seat.id && ticket.status !== TicketStatus.RESERVED
        );

        return { seatId: seat.id, row: seat.row, column: seat.column, isAvailable }
    })

    return {
        sessionId: session.id,
        startTime: session.timePeriod.startTime,
        endTime: session.timePeriod.endTime,
        hallId: hall.id,
        hallName: hall.name,
        hallType: hall.type,
        seats
    }
}