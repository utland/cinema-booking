import { DomainFactory } from "src/common/interfaces/domain-factory.i";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "../ports/ticket.repository";
import { Inject, Injectable } from "@nestjs/common";
import { Ticket } from "../models/ticket.entity";
import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";
import { CATALOG_GATEWAY, type CatalogBookingGateway } from "../ports/catalog-booking.port";
import { SeatBooking } from "../models/seat-booking";
import { NotFoundDomainException } from "src/common/domain/domain-exceptions/not-found.exception";
import { ConflictDomainException } from "src/common/domain/domain-exceptions/conflict.exception";

type TicketFactoryArgs = {
    sessionId: string;
    seatId: string;
    userId: string;
    hallId: string;
};

@Injectable()
export class TicketFactory implements DomainFactory<Ticket> {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository,

        @Inject(CATALOG_GATEWAY)
        private readonly catalogGateway: CatalogBookingGateway
    ) {}

    public async create(args: TicketFactoryArgs): Promise<Ticket> {
        const { seatId, sessionId, userId, hallId } = args;

        const session = await this.catalogGateway.getSession(sessionId);

        if (!session) throw new NotFoundDomainException("Session doesn't exist");
        if (session.hasReservationPassed()) {
            throw new ConflictDomainException("Booking time has passed");
        }

        const seats = await this.catalogGateway.getSeats(hallId);
        if (!seats) throw new NotFoundDomainException("This hall is not found");

        const seat = seats.find((item) => item.id === seatId);
        if (!seat) throw new NotFoundDomainException("This seat is not found");

        const tickets = await this.ticketRepo.findBySeat(seatId, sessionId);

        const isReserved = tickets.some((item) => item.status === TicketStatus.RESERVED);
        if (isReserved) throw new ConflictDomainException("This seat is reserved");

        const ticket = new Ticket(TicketStatus.RESERVED, session.price, sessionId, seatId, userId);

        const hasNeighbour = await this.hasNeighbour(sessionId, userId, seats, seat);
        ticket.activeDiscount(session.startTime, hasNeighbour);

        return ticket;
    }

    private async hasNeighbour(
        sessionId: string,
        userId: string,
        seats: SeatBooking[],
        selectedSeat: SeatBooking
    ): Promise<boolean> {
        const tickets = await this.ticketRepo.findByUser(userId, sessionId);

        return tickets.some((item) => {
            const seat = seats.find((seat) => seat.id === item.seatId);
            if (!seat) return false;

            return selectedSeat.row === seat.row && Math.abs(selectedSeat.column - seat.column) === 1;
        });
    }
}
