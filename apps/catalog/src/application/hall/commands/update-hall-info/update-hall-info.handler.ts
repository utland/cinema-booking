import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateHallInfoCommand } from "./update-hall-info.command";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "@app/catalog/domain/hall/ports/hall.repository";
import { HallAccessService } from "@app/catalog/domain/common/domain-services/hall-access.service";

@CommandHandler(UpdateHallInfoCommand)
export class UpdateHallInfoHandler implements ICommandHandler<UpdateHallInfoCommand> {
    constructor(
        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository,

        private readonly hallAccessService: HallAccessService
    ) {}

    public async execute({ hallId, name, type }: UpdateHallInfoCommand): Promise<void> {
        this.hallAccessService.checkOngoingSessions(hallId);

        const hall = await this.hallRepo.findById(hallId);
        if (!hall) throw new NotFoundException("This hall doesn't exist");

        hall.changeInfo(name, type);

        await this.hallRepo.save(hall);
    }
}
