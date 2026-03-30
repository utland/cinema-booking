import { SeatInfoType } from "src/domain/hall/models/hall.entity"

export type UpdateSeatsDto = {
    hallId: string;
    seats: SeatInfoType[]
}