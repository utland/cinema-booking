import { endOfDay, startOfDay } from "date-fns";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { toSessionsInMovieDto } from "../mappers/to-sessions-in-movie.mapper";
import { toSessionWithHallDto } from "../mappers/to-session-with-hall.mapper";
import { SessionReadRepository } from "src/contexts/catalog/application/session/ports/session.read-repository";
import { SessionInMovieDto } from "src/contexts/catalog/application/session/queries/dtos/session-in-movie.dto";
import { SessionWithHallDto } from "src/contexts/catalog/application/session/queries/dtos/session-with-hall.dto";
import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";

@Injectable()
export class TypeOrmSessionReadRepository implements SessionReadRepository {
    constructor(private readonly dataSource: DataSource) {}

    public async findSessionsInMovie(movieId: string, sessionDate: Date): Promise<SessionInMovieDto[]> {
        const rawSql = `
        SELECT 
            s.id as "sessionId", 
            s.start_time as "startTime", 
            s.finish_time as "endTime", 
            s.base_price as "basePrice",
            s.booking_time as "bookingTime",
            h.name as "hallName", 
            COUNT(DISTINCT se.id) - COUNT(DISTINCT t.id) as "availableSeats",
            COUNT(DISTINCT se.id) as "totalSeats"
        FROM sessions s
        LEFT JOIN halls h on s.hall_id = h.id
        LEFT JOIN seats se on h.id = se.hall_id
        LEFT JOIN tickets t on s.id = t.session_id 
            AND t.seat_id = se.id
            AND t.status != $1
        WHERE s.movie_id = $2 AND s.start_time >= $3 AND s.start_time <= $4
        GROUP BY s.id, s.start_time, s.finish_time, s.base_price, s.booking_time, h.name
        `;
        const sessions = await this.dataSource.query(rawSql, [
            TicketStatus.CANCELLED,
            movieId,
            startOfDay(sessionDate),
            endOfDay(sessionDate)
        ]);

        const dto = toSessionsInMovieDto(sessions);
        return dto;
    }

    public async findSessionWithHall(sessionId: string): Promise<SessionWithHallDto | null> {
        const rawSql = `
        SELECT
            s.id as "sessionId",
            s.start_time as "startTime",
            s.finish_time as "endTime",
            s.booking_time as "bookingTime",
            h.id as "hallId",
            h.name as "hallName",
            h.type as "hallType",
            se.id as "seatId",
            se.row_number as "row",
            se.column_number as "column",
            NOT EXISTS (
                SELECT 1 FROM tickets t
                WHERE t.session_id = s.id AND t.seat_id = se.id AND t.status != $2
            ) as "isAvailable"
        FROM sessions s
        LEFT JOIN halls h on s.hall_id = h.id
        LEFT JOIN seats se on h.id = se.hall_id
        WHERE s.id = $1
        `;
        
        const sessionWithHall = await this.dataSource.query(rawSql, [sessionId, TicketStatus.CANCELLED]); 
        if (sessionWithHall.length === 0) return null;

        const dto = toSessionWithHallDto(sessionWithHall);

        return dto;
    }
}
