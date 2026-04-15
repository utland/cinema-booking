import { Inject, Injectable } from "@nestjs/common";
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "../../session/ports/session.repository";
import { ConflictDomainException } from "src/common/domain/domain-exceptions/conflict.exception";

@Injectable()
export class HallAccessService {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository
    ) {}

    public async checkOngoingSessions(hallId: string): Promise<void> {
        const sessions = await this.sessionRepo.findByHall(hallId);

        for (const item of sessions) {
            if (item.timePeriod.isInRange(new Date())) {
                throw new ConflictDomainException("There are unfinished sessions in this hall");
            }
        }
    }
}
