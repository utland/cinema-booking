import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "src/domain/session/ports/session.repository";
import { Inject, Injectable } from "@nestjs/common";
import { ConflictDomainException } from "../exceptions/conflict.exception";

@Injectable()
export class HallAccessService {
    constructor(
        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository
    ) {}

    public async checkOngoingSessions(hallId: string): Promise<void> {
        const sessions = await this.sessionRepo.findByHall(hallId);

        for (const item of sessions) {
            if (item.timePeriod.isInBetween()) {
                throw new ConflictDomainException("There are unfinished sessions in this hall")
            }
        }
    }
}