import { Command, Query } from "@nestjs/cqrs";
import { ValidateResponseDto } from "../dtos/validate-response.dto";

export class ValidateUserQuery extends Query<ValidateResponseDto> {
    constructor(
        public readonly login: string,
        public readonly password: string
    ) {
        super();
    }
}
