import { ConflictException, Inject, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PayTicketCommand } from "./pay-ticket.command";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "../../../domain/ports/ticket.repository";
import { PAYMENT_SERVICE_TOKEN, type PaymentService } from "../../../application/ports/payment.service";
import { TicketStatus } from "@app/shared-kernel/domain/enums/ticket-status.enum";
import { ClientProxy } from "@nestjs/microservices";

@CommandHandler(PayTicketCommand)
export class PayTicketHandler implements ICommandHandler<PayTicketCommand> {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository,

        @Inject(PAYMENT_SERVICE_TOKEN)
        private readonly paymentService: PaymentService,

        @Inject("RABBITMQ_SERVICE")
        private readonly rabbitMqClient: ClientProxy
    ) {}

    public async execute({ ticketId, userId, token }: PayTicketCommand): Promise<void> {
        const ticket = await this.ticketRepo.findById(ticketId);
        if (!ticket) throw new NotFoundException("Ticket is not found");

        ticket.checkOwnerchip(userId);
        ticket.updateStatus(TicketStatus.PAID);

        const response = await this.paymentService.chargePayment(token, ticket.money.price);
        if (!response) throw new InternalServerErrorException("Server error");

        if (response.status !== "success") throw new ConflictException("Payment is failed");

        await this.ticketRepo.save(ticket);

        this.rabbitMqClient.emit("ticket_paid", { amount: ticket.money.price, userId });
    }
}
