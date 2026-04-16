import { Command, Query } from "@nestjs/cqrs";
import { TokenDto } from "../dtos/token.dto";

export class ValidateUserQuery extends Query<TokenDto> {
    constructor(
        public readonly login: string,
        public readonly password: string
    ) {
        super();
    }
}
