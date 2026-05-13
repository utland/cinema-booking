import { Inject, Injectable } from "@nestjs/common";
import { SENDER_SERVICE_TOKEN, type SenderService } from "./ports/sender.port";
import { USER_NOTIFICATIONS_GATEWAY, type UserNotificationsGateway } from "../domain/user-notifications.port";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { TicketPaidEvent } from "@app/shared-kernel/application/events/ticket-paid.event";

@Injectable()
export class NotificationService {
    constructor(
        @Inject(SENDER_SERVICE_TOKEN)
        private readonly senderService: SenderService,

        @Inject(USER_NOTIFICATIONS_GATEWAY)
        private readonly userGateway: UserNotificationsGateway
    ) {}

    @RabbitSubscribe({
        exchange: "domain_events",
        routingKey: "ticket.paid",
        queue: "notifications-queue"
    })
    async sendTransactionNotification({ userId, amount }: TicketPaidEvent) {
        const contacts = await this.userGateway.getContacts(userId);
        if (!contacts) return;

        this.senderService.sendEmail(contacts.email, `Transaction: your ${amount}UAH was sent successfully`);
    }
}
