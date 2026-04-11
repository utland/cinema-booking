import { Module } from "@nestjs/common";
import { IdentityModule } from "./identity.module";
import { SendMessageHandler } from "src/contexts/notifications/application/handlers/send-message.handler";
import { USER_NOTIFICATIONS_GATEWAY } from "src/contexts/notifications/domain/user-notifications.port";
import { UserNotificationAdapter } from "src/contexts/notifications/infrastructure/user-notifications/user-notifications.adapter";
import { UserNotificationsMapper } from "src/contexts/notifications/infrastructure/user-notifications/user-notifications.mapper";
import { NodemailerService } from "src/contexts/notifications/infrastructure/adapters/nodemailer.service";
import { SENDER_SERVICE_TOKEN } from "src/contexts/notifications/application/ports/sender.port";

const identityAcl = [
    { provide: USER_NOTIFICATIONS_GATEWAY, useClass: UserNotificationAdapter },
    UserNotificationsMapper
];

@Module({
    imports: [IdentityModule],
    providers: [SendMessageHandler, { provide: SENDER_SERVICE_TOKEN, useClass: NodemailerService }, ...identityAcl]
})
export class NotificationsModule {}
