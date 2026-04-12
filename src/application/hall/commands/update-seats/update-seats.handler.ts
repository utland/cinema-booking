import { Inject, NotFoundException } from "@nestjs/common";
import { HallAccessService } from "src/domain/common/domain-services/hall-access.service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSeatsCommand } from "./update-seats.command";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "src/domain/hall/ports/hall.repository";

@CommandHandler(UpdateSeatsCommand)
export class UpdateSeatsHandler implements ICommandHandler<UpdateSeatsCommand> {
    constructor(
        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository,
        private readonly hallAccessService: HallAccessService
    ) {}

    public async execute({ hallId, seats }: UpdateSeatsCommand): Promise<void> {
        this.hallAccessService.checkOngoingSessions(hallId);

        const hall = await this.hallRepo.findById(hallId);
        if (!hall) throw new NotFoundException("This hall doesn't exist");

        hall.setSeats(seats);

        await this.hallRepo.save(hall);
    }
}
