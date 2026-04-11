export class TicketPaidEvent {
    constructor(
        public readonly amount: number,
        public readonly userId: string
    ) {}
}
