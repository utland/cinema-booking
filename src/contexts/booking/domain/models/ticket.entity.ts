import { AggregateRoot } from "src/common/domain/domain-objects/aggregate-root";
import { Money } from "./money";
import { TicketStatus } from "src/common/domain/enums/ticket-status.enum";
import { ConflictDomainException } from "src/common/domain/domain-exceptions/conflict.exception";
import { ForbiddenDomainException } from "src/common/domain/domain-exceptions/forbidden.exception";

export class Ticket extends AggregateRoot {
    private _money: Money;

    constructor(
        private _status: TicketStatus,
        price: number,
        private readonly _sessionId: string,
        private readonly _seatId: string,
        private readonly _userId: string,
        id?: string
    ) {
        super(id);

        this.setMoney(price);
    }

    public updateStatus(status: TicketStatus) {
        if (status === TicketStatus.RESERVED) {
            throw new ConflictDomainException("Ticket cannot be reserved again");
        }

        if (status === TicketStatus.PAID && this._status !== TicketStatus.RESERVED) {
            throw new ConflictDomainException("Ticket cannot be paid");
        }

        this._status = status;
    }

    public setMoney(price: number) {
        this._money = new Money(price);
    }

    public checkOwnerchip(requestedUserId: string) {
        if (this._userId !== requestedUserId) {
            throw new ForbiddenDomainException("You are not the owner of this ticket");
        }
    }

    public get status() {
        return this._status;
    }

    public get money() {
        return this._money;
    }

    public get sessionId() {
        return this._sessionId;
    }

    public get seatId() {
        return this._seatId;
    }

    public get userId() {
        return this._userId;
    }
}
