import { Command } from "@nestjs/cqrs";

export class DeleteMovieCommand extends Command<void> {
    constructor(public readonly movieId: string) {
        super();
    }
}
