import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelTicketCommand } from "./cancel-ticket.command";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "../../../domain/ports/ticket.repository";
import { TicketStatus } from "@app/shared-kernel/domain/enums/ticket-status.enum";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { TicketUpdatedEvent } from "@app/shared-kernel/application/events/ticket-updated.event";

@CommandHandler(CancelTicketCommand)
export class CancelTicketHandler implements ICommandHandler<CancelTicketCommand> {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository,

        private readonly amqpConnection: AmqpConnection
    ) {}

    public async execute({ ticketId, userId }: CancelTicketCommand): Promise<void> {
        const ticket = await this.ticketRepo.findById(ticketId);
        if (!ticket) throw new NotFoundException("Ticket is not found");

        ticket.checkOwnerchip(userId);
        ticket.updateStatus(TicketStatus.CANCELLED);

        await this.ticketRepo.save(ticket);

        this.amqpConnection.publish(
            "domain_events", 
            "ticket.updated",
            new TicketUpdatedEvent(
                ticket.userId, 
                ticket.sessionId, 
                ticket.seatId, 
                "canceled"
            )
        );
    }
}
