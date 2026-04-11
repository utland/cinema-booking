import { HallType, SeatInfoType } from "src/contexts/catalog/domain/hall/models/hall.entity";

export class HallEditorDto {
    name: string;
    type: HallType;
    seats: SeatInfoType[];
}
