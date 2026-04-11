import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelTicketCommand } from "./cancel-ticket.command";
import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "src/contexts/booking/domain/ports/ticket.repository";

@CommandHandler(CancelTicketCommand)
export class CancelTicketHandler implements ICommandHandler<CancelTicketCommand> {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository
    ) {}

    public async execute({ ticketId, userId }: CancelTicketCommand): Promise<void> {
        const ticket = await this.ticketRepo.findById(ticketId);
        if (!ticket) throw new NotFoundException("Ticket is not found");

        ticket.checkOwnerchip(userId);
        ticket.updateStatus(TicketStatus.CANCELLED);

        await this.ticketRepo.save(ticket);
    }
}
