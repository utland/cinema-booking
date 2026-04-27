import { Controller, Inject } from "@nestjs/common";
import { CREDENTIAL_SERVICE_TOKEN, type CredentialService } from "./domain/ports/credential.service";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "./domain/ports/user.repository";
import { Payload as JwtPayload } from "@app/shared-kernel/interfaces/payload.i";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UserIdentityDto } from "@app/shared-kernel/application/services/dtos/identity/user-identity.dto";

@Controller()
export class IdentityApiController {
    constructor(
        @Inject(CREDENTIAL_SERVICE_TOKEN)
        private readonly credentialService: CredentialService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository
    ) {}

    @MessagePattern({ cmd: "check_token" })
    public async checkToken(@Payload() token: string): Promise<JwtPayload | null> {
        try {
            const payload = await this.credentialService.verify(token);
            return payload;
        } catch {
            return null;
        }
    }

    @MessagePattern({ cmd: "get_user_info" })
    public async getUserInfo(@Payload() { userId }: { userId: string }): Promise<UserIdentityDto | null> {
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
