import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TicketFactory } from 'src/domain/ticket/factories/ticket.factory';
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from 'src/domain/ticket/ports/ticket.repository';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { UpdateTicketStatusDto } from './dtos/update-ticket-status.dto';
import { DeleteTicketDto } from './dtos/delete-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @Inject(TICKET_REPOSITORY_TOKEN)
    private readonly ticketRepo: TicketRepository,
    
    private readonly ticketFactory: TicketFactory,
  ) {}

  public async create({ sessionId, seatId, userId, hallId }: CreateTicketDto,): Promise<void> {
    await this.ticketFactory.create({ sessionId, seatId, userId, hallId });
  }

  public async updateStatus({ ticketId, status, userId }: UpdateTicketStatusDto): Promise<void> {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) throw new NotFoundException("Ticket is not found");

    ticket.checkOwnerchip(userId);
    ticket.updateStatus(status);

    await this.ticketRepo.save(ticket);
  }

  public async remove({ ticketId, userId }: DeleteTicketDto): Promise<void> {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) throw new NotFoundException("Ticket is not found");

    ticket.checkOwnerchip(userId);
    
    await this.ticketRepo.delete(ticket);
  }
}
