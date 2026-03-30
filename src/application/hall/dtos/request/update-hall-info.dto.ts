import { HallType } from "src/domain/hall/models/hall.entity";

export type UpdateHallInfoDto = {
    hallId: string;
    name: string;
    type: HallType;
}