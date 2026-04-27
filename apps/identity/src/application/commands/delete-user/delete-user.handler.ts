import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserCommand } from "./delete-user.command";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { type Cache } from "cache-manager";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "@app/identity/domain/ports/user.repository";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepo: UserRepository,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    public async execute({ userId }: DeleteUserCommand): Promise<void> {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new NotFoundException("User not found");

        await this.userRepo.delete(user);

        await this.cacheManager.del(`user:${userId}:profile`);
    }
}
