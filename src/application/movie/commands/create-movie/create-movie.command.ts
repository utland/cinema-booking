import { Command } from "@nestjs/cqrs";

export class CreateMovieCommand extends Command<void> {
    constructor(
        public readonly title: string,
        public readonly duration: number,
        public readonly description: string,
        public readonly genre: string,
        public readonly rentStart: Date,
        public readonly rentEnd: Date
    ) {
        super();
    }
}