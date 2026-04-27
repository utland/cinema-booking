import { SessionInMovieDto } from "@app/catalog/application/session/queries/dtos/session-in-movie.dto";

export const toSessionsInMovieDto = (result: any): SessionInMovieDto[] => {
    return result.map((item) => {
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
