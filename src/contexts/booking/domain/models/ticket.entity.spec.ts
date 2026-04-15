import { ConflictDomainException } from "src/common/domain/domain-exceptions/conflict.exception";
import { Ticket } from "./ticket.entity";
import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";
import { ForbiddenDomainException } from "src/common/domain/domain-exceptions/forbidden.exception";
import { BadRequestDomainException } from "src/common/domain/domain-exceptions/bad-request.exception";

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
});
