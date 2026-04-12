import { TICKET_REPOSITORY_TOKEN, TicketRepository } from "../ports/ticket.repository";
import { TicketFactory } from "./ticket.factory";
import { Test, TestingModule } from "@nestjs/testing";
import { Ticket } from "../models/ticket.entity";
import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";
import { CATALOG_GATEWAY, CatalogBookingGateway } from "../ports/catalog-booking.port";
import { SessionBooking } from "../models/session-booking";
import { SeatBooking } from "../models/seat-booking";
import { ConflictDomainException } from "src/common/domain/domain-exceptions/conflict.exception";
import { NotFoundDomainException } from "src/common/domain/domain-exceptions/not-found.exception";

const mockTicketRepository = {
    findBySeat: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findByUser: jest.fn(),
    delete: jest.fn()
};

const mockCatalogGateway = {
    getSession: jest.fn(),
    getSeats: jest.fn()
};

describe("TicketFactory", () => {
    let factory: TicketFactory;
    let mockTicketRepo: jest.Mocked<TicketRepository>;
    let mockCatalogAdapter: jest.Mocked<CatalogBookingGateway>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketFactory,
                {
                    provide: TICKET_REPOSITORY_TOKEN,
                    useValue: mockTicketRepository
                },
                {
                    provide: CATALOG_GATEWAY,
                    useValue: mockCatalogGateway
                }
            ]
        }).compile();

        factory = module.get<TicketFactory>(TicketFactory);
        mockTicketRepo = module.get(TICKET_REPOSITORY_TOKEN);
        mockCatalogAdapter = module.get(CATALOG_GATEWAY);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        let validSession: SessionBooking;
        let validSeats: SeatBooking[];

        beforeEach(() => {
            validSession = new SessionBooking(100, new Date(Date.now() + 2 * 60 * 60 * 1000));

            validSeats = [new SeatBooking("seat-1", 1, 1)];
        });

        it("should create a ticket successfully with no discount", async () => {
            mockCatalogAdapter.getSession.mockResolvedValue(validSession);
            mockCatalogAdapter.getSeats.mockResolvedValue(validSeats);
            mockTicketRepo.findBySeat.mockResolvedValue([]);
            mockTicketRepo.findByUser.mockResolvedValue([]);

            const result = await factory.create({
                sessionId: "session-1",
                seatId: "seat-1",
                userId: "user-1",
                hallId: "hall-1"
            });

            expect(result).toBeInstanceOf(Ticket);
            expect(result.status).toBe(TicketStatus.RESERVED);
            expect(result.sessionId).toBe("session-1");
            expect(result.seatId).toBe("seat-1");
            expect(result.userId).toBe("user-1");

            expect(mockCatalogAdapter.getSession).toHaveBeenCalledWith("session-1");
            expect(mockCatalogAdapter.getSeats).toHaveBeenCalledWith("hall-1");
            expect(mockTicketRepo.findBySeat).toHaveBeenCalledWith("seat-1", "session-1");
            expect(mockTicketRepo.findByUser).toHaveBeenCalledWith("user-1", "session-1");
        });

        it("should create a ticket with discount when user has neighbour ticket", async () => {
            validSeats = [new SeatBooking("seat-1", 1, 1), new SeatBooking("seat-2", 1, 2)];

            const existingTicket = new Ticket(TicketStatus.PAID, 100, "session-1", "seat-2", "user-1", "ticket-1");

            mockCatalogAdapter.getSession.mockResolvedValue(validSession);
            mockCatalogAdapter.getSeats.mockResolvedValue(validSeats);
            mockTicketRepo.findBySeat.mockResolvedValue([]);
            mockTicketRepo.findByUser.mockResolvedValue([existingTicket]);

            const result = await factory.create({
                sessionId: "session-1",
                seatId: "seat-1",
                userId: "user-1",
                hallId: "hall-1"
            });

            expect(result.money.price).toBeLessThan(validSession.price);
        });

        it("should throw DomainException when seat is already reserved", async () => {
            const reservedTicket = new Ticket(
                TicketStatus.RESERVED,
                100,
                "session-1",
                "seat-1",
                "other-user",
                "ticket-1"
            );

            mockCatalogAdapter.getSession.mockResolvedValue(validSession);
            mockCatalogAdapter.getSeats.mockResolvedValue(validSeats);
            mockTicketRepo.findBySeat.mockResolvedValue([reservedTicket]);

            const res = async () => {
                await factory.create({
                    sessionId: "session-1",
                    seatId: "seat-1",
                    userId: "user-1",
                    hallId: "hall-1"
                });
            };

            await expect(res).rejects.toThrow(ConflictDomainException);
            await expect(res).rejects.toThrow("This seat is reserved");
        });

        it("should throw DomainException when session does not exist", async () => {
            mockCatalogAdapter.getSession.mockResolvedValue(null);

            const res = async () => {
                await factory.create({
                    sessionId: "session-1",
                    seatId: "seat-1",
                    userId: "user-1",
                    hallId: "hall-1"
                });
            };

            await expect(res).rejects.toThrow(NotFoundDomainException);
            await expect(res).rejects.toThrow("Session doesn't exist");
        });

        it("should throw DomainException when hall does not exist", async () => {
            mockCatalogAdapter.getSession.mockResolvedValue(validSession);
            mockCatalogAdapter.getSeats.mockResolvedValue(null);

            const res = async () => {
                await factory.create({
                    sessionId: "session-1",
                    seatId: "seat-1",
                    userId: "user-1",
                    hallId: "hall-1"
                });
            };

            await expect(res).rejects.toThrow(NotFoundDomainException);
            await expect(res).rejects.toThrow("This hall is not found");
        });

        it("should throw DomainException when seat does not exist", async () => {
            mockCatalogAdapter.getSession.mockResolvedValue(validSession);
            mockCatalogAdapter.getSeats.mockResolvedValue(validSeats);

            const res = async () => {
                await factory.create({
                    sessionId: "session-1",
                    seatId: "non-existent-seat",
                    userId: "user-1",
                    hallId: "hall-1"
                });
            };

            await expect(res).rejects.toThrow(NotFoundDomainException);
            await expect(res).rejects.toThrow("This seat is not found");
        });

        it("should throw DomainException when booking time has passed", async () => {
            const pastSession = new SessionBooking(
                100,
                new Date(Date.now() - 2 * 60 * 60 * 1000) // past time
            );

            mockCatalogAdapter.getSession.mockResolvedValue(pastSession);
            mockCatalogAdapter.getSeats.mockResolvedValue(validSeats);

            const res = async () => {
                await factory.create({
                    sessionId: "session-1",
                    seatId: "seat-1",
                    userId: "user-1",
                    hallId: "hall-1"
                });
            };

            await expect(res).rejects.toThrow(ConflictDomainException);
            await expect(res).rejects.toThrow("Booking time has passed");
        });
    });
});
