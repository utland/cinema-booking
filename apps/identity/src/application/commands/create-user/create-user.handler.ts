import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./create-user.command";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "@app/identity/domain/ports/user.repository";
import { PASSWORD_SERVICE_TOKEN, type PasswordService } from "@app/identity/domain/ports/password.service";
import { User } from "@app/identity/domain/models/user.entity";
import { Role } from "@app/shared-kernel/domain/enums/user-role.enum";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepo: UserRepository,

        @Inject(PASSWORD_SERVICE_TOKEN)
        private readonly passwordService: PasswordService
    ) {}

    public async execute({ email, password, login, firstName, lastName }: CreateUserCommand): Promise<void> {
        const hashed = await this.passwordService.hash(password);

        const existedUserByLogin = await this.userRepo.findByLogin(login);
        if (existedUserByLogin) throw new ConflictException("This login is occupied");

        const existedUserByEmail = await this.userRepo.findByEmail(email);
        if (existedUserByEmail) throw new ConflictException("This email is occupied");

        const user = new User(login, email, hashed, firstName, lastName, Role.USER);
        await this.userRepo.save(user);
    }
}
