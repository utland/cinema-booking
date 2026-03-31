import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindSessionWithHallQuery } from "./find-session-with-hall.query";
import { SessionWithHallDto } from "../dtos/session-with-hall.dto";
import { Inject } from "@nestjs/common";
import { SESSION_READ_REPOSITORY_TOKEN, type SessionReadRepository } from "../../ports/session.read-repository";

@QueryHandler(FindSessionWithHallQuery)
export class FindSessionWithHallHandler implements IQueryHandler<FindSessionWithHallQuery> {
    constructor(
        @Inject(SESSION_READ_REPOSITORY_TOKEN)
        private readonly sessionReadRepository: SessionReadRepository
    ) {}

    async execute({ sessionId }: FindSessionWithHallQuery): Promise<SessionWithHallDto> {
        const result = await this.sessionReadRepository.findSessionWithHall(sessionId);

        return result;
    }

}