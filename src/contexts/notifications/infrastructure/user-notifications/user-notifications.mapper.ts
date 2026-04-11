import { Injectable } from "@nestjs/common";
import { UserIdentityDto } from "src/contexts/identity/api/user-identity.dto";
import { UserNotifications } from "../../domain/user-notifications";

@Injectable()
export class UserNotificationsMapper {
    public toUserNotifications({ email, phoneNumber }: UserIdentityDto): UserNotifications {
        const userNotifications = new UserNotifications(email, phoneNumber);
        return userNotifications;
    }
}
