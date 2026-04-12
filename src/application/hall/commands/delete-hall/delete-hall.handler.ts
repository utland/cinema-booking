import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { HallAccessService } from "src/domain/common/domain-services/hall-access.service";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "src/domain/hall/ports/hall.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteHallCommand } from "./delete-hall.command";

@CommandHandler(DeleteHallCommand)
export class DeleteHallHandler implements ICommandHandler<DeleteHallCommand> {
    constructor(
        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository,
        private readonly hallAccessService: HallAccessService
    ) {}

    public async execute({ hallId }: DeleteHallCommand): Promise<void> {
        this.hallAccessService.checkOngoingSessions(hallId);

        const hall = await this.hallRepo.findById(hallId);
        if (!hall) throw new NotFoundException("This hall doesn't exist");

        await this.hallRepo.delete(hall);
    }
}
