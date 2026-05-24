import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindSessionWithHallQuery } from "./find-session-with-hall.query";
import { SessionWithHallDto } from "../dtos/session-with-hall.dto";
import { Inject, NotFoundException } from "@nestjs/common";
import {
    SESSION_WITH_HALL_REPOSITORY_TOKEN,
    type SessionWithHallRepository
} from "../../ports/session-with-hall.repository";

@QueryHandler(FindSessionWithHallQuery)
export class FindSessionWithHallHandler implements IQueryHandler<FindSessionWithHallQuery> {
    constructor(
        @Inject(SESSION_WITH_HALL_REPOSITORY_TOKEN)
        private readonly sessionReadRepository: SessionWithHallRepository
    ) {}

    async execute({ sessionId }: FindSessionWithHallQuery): Promise<SessionWithHallDto> {
        const result = await this.sessionReadRepository.findById(sessionId);
        if (!result) throw new NotFoundException("This sessions doesn't exist");

        return result;
    }
}
