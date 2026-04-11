import { UserNotifications } from "./user-notifications";

export const USER_NOTIFICATIONS_GATEWAY = "UserNotificationsGateway";

export interface UserNotificationsGateway {
    getContacts(userId: string): Promise<UserNotifications | null>;
}
