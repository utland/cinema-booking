import { ConflictException, Inject, Injectable, NotAcceptableException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ValidateUserQuery } from "./validate-user.query";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "src/domain/user/ports/user.repository";
import { ValidateResponseDto } from "../dtos/validate-response.dto";
import { PASSWORD_SERVICE_TOKEN, type PasswordService } from "src/application/common/ports/password.service";
import { CREDENTIAL_SERVICE_TOKEN, type CredentialService } from "src/application/common/ports/credential.service";
import { Payload } from "src/application/common/models/payload.i";

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
        if (!isPasswordEqual) throw new NotAcceptableException('Password is wrong');

        const payload: Payload = { id: user.id, role: user.role };

        const secret = process.env.JWT_SECRET;
        const accessToken = await this.credentialService.generate(payload, secret);

        return { accessToken };
    }
}