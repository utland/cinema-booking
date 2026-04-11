import { Command } from "@nestjs/cqrs";
import { HallType, SeatInfoType } from "src/contexts/catalog/domain/hall/models/hall.entity";

export class CreateHallCommand extends Command<void> {
    constructor(
        public readonly name: string,
        public readonly type: HallType,
        public readonly seats: SeatInfoType[]
    ) {
        super();
    }
}
