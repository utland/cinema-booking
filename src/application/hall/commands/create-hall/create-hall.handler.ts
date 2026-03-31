import { Inject } from "@nestjs/common";
import { Hall } from "src/domain/hall/models/hall.entity";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateHallCommand } from "./create-hall.command";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "src/domain/hall/ports/hall.repository";

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