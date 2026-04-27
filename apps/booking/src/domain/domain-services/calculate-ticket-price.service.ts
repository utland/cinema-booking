import { Inject } from "@nestjs/common";
import { SessionBooking } from "../models/session-booking";
import { Ticket } from "../models/ticket.entity";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "../ports/ticket.repository";
import { SeatBooking } from "../models/seat-booking";
import { differenceInMinutes } from "date-fns";

export class CalculateTicketPriceService {
    constructor(
        @Inject(TICKET_REPOSITORY_TOKEN)
        private readonly ticketRepo: TicketRepository
    ) {}

    public async calculateWithDiscount(
        userId: string,
        session: SessionBooking,
        seats: SeatBooking[],
        selected: SeatBooking
    ): Promise<number> {
        const userTickets = await this.ticketRepo.findByUser(userId, session.id);
        const hasNeighbour = this.hasNeighbour(userTickets, seats, selected);

        let discount = 1;

        if (hasNeighbour) discount -= 0.1;

        const now = new Date();
        const minutesToStart = differenceInMinutes(session.startTime, now);

        if (minutesToStart < 30 && minutesToStart > 0) discount -= 0.2;

        return session.price * discount;
    }

    private hasNeighbour(userTickets: Ticket[], seats: SeatBooking[], selectedSeat: SeatBooking): boolean {
        return userTickets.some((item) => {
            const seat = seats.find((seat) => seat.id === item.seatId);
            if (!seat) return false;

            return selectedSeat.row === seat.row && Math.abs(selectedSeat.column - seat.column) === 1;
        });
    }
}
