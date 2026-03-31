import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTicketStatusCommand } from "./update-ticket-status.command";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "src/domain/ticket/ports/ticket.repository";

@CommandHandler(UpdateTicketStatusCommand)
export class UpdateTicketStatusHandler implements ICommandHandler<UpdateTicketStatusCommand> {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository
    ) {}

    public async execute({ ticketId, status, userId }: UpdateTicketStatusCommand): Promise<void> {
        const ticket = await this.ticketRepo.findById(ticketId);

        if (!ticket) throw new NotFoundException("Ticket is not found");

        ticket.checkOwnerchip(userId);
        ticket.updateStatus(status);

        await this.ticketRepo.save(ticket);
    }
}