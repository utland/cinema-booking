import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTicketCommand } from "./delete-ticket.command";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "../../../domain/ports/ticket.repository";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { TicketUpdatedEvent } from "@app/shared-kernel/application/events/ticket-updated.event";

@CommandHandler(DeleteTicketCommand)
export class DeleteTicketHandler implements ICommandHandler<DeleteTicketCommand> {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository,

        private readonly amqpConnection: AmqpConnection
    ) {}

    public async execute({ ticketId, userId }: DeleteTicketCommand): Promise<void> {
        const ticket = await this.ticketRepo.findById(ticketId);
        if (!ticket) throw new NotFoundException("Ticket is not found");

        ticket.checkOwnerchip(userId);

        await this.ticketRepo.delete(ticket);

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
