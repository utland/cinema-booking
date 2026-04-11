import { IdentityApi } from "src/contexts/identity/api/indentity-api";
import { UserNotificationsGateway } from "../../domain/user-notifications.port";
import { UserNotifications } from "../../domain/user-notifications";
import { UserNotificationsMapper } from "./user-notifications.mapper";

export class UserNotificationAdapter implements UserNotificationsGateway {
    constructor(
        private readonly identityApi: IdentityApi,
        private readonly userMapper: UserNotificationsMapper
    ) {}

    public async getContacts(userId: string): Promise<UserNotifications | null> {
        const userDto = await this.identityApi.getUserInfo(userId);
        if (!userDto) return null;

        return this.userMapper.toUserNotifications(userDto);
    }
}
