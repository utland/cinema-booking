import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from "src/domain/session/ports/session.repository";
import { DomainException } from "../../common/exceptions/base-exception";
import { DomainFactory } from "../../common/interfaces/domain-factory.i";
import { Seat } from "../../hall/models/seat.entity";
import { Session } from "../../session/models/session.entity";
import { Ticket, TicketStatus } from "../models/ticket.entity";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "../ports/ticket.repository";
import { HALL_REPOSITORY_TOKEN, type HallRepository } from "src/domain/hall/ports/hall.repository";
import { Inject, Injectable } from "@nestjs/common";

type TicketFactoryArgs = {
    sessionId: string,
    seatId: string,
    userId: string,
    hallId: string,
}

interface TicketPricingInfo {
    basePrice: number,
    startTime: Date,
    hasNeighbour: boolean
}

@Injectable()
export class TicketFactory implements DomainFactory<Ticket> {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository,

        @Inject(HALL_REPOSITORY_TOKEN)
        private readonly hallRepo: HallRepository,

        @Inject(SESSION_REPOSITORY_TOKEN)
        private readonly sessionRepo: SessionRepository
    ) {}
    
    public async create(args: TicketFactoryArgs): Promise<Ticket> {
        const { seatId, sessionId, userId, hallId } = args;

        const session = await this.sessionRepo.findById(sessionId);
        if (!session) throw new DomainException(404, "Session doesn't exist");

        if (session.timePeriod.hasReservationPassed()) {
            throw new DomainException(409, "Booking time has passed")
        }

        const hall = await this.hallRepo.findById(hallId);
        if (!hall) throw new DomainException(404, "This hall doesn't exist");

        const seat = hall.findSeat(seatId);
        
        const seatTickets = await this.ticketRepo.findBySeat(seatId, sessionId);
        const isReserved = seatTickets.some(item => item.status === TicketStatus.RESERVED);
        if (isReserved) throw new DomainException(409, "This seat is reserved");

        const hasNeighbour = await this.hasNeighbour(sessionId, userId, hall.seats, seat);

        const ticket = new Ticket(
            TicketStatus.RESERVED, session.basePrice, sessionId, seatId, userId
        );

        ticket.activeDiscount(session.timePeriod.startTime, hasNeighbour);

        return ticket;
    }

    private async hasNeighbour(
        sessionId: string, userId: string, seats: Seat[], selectedSeat: Seat
    ): Promise<boolean> {
        const tickets = await this.ticketRepo.findByUser(userId, sessionId);

        return tickets.some(item => {
            const seat = seats.find(seat => seat.id === item.seatId);
            if (!seat) return false;

            return selectedSeat.row === seat.row && 
            Math.abs(selectedSeat.column - seat.column) === 1
        });
    }
}