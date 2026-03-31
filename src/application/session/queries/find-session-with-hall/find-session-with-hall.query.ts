import { Query } from "@nestjs/cqrs";
import { SessionWithHallDto } from "../dtos/session-with-hall.dto";

export class FindSessionWithHallQuery extends Query<SessionWithHallDto> {
    constructor(public readonly sessionId: string) {
        super();
    }
}