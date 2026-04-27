import { HallType } from "@app/catalog/domain/hall/models/hall.entity";

class SeatEditorDto {
    row: number;
    column: number;
    id: string;
}

export class HallEditorDto {
    name: string;
    type: HallType;
    seats: SeatEditorDto[];
}
