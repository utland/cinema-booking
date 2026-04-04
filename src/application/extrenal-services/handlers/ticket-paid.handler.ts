import { Inject } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { TicketPaidEvent } from "src/application/ticket/commands/pay-ticket/ticket-paid.event";
import { USER_REPOSITORY_TOKEN, type UserRepository } from "src/domain/user/ports/user.repository";
import { NOTIFICATION_SERVICE_TOKEN, type NotificationService } from "../ports/notification.service";

@EventsHandler(TicketPaidEvent)
export class TicketPaidHandler implements IEventHandler<TicketPaidEvent> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepo: UserRepository,

        @Inject(NOTIFICATION_SERVICE_TOKEN)
        private readonly notificationService: NotificationService
    ) {}

    async handle({ userId, amount }: TicketPaidEvent) {
        const user = await this.userRepo.findById(userId);
        if (!user) return;

        await this.notificationService.sendEmail(
            user.email,
            `${amount}$ has been successfully transferred.`
        )
    }
}