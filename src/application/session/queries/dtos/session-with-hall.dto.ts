import { number } from "joi"

type SeatInSessionDto = {
    seatId: string;
    row: number;
    column: number;
    isAvailable: boolean;
}

export class SessionWithHallDto {
    sessionId: string;
    startTime: Date;
    endTime: Date;
    hallId: string;
    hallName: string;
    hallType: string;
    seats: SeatInSessionDto[]
}