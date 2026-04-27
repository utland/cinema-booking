import { Inject, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelTicketCommand } from "./cancel-ticket.command";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "../../../domain/ports/ticket.repository";
import { TicketStatus } from "@app/shared-kernel/domain/enums/ticket-status.enum";

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
