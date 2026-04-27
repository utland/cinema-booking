import { Injectable } from "@nestjs/common";
import { UserNotifications } from "../../domain/user-notifications";
import { UserIdentityDto } from "@app/shared-kernel/application/services/dtos/identity/user-identity.dto";

@Injectable()
export class UserNotificationsMapper {
    public toUserNotifications({ email, phoneNumber }: UserIdentityDto): UserNotifications {
        const userNotifications = new UserNotifications(email, phoneNumber);
        return userNotifications;
    }
}
