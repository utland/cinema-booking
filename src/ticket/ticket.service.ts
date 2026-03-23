import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-status.dto';
import { SessionService } from 'src/session/session.service';
import { calculatePrice } from './utils/calculate-price';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    private readonly sessionService: SessionService,
  ) {}

  public async create(userId: string, createTicketDto: CreateTicketDto,): Promise<Ticket> {
    const { seatId, sessionId } = createTicketDto;

    const session = await this.sessionService.findById(sessionId);
    const tickets = await this.ticketRepo.find({
      where: { seatId, sessionId: session.id },
    });

    const isReserved = tickets.some((item) => item.status === TicketStatus.RESERVED,);
    if (isReserved) throw new ConflictException('This seat is reserved');

    const totalPrice = calculatePrice(session.basePrice, session.startTime);

    const ticket = await this.ticketRepo.save({ ...createTicketDto, price: totalPrice, userId });
    return ticket;
  }

  public async findBySessionId(sessionId: string): Promise<Ticket[]> {
    const tickets = await this.ticketRepo.findBy({
      session: { id: sessionId },
    });

    return tickets;
  }

  public async updateStatus(
    userId: string, updateStatusDto: UpdateTicketStatusDto,
  ): Promise<void> {
    const { ticketId, status } = updateStatusDto;

    const ticket = await this.checkOwnerchip(userId, ticketId);

    if (status === TicketStatus.RESERVED) {
      throw new ConflictException('Ticket cannot be reserved again');
    }

    if (status === TicketStatus.PAID && ticket.status !== TicketStatus.RESERVED) {
      throw new ConflictException('Ticket cannot be paid');
    }

    if (status === TicketStatus.CANCELLED && ticket.status !== TicketStatus.PAID) {
      throw new ConflictException('Ticket cannot be cancelled');
    }

    ticket.status = status;
    await this.ticketRepo.save(ticket);
  }

  public async remove(userId: string, ticketId: string): Promise<void> {
    const ticket = await this.checkOwnerchip(userId, ticketId);
    await this.ticketRepo.remove(ticket);
  }

  public async checkOwnerchip(userId: string, ticketId : string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOneBy({ id: ticketId });
    if (!ticket) throw new NotFoundException('Ticket not found');

    if (ticket.userId !== userId) {
      throw new ConflictException('You are not the owner of this ticket');
    }

    return ticket;
  }
}
