import { HallType, SeatInfoType } from "src/domain/hall/models/hall.entity"

export class HallEditorDto {
    name: string;
    type: HallType;
    seats: SeatInfoType[];
}