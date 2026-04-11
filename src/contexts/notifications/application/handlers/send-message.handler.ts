import { Inject } from "@nestjs/common";
import { SENDER_SERVICE_TOKEN, type SenderService } from "../ports/sender.port";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TicketPaidEvent } from "src/common/application/events/ticket-paid.event";
import { USER_NOTIFICATIONS_GATEWAY, type UserNotificationsGateway } from "../../domain/user-notifications.port";

@EventsHandler(TicketPaidEvent)
export class SendMessageHandler implements IEventHandler<TicketPaidEvent> {
    constructor(
        @Inject(SENDER_SERVICE_TOKEN)
        private readonly senderService: SenderService,

        @Inject(USER_NOTIFICATIONS_GATEWAY)
        private readonly userGateway: UserNotificationsGateway
    ) {}

    async handle({ userId, amount }: TicketPaidEvent) {
        const contacts = await this.userGateway.getContacts(userId);
        if (!contacts) return;

        this.senderService.sendEmail(contacts.email, `Transaction: your ${amount}UAH was sent successfully`);
    }
}
