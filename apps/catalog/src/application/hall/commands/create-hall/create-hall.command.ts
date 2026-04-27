import { HallType, SeatInfoType } from "@app/catalog/domain/hall/models/hall.entity";
import { Command } from "@nestjs/cqrs";

export class CreateHallCommand extends Command<void> {
    constructor(
        public readonly name: string,
        public readonly type: HallType,
        public readonly seats: SeatInfoType[]
    ) {
        super();
    }
}
