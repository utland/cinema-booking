import { Command } from "@nestjs/cqrs";

export class CreateUserCommand extends Command<void> {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly login: string,
        public readonly firstName: string,
        public readonly lastName: string
    ) {
        super();
    }
}