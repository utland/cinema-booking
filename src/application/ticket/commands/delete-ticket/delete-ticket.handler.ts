import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTicketCommand } from "./delete-ticket.command";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "src/domain/ticket/ports/ticket.repository";

@CommandHandler(DeleteTicketCommand)
export class DeleteTicketHandler implements ICommandHandler<DeleteTicketCommand> {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository
    ) {}

    public async execute({ ticketId, userId }: DeleteTicketCommand): Promise<void> {
        const ticket = await this.ticketRepo.findById(ticketId);

        if (!ticket) throw new NotFoundException("Ticket is not found");

        ticket.checkOwnerchip(userId);

        await this.ticketRepo.delete(ticket);
    }
}
