import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserCommand } from "./update-user.command";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "src/contexts/identity/domain/ports/user.repository";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepo: UserRepository
    ) {}

    public async execute({ userId, firstName, lastName }: UpdateUserCommand): Promise<void> {
        const user = await this.userRepo.findById(userId);
        if (!user) throw new NotFoundException("User not found");

        user.updateInfo(firstName, lastName);

        await this.userRepo.save(user);
    }
}
