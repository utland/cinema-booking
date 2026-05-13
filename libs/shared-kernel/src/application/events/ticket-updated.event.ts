
type TicketType = "canceled" | "booked";

export class TicketUpdatedEvent {
    constructor(
        public readonly userId: string,
        public readonly sessionId: string,
        public readonly seatId: string,
        public readonly ticketType: TicketType
    ) {}
}
