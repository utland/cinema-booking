import { Query } from "@nestjs/cqrs";
import { UserProfileDto } from "../dtos/user-profile.dto";

export class FindUserByIdQuery extends Query<UserProfileDto> {
    constructor(
        public readonly userId: string
    ) {
        super();
    }
}
