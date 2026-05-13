import { SessionInMovieDto } from "@app/catalog/application/session/queries/dtos/session-in-movie.dto";
import { MongooseSessionInMovie } from "../entities/mongoose-session-card.entity";

export const toSessionsInMovieDto = (sessionInMovie: MongooseSessionInMovie[]): SessionInMovieDto[] => {
    return sessionInMovie.map((item) => {
        return {
            sessionId: item.sessionId,
            hallName: item.hallName,
            basePrice: item.basePrice,
            startTime: item.startTime,
            endTime: item.endTime,
            bookingTime: item.bookingTime,
            availableSeats: Number(item.availableSeats),
            totalSeats: Number(item.totalSeats)
        };
    });
};
