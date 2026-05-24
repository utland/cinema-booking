import { Inject, Injectable } from "@nestjs/common";
import { CREDENTIAL_SERVICE_TOKEN, type CredentialService } from "../domain/ports/credential.service";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "../domain/ports/user.repository";
import { Payload as JwtPayload } from "@app/shared-kernel/interfaces/payload.i";
import { UserIdentityDto } from "@app/shared-kernel/application/services/dtos/identity/user-identity.dto";
import { RabbitRPC } from "@golevelup/nestjs-rabbitmq";
import { Public } from "@app/shared-kernel/presentation/decorators/public.decorator";

@Public()
@Injectable()
export class IdentityApiService {
    constructor(
        @Inject(CREDENTIAL_SERVICE_TOKEN)
        private readonly credentialService: CredentialService,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository
    ) {}

    @RabbitRPC({
        exchange: "domain_events",
        routingKey: "check_token",
        queue: "catalog-queue"
    })
    public async checkToken({ token }: { token: string }): Promise<JwtPayload | null> {
        try {
            const payload = await this.credentialService.verify(token);
            return payload;
        } catch {
            return null;
        }
    }

    @RabbitRPC({
        exchange: "domain_events",
        routingKey: "get_user_info",
        queue: "catalog-queue"
    })
    public async getUserInfo({ userId }: { userId: string }): Promise<UserIdentityDto | null> {
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
