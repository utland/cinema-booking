import { Hall } from "@app/catalog/domain/hall/models/hall.entity";

type SeatInfo = {
    row: number;
    column: number;
};

export class HallUpdatedEvent {
    constructor(
        public readonly hallId: string,
        public readonly name: string,
        public readonly type: string,
        public readonly seats: SeatInfo[]
    ) {}
}
