import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateHallCommand } from "./create-hall.command";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "src/contexts/catalog/domain/hall/ports/hall.repository";
import { Hall } from "src/contexts/catalog/domain/hall/models/hall.entity";

@CommandHandler(CreateHallCommand)
export class CreateHallHandler implements ICommandHandler<CreateHallCommand> {
    constructor(
        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository
    ) {}

    public async execute({ name, type, seats }: CreateHallCommand) {
        const hall = new Hall(name, type, seats);
        await this.hallRepo.save(hall);
    }
}
