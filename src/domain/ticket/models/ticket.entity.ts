import { AggregateRoot } from "src/domain/common/domain-objects/aggregate-root";
import { DomainException } from "src/domain/common/exceptions/base-exception";
import { Money } from "./money";


export enum TicketStatus {
  RESERVED = 'Reserved',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
}

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
          throw new DomainException(409, 'Ticket cannot be reserved again');
        }
    
        if (status === TicketStatus.PAID && this._status !== TicketStatus.RESERVED) {
          throw new DomainException(409, 'Ticket cannot be paid');
        }

        this._status = status;
    }

    public setMoney(price: number) {
        this._money = new Money(price);
    }

    public activeDiscount(startTime: Date, hasNeighbour: boolean) {
        const money = this._money.calculateDiscount(startTime, hasNeighbour);
        this._money = money;
    }

    public checkOwnerchip(requestedUserId: string) {
        if (this._userId !== requestedUserId) {
            throw new DomainException(403, 'You are not the owner of this ticket');
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