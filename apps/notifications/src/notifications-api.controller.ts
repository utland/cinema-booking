import { EventPattern, Payload } from "@nestjs/microservices";
import { NotificationService } from "./application/notifications.service";

export class NotificationsApiController {
    constructor(private readonly notificationService: NotificationService) {}

    @EventPattern("ticket_paid")
    async sendTransactionNotification(@Payload() body: any) {
        const { userId, amount } = body;
        await this.notificationService.sendTransactionNotification({ userId, amount });
    }
}
