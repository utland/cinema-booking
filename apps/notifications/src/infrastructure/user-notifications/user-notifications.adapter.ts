import { UserNotificationsGateway } from "../../domain/user-notifications.port";
import { UserNotifications } from "../../domain/user-notifications";
import { UserNotificationsMapper } from "./user-notifications.mapper";
import { ClientProxy } from "@nestjs/microservices";
import { IDENTITY_SERVICE_TOKEN } from "@app/shared-kernel/application/services/tokens";
import { Inject } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { UserIdentityDto } from "@app/shared-kernel/application/services/dtos/identity/user-identity.dto";

export class UserNotificationAdapter implements UserNotificationsGateway {
    constructor(
        @Inject(IDENTITY_SERVICE_TOKEN)
        private readonly identityClient: ClientProxy,
        private readonly userMapper: UserNotificationsMapper
    ) {}

    public async getContacts(userId: string): Promise<UserNotifications | null> {
        const res = this.identityClient.send<UserIdentityDto | null>({ cmd: "get_user_contacts" }, { userId });

        const user = await firstValueFrom(res);
        if (!user) return null;

        return this.userMapper.toUserNotifications(user);
    }
}
