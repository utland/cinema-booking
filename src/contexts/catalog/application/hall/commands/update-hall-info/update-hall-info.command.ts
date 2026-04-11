import { Command } from "@nestjs/cqrs";
import { HallType } from "src/contexts/catalog/domain/hall/models/hall.entity";

export class UpdateHallInfoCommand extends Command<void> {
    constructor(
        public readonly hallId: string,
        public readonly name: string,
        public readonly type: HallType
    ) {
        super();
    }
}
