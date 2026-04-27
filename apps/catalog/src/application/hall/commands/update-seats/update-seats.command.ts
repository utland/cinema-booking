import { SeatInfoType } from "@app/catalog/domain/hall/models/hall.entity";
import { Command } from "@nestjs/cqrs";

export class UpdateSeatsCommand extends Command<void> {
    constructor(
        public readonly hallId: string,
        public readonly seats: SeatInfoType[]
    ) {
        super();
    }
}
