import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CREDENTIAL_SERVICE_TOKEN, type CredentialService } from "../domain/ports/credential.service";
import { type Payload } from "src/common/interfaces/payload.i";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "../domain/ports/user.repository";
import { UserIdentityDto } from "./user-identity.dto";

@Injectable()
export class IdentityApi {
    constructor(
        @Inject(CREDENTIAL_SERVICE_TOKEN)
        private readonly credentialService: CredentialService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository
    ) {}

    public async checkToken(token: string): Promise<Payload | null> {
        try {
            const payload = await this.credentialService.verify(token);
            return payload;
        } catch {
            return null;
        }
    }

    public async getUserInfo(userId: string): Promise<UserIdentityDto | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) return null;

        return {
            login: user.login,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: "",
            role: user.role
        };
    }
}
