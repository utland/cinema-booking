import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { Test, type TestingModule } from "@nestjs/testing";
import { PayTicketHandler } from "./pay-ticket.handler";
import { PayTicketCommand } from "./pay-ticket.command";
import { Ticket, TicketStatus } from "src/domain/ticket/models/ticket.entity";
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from "src/domain/ticket/ports/ticket.repository";
import { PAYMENT_SERVICE_TOKEN, type PaymentService } from "src/application/extrenal-services/ports/payment.service";
import { TicketPaidEvent } from "./ticket-paid.event";

const mockTicketRepository = {
    findById: jest.fn(),
    save: jest.fn()
};

const mockPaymentService = {
    createPayment: jest.fn()
};

const mockEventBus: jest.Mocked<EventBus> = {
    publish: jest.fn()
} as unknown as jest.Mocked<EventBus>;

describe("PayTicketHandler", () => {
    let handler: PayTicketHandler;
    let mockTicketRepo: jest.Mocked<TicketRepository>;
    let mockPaymentSvc: jest.Mocked<PaymentService>;
    let mockBus: jest.Mocked<EventBus>;
    let ticket: Ticket;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PayTicketHandler,
                {
                    provide: TICKET_REPOSITORY_TOKEN,
                    useValue: mockTicketRepository
                },
                {
                    provide: PAYMENT_SERVICE_TOKEN,
                    useValue: mockPaymentService
                },
                {
                    provide: EventBus,
                    useValue: mockEventBus
                }
            ]
        }).compile();

        handler = module.get<PayTicketHandler>(PayTicketHandler);
        mockTicketRepo = module.get<TicketRepository>(TICKET_REPOSITORY_TOKEN) as jest.Mocked<TicketRepository>;
        mockPaymentSvc = module.get<PaymentService>(PAYMENT_SERVICE_TOKEN) as jest.Mocked<PaymentService>;
        mockBus = module.get<EventBus>(EventBus) as jest.Mocked<EventBus>;
    });

    beforeEach(() => {
        jest.clearAllMocks();

        ticket = new Ticket(TicketStatus.RESERVED, 100, "session-1", "seat-1", "user-1", "ticket-1");
    });

    it("should pay a reserved ticket successfully", async () => {
        mockTicketRepo.findById.mockResolvedValue(ticket);
        mockPaymentSvc.createPayment.mockResolvedValue({ status: "success", transactionId: "tx-1" });

        await handler.execute(new PayTicketCommand("ticket-1", "user-1", "payment-token"));

        expect(ticket.status).toBe(TicketStatus.PAID);
        expect(mockPaymentSvc.createPayment).toHaveBeenCalledWith("payment-token", 100);
        expect(mockTicketRepo.save).toHaveBeenCalledWith(ticket);
        expect(mockBus.publish).toHaveBeenCalledWith(new TicketPaidEvent(100, "user-1"));
    });

    it("should throw NotFoundException when ticket does not exist", async () => {
        mockTicketRepo.findById.mockResolvedValue(null);

        await expect(handler.execute(new PayTicketCommand("ticket-1", "user-1", "payment-token"))).rejects.toThrow(
            NotFoundException
        );

        expect(mockTicketRepo.save).not.toHaveBeenCalled();
        expect(mockPaymentSvc.createPayment).not.toHaveBeenCalled();
    });

    it("should throw ConflictException when payment is failed", async () => {
        mockTicketRepo.findById.mockResolvedValue(ticket);
        mockPaymentSvc.createPayment.mockResolvedValue({ status: "cancel", transactionId: "tx-1" });

        await expect(handler.execute(new PayTicketCommand("ticket-1", "user-1", "payment-token"))).rejects.toThrow(
            ConflictException
        );

        expect(mockTicketRepo.save).not.toHaveBeenCalled();
    });

    it("should throw SystemException when paymentService return nothing", async () => {
        mockTicketRepo.findById.mockResolvedValue(ticket);
        mockPaymentSvc.createPayment.mockResolvedValue(null);

        await expect(handler.execute(new PayTicketCommand("ticket-1", "user-1", "payment-token"))).rejects.toThrow(
            InternalServerErrorException
        );

        expect(mockTicketRepo.save).not.toHaveBeenCalled();
    });
});
