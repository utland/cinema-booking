import { ConflictException, Inject, NotAcceptableException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ValidateUserQuery } from "./validate-user.query";
import { TokenDto } from "../dtos/token.dto";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "@app/identity/domain/ports/user.repository";
import { PASSWORD_SERVICE_TOKEN, type PasswordService } from "@app/identity/domain/ports/password.service";
import { CREDENTIAL_SERVICE_TOKEN, type CredentialService } from "@app/identity/domain/ports/credential.service";
import { Payload } from "@app/shared-kernel/interfaces/payload.i";

@QueryHandler(ValidateUserQuery)
export class ValidateUserHandler implements IQueryHandler<ValidateUserQuery> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepo: UserRepository,

        @Inject(PASSWORD_SERVICE_TOKEN)
        private readonly passwordService: PasswordService,

        @Inject(CREDENTIAL_SERVICE_TOKEN)
        private readonly credentialService: CredentialService
    ) {}

    public async execute({ login, password }: ValidateUserQuery): Promise<TokenDto> {
        const user = await this.userRepo.findByLogin(login);
        if (!user) throw new ConflictException("User is not found");

        const isPasswordEqual = await this.passwordService.compare(password, user.hashedPassword);
        if (!isPasswordEqual) throw new NotAcceptableException("Password is wrong");

        const payload: Payload = { id: user.id, role: user.role };
        const accessToken = await this.credentialService.generate(payload);

        return { accessToken };
    }
}
