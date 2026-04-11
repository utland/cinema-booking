import { HALL_REPOSITORY_TOKEN, HallRepository } from "src/domain/hall/ports/hall.repository";
import { TICKET_REPOSITORY_TOKEN, TicketRepository } from "../ports/ticket.repository";
import { TicketFactory } from "./ticket.factory";
import { SESSION_REPOSITORY_TOKEN, SessionRepository } from "src/domain/session/ports/session.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { Session } from "../../session/models/session.entity";
import { Hall, HallType } from "../../hall/models/hall.entity";
import { Seat } from "../../hall/models/seat.entity";
import { Ticket, TicketStatus } from "../models/ticket.entity";
import { NotFoundDomainException } from "src/domain/common/exceptions/not-found.exception";
import { ConflictDomainException } from "src/domain/common/exceptions/conflict.exception";

const mockTicketRepository = {
    findBySeat: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    findByUser: jest.fn(),
    delete: jest.fn(),
};

const mockHallRepository = {
    findById: jest.fn(),
};

const mockSessionRepository = {
    findById: jest.fn(),
};

describe("TicketFactory", () => {
    let factory: TicketFactory;
    let mockTicketRepo: jest.Mocked<TicketRepository>;
    let mockHallRepo: jest.Mocked<HallRepository>;
    let mockSessionRepo: jest.Mocked<SessionRepository>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketFactory,
                {
                    provide: TICKET_REPOSITORY_TOKEN,
                    useValue: mockTicketRepository,
                },
                {
                    provide: HALL_REPOSITORY_TOKEN,
                    useValue: mockHallRepository,
                },
                {
                    provide: SESSION_REPOSITORY_TOKEN,
                    useValue: mockSessionRepository,
                },
            ],
        }).compile();

        factory = module.get<TicketFactory>(TicketFactory);
        mockTicketRepo = module.get(TICKET_REPOSITORY_TOKEN);
        mockHallRepo = module.get(HALL_REPOSITORY_TOKEN);
        mockSessionRepo = module.get(SESSION_REPOSITORY_TOKEN);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        let validSession: Session;
        let validHall: Hall;
        let validSeat: Seat;

        beforeEach(() => {
            validSession = new Session(
                'movie-1',
                'hall-1',
                100,
                new Date(Date.now() + 2 * 60 * 60 * 1000),
                new Date(Date.now() + 4 * 60 * 60 * 1000),
                'session-1'
            );

            validHall = new Hall(
                'Hall 1',
                HallType.STANDART,
                [{ row: 1, column: 1, id: 'seat-1' }],
                'hall-1'
            );

            validSeat = validHall.findSeat('seat-1');
        });

        it('should create a ticket successfully with no discount', async () => {
            mockSessionRepo.findById.mockResolvedValue(validSession);
            mockHallRepo.findById.mockResolvedValue(validHall);
            mockTicketRepo.findBySeat.mockResolvedValue([]);
            mockTicketRepo.findByUser.mockResolvedValue([]);

            const result = await factory.create({
                sessionId: 'session-1',
                seatId: 'seat-1',
                userId: 'user-1',
                hallId: 'hall-1'
            });

            expect(result).toBeInstanceOf(Ticket);
            expect(result.status).toBe(TicketStatus.RESERVED);
            expect(result.sessionId).toBe('session-1');
            expect(result.seatId).toBe('seat-1');
            expect(result.userId).toBe('user-1');

            expect(mockSessionRepo.findById).toHaveBeenCalledWith('session-1');
            expect(mockHallRepo.findById).toHaveBeenCalledWith('hall-1');
            expect(mockTicketRepo.findBySeat).toHaveBeenCalledWith('seat-1', 'session-1');
            expect(mockTicketRepo.findByUser).toHaveBeenCalledWith('user-1', 'session-1');
        });

        it('should create a ticket with discount when user has neighbour ticket', async () => {
            validHall = new Hall(
                'Hall 1',
                HallType.STANDART,
                [
                    { row: 1, column: 1, id: 'seat-1' },
                    { row: 1, column: 2, id: 'seat-2' }
                ],
                'hall-1'
            );

            const existingTicket = new Ticket(
                TicketStatus.PAID,
                100,
                'session-1',
                'seat-2',
                'user-1',
                'ticket-1'
            );

            mockSessionRepo.findById.mockResolvedValue(validSession);
            mockHallRepo.findById.mockResolvedValue(validHall);
            mockTicketRepo.findBySeat.mockResolvedValue([]);
            mockTicketRepo.findByUser.mockResolvedValue([existingTicket]);

            const result = await factory.create({
                sessionId: 'session-1',
                seatId: 'seat-1',
                userId: 'user-1',
                hallId: 'hall-1'
            });

            console.log(result.money.price);

            expect(result.money.price).toBeLessThan(validSession.basePrice);
        });

        it('should throw DomainException when session does not exist', async () => {
            mockSessionRepo.findById.mockResolvedValue(null);

            const res = async () => {
                await factory.create({
                    sessionId: 'session-1',
                    seatId: 'seat-1',
                    userId: 'user-1',
                    hallId: 'hall-1'
                });
            } 

            await expect(res).rejects.toThrow(NotFoundDomainException);
            await expect(res).rejects.toThrow("Session doesn't exist");
        });

        it('should throw DomainException when session has passed', async () => {
            const passedSession = new Session(
                'movie-1',
                'hall-1',
                100,
                new Date(Date.now() - 4 * 60 * 60 * 1000),
                new Date(Date.now() + 3 * 60 * 60 * 1000),
                'session-1'
            );

            mockSessionRepo.findById.mockResolvedValue(passedSession);

            const res = async () => {
                await factory.create({
                    sessionId: 'session-1',
                    seatId: 'seat-1',
                    userId: 'user-1',
                    hallId: 'hall-1'
                });
            } 

            await expect(res).rejects.toThrow(ConflictDomainException);
            await expect(res).rejects.toThrow("Booking time has passed");
        });

        it('should throw DomainException when hall does not exist', async () => {
            mockSessionRepo.findById.mockResolvedValue(validSession);
            mockHallRepo.findById.mockResolvedValue(null);

            const res = async () => {
                await factory.create({
                    sessionId: 'session-1',
                    seatId: 'seat-1',
                    userId: 'user-1',
                    hallId: 'hall-1'
                });
            } 

            await expect(res).rejects.toThrow(NotFoundDomainException);
            await expect(res).rejects.toThrow("This hall doesn't exist");
        });

        it('should throw DomainException when seat is already reserved', async () => {
            const reservedTicket = new Ticket(
                TicketStatus.RESERVED,
                100,
                'session-1',
                'seat-1',
                'other-user',
                'ticket-1'
            );

            mockSessionRepo.findById.mockResolvedValue(validSession);
            mockHallRepo.findById.mockResolvedValue(validHall);
            mockTicketRepo.findBySeat.mockResolvedValue([reservedTicket]);

            const res = async () => {
                await factory.create({
                    sessionId: 'session-1',
                    seatId: 'seat-1',
                    userId: 'user-1',
                    hallId: 'hall-1'
                });
            };

            await expect(res).rejects.toThrow(ConflictDomainException);
            await expect(res).rejects.toThrow("This seat is reserved");
        });
    });
});