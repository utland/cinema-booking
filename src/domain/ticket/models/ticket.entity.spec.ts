import { ConflictDomainException } from "src/domain/common/exceptions/conflict.exception";
import { Ticket, TicketStatus } from "./ticket.entity";
import { ForbiddenDomainException } from "src/domain/common/exceptions/forbidden.exception";
import { BadRequestDomainException } from "src/domain/common/exceptions/bad-request.exception";

describe("Ticket", () => {
    it("should throw DomainException when trying to reserve an already reserved ticket", async () => {
        const res = async () => {
            const ticket = new Ticket(TicketStatus.RESERVED, 100, "session-1", "seat-1", "user-1", "ticket-1");

            ticket.updateStatus(TicketStatus.RESERVED);
        };

        await expect(res).rejects.toThrow(ConflictDomainException);
        await expect(res).rejects.toThrow("Ticket cannot be reserved again");
    });

    it("should throw DomainException when trying to pay for a not reserved ticket", async () => {
        const res = async () => {
            const ticket = new Ticket(TicketStatus.PAID, 100, "session-1", "seat-1", "user-1", "ticket-1");

            ticket.updateStatus(TicketStatus.PAID);
        };

        await expect(res).rejects.toThrow(ConflictDomainException);
        await expect(res).rejects.toThrow("Ticket cannot be paid");
    });

    it("should throw DomainException when ticket owner is invalid", async () => {
        const res = async () => {
            const ticket = new Ticket(TicketStatus.RESERVED, 100, "session-1", "seat-1", "user-1", "ticket-1");

            ticket.checkOwnerchip("user-2");
        };

        await expect(res).rejects.toThrow(ForbiddenDomainException);
        await expect(res).rejects.toThrow("You are not the owner of this ticket");
    });

    it("should throw DomainException when price is invalid", async () => {
        const res = async () => {
            const ticket = new Ticket(TicketStatus.RESERVED, -100, "session-1", "seat-1", "user-1", "ticket-1");
        };

        await expect(res).rejects.toThrow(BadRequestDomainException);
        await expect(res).rejects.toThrow("Price cannot be less than 0");
    });

    it("should correctly apply discount", async () => {
        const ticket = new Ticket(TicketStatus.RESERVED, 100, "session-1", "seat-1", "user-1", "ticket-1");

        ticket.activeDiscount(new Date(Date.now() + 20 * 60 * 1000), true);

        expect(ticket.money.price).toBe(70);
    });
});
