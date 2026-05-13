import { SessionWithHallDto } from "@app/catalog/application/session/queries/dtos/session-with-hall.dto";
import { MongooseSessionWithHall } from "../entities/mongoose-session-with-hall.schema";

export const toSessionWithHallDto = (sessionWithHall: MongooseSessionWithHall): SessionWithHallDto => {
    return {
        sessionId: sessionWithHall.sessionId,
        startTime: sessionWithHall.startTime,
        endTime: sessionWithHall.endTime,
        bookingTime: sessionWithHall.bookingTime,
        hallId: sessionWithHall.hallId,
        hallName: sessionWithHall.hallName,
        hallType: sessionWithHall.hallType,
        seats: sessionWithHall.seats.map((item) => {
            return {
                seatId: item.seatId,
                row: Number(item.row),
                column: Number(item.column),
                isAvailable: Boolean(item.isAvailable)
            };
        })
    };
};
