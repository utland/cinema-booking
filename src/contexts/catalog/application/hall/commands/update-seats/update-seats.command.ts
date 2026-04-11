import { Command } from "@nestjs/cqrs";
import { SeatInfoType } from "src/contexts/catalog/domain/hall/models/hall.entity";

export class UpdateSeatsCommand extends Command<void> {
    constructor(
        public readonly hallId: string,
        public readonly seats: SeatInfoType[]
    ) {
        super();
    }
}
