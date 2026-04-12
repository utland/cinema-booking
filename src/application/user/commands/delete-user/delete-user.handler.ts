import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserCommand } from "./delete-user.command";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "src/domain/user/ports/user.repository";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepo: UserRepository
    ) {}

    public async execute({ userId }: DeleteUserCommand): Promise<void> {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new NotFoundException("User not found");

        await this.userRepo.delete(user);
    }
}
