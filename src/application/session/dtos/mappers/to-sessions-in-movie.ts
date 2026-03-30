import { Session } from "src/domain/session/models/session.entity";
import { Hall } from "src/domain/hall/models/hall.entity";
import { NotFoundException } from "@nestjs/common";
import { SessionInMovieDto } from "../response/session-in-movie.dto";
import { Ticket } from "src/domain/ticket/models/ticket.entity";

export const toSessionsInMovieDto = (sessions: Session[], halls: Hall[], tickets: Ticket[]): SessionInMovieDto[] => {
    return sessions.map(item => {
        const hall = halls.find(hall => hall.id === item.hallId);
        if (!hall) throw new NotFoundException("Hall is not found");

        const sessionTickets = tickets.filter(ticket => ticket.sessionId === item.id);

        return {
            sessionId: item.id,
            hallName: hall.name,
            startTime: item.timePeriod.startTime,
            endTime: item.timePeriod.startTime,
            availableSeats: hall.seats.length - sessionTickets.length,
            totalSeats: hall.seats.length
        }
    })
}