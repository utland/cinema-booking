import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";
import { CalculateTicketPriceService } from "./calculate-ticket-price.service";
import { SessionBooking } from "../models/session-booking";
import { Ticket } from "../models/ticket.entity";
import { SeatBooking } from "../models/seat-booking";
import { TicketRepository } from "../ports/ticket.repository";

describe("CalculateTicketPriceService", () => {
    const userId = "user-1";
    const sessionId = "session-1";
    const price = 100;
    let now: Date;

    beforeEach(() => {
        now = new Date("2026-04-15T10:00:00.000Z");
        jest.useFakeTimers({ now });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    function createService(tickets: Ticket[]) {
        const ticketRepo = {
            findByUser: jest.fn().mockResolvedValue(tickets),
        } as unknown as TicketRepository;

        return new CalculateTicketPriceService(ticketRepo);
    }

    function createSession(minutesFromNow: number) {
        return new SessionBooking(sessionId, price, new Date(now.getTime() + minutesFromNow * 60 * 1000));
    }

    it("returns full price when there is no neighbour and more than 30 minutes remain", async () => {
        const service = createService([]);
        const session = createSession(60);
        const seats = [new SeatBooking("seat-1", 1, 1)];
        const selected = seats[0];

        const result = await service.calculateWithDiscount(userId, session, seats, selected);

        expect(result).toBe(price);
        expect((service as any).ticketRepo.findByUser).toHaveBeenCalledWith(userId, sessionId);
    });

    it("applies neighbour discount when the user already has an adjacent seat", async () => {
        const existingTicket = new Ticket(TicketStatus.RESERVED, price, sessionId, "seat-2", userId);
        const service = createService([existingTicket]);
        const session = createSession(60);
        const seats = [
            new SeatBooking("seat-1", 1, 1),
            new SeatBooking("seat-2", 1, 2),
        ];
        const selected = seats[0];

        const result = await service.calculateWithDiscount(userId, session, seats, selected);

        expect(result).toBe(90);
    });

    it("applies last-minute discount when the session starts in less than 30 minutes", async () => {
        const service = createService([]);
        const session = createSession(20);
        const seats = [new SeatBooking("seat-1", 1, 1)];
        const selected = seats[0];

        const result = await service.calculateWithDiscount(userId, session, seats, selected);

        expect(result).toBe(80);
    });

    it("applies both neighbour and last-minute discounts together", async () => {
        const existingTicket = new Ticket(TicketStatus.RESERVED, price, sessionId, "seat-2", userId);
        const service = createService([existingTicket]);
        const session = createSession(20);
        const seats = [
            new SeatBooking("seat-1", 1, 1),
            new SeatBooking("seat-2", 1, 2),
        ];
        const selected = seats[0];

        const result = await service.calculateWithDiscount(userId, session, seats, selected);

        expect(result).toBe(70);
    });
});
