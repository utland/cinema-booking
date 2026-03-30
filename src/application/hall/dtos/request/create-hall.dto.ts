import { HallType, SeatInfoType } from "src/domain/hall/models/hall.entity";

export type CreateHallDto = {
    name: string;
    type: HallType;
    seats: SeatInfoType[]
}