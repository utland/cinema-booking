import { Command } from "@nestjs/cqrs";

export class UpdateUserCommand extends Command<void> {
    constructor(
        public readonly userId: string,
        public readonly firstName: string,
        public readonly lastName: string
    ) {
        super();
    }
}
