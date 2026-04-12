import { SessionInMovieDto } from "src/application/session/queries/dtos/session-in-movie.dto";

export const toSessionsInMovieDto = (result: any): SessionInMovieDto[] => {
    return result.map((item) => {
        return {
            sessionId: item.sessionId,
            hallName: item.hallName,
            basePrice: item.basePrice,
            startTime: item.startTime,
            endTime: item.endTime,
            availableSeats: Number(item.availableSeats),
            totalSeats: Number(item.totalSeats)
        };
    });
};
