import { SessionWithHallDto } from "src/contexts/catalog/application/session/queries/dtos/session-with-hall.dto";

export const toSessionWithHallDto = (response: any[]): SessionWithHallDto => {
    const sessionData = response[0];

    return {
        sessionId: sessionData.sessionId,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        hallId: sessionData.hallId,
        hallName: sessionData.hallName,
        hallType: sessionData.hallType,
        seats: response.map((item) => {
            return {
                seatId: item.seatId,
                row: Number(item.row),
                column: Number(item.column),
                isAvailable: Boolean(item.isAvailable)
            };
        })
    };
};
