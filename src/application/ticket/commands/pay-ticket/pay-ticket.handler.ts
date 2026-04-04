import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "src/domain/ticket/ports/ticket.repository";
import { PayTicketCommand } from "./pay-ticket.command";
import { TicketStatus } from "src/domain/ticket/models/ticket.entity";
import { PAYMENT_SERVICE_TOKEN, type PaymentService } from "src/application/extrenal-services/ports/payment.service";
import { TicketPaidEvent } from "./ticket-paid.event";

@CommandHandler(PayTicketCommand)
export class PayTicketHandler implements ICommandHandler<PayTicketCommand> {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository,

        @Inject(PAYMENT_SERVICE_TOKEN)
        private readonly paymentService: PaymentService,

        private readonly eventBus: EventBus
    ) {}

    public async execute({ ticketId, userId, token }: PayTicketCommand): Promise<void> {
        const ticket = await this.ticketRepo.findById(ticketId);
        if (!ticket) throw new NotFoundException("Ticket is not found");

        ticket.checkOwnerchip(userId);
        ticket.updateStatus(TicketStatus.PAID);
        
        const isPassed = await this.paymentService.createPayment(token, ticket.money.price);
        if (!isPassed) throw new ConflictException("Payment failed");
        
        await this.ticketRepo.save(ticket);

        this.eventBus.publish(new TicketPaidEvent(ticket.money.price, userId))
    }
}