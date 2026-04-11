import { ConflictException, Inject, NotAcceptableException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ValidateUserQuery } from "./validate-user.query";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "src/contexts/identity/domain/ports/user.repository";
import { ValidateResponseDto } from "../dtos/validate-response.dto";
import { Payload } from "src/common/interfaces/payload.i";
import { PASSWORD_SERVICE_TOKEN, type PasswordService } from "src/contexts/identity/domain/ports/password.service";
import {
    CREDENTIAL_SERVICE_TOKEN,
    type CredentialService
} from "src/contexts/identity/domain/ports/credential.service";

@QueryHandler(ValidateUserQuery)
export class ValidateUserHandler implements IQueryHandler<ValidateUserQuery, ValidateResponseDto> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepo: UserRepository,

        @Inject(PASSWORD_SERVICE_TOKEN)
        private readonly passwordService: PasswordService,

        @Inject(CREDENTIAL_SERVICE_TOKEN)
        private readonly credentialService: CredentialService
    ) {}

    public async execute({ login, password }: ValidateUserQuery): Promise<ValidateResponseDto> {
        const user = await this.userRepo.findByLogin(login);
        if (!user) throw new ConflictException("User is not found");

        const isPasswordEqual = await this.passwordService.compare(password, user.hashedPassword);
        if (!isPasswordEqual) throw new NotAcceptableException("Password is wrong");

        const payload: Payload = { id: user.id, role: user.role };
        const accessToken = await this.credentialService.generate(payload);

        return { accessToken };
    }
}
