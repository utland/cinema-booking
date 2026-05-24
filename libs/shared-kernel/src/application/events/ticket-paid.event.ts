export class TicketPaidEvent {
    constructor(
        public readonly userId: string,
        public readonly sessionId: string,
        public readonly seatId: string,
        public readonly amount: number
    ) {}
}
