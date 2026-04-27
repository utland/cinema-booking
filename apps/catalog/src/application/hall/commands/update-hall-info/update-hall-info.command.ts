import { HallType } from "@app/catalog/domain/hall/models/hall.entity";
import { Command } from "@nestjs/cqrs";

export class UpdateHallInfoCommand extends Command<void> {
    constructor(
        public readonly hallId: string,
        public readonly name: string,
        public readonly type: HallType
    ) {
        super();
    }
}
