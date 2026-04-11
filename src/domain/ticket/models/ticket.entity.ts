import { AggregateRoot } from "src/domain/common/domain-objects/aggregate-root";
import { Money } from "./money";
import { ConflictDomainException } from "src/domain/common/exceptions/conflict.exception";
import { ForbiddenDomainException } from "src/domain/common/exceptions/forbidden.exception";


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
          throw new ConflictDomainException('Ticket cannot be reserved again');
        }
    
        if (status === TicketStatus.PAID && this._status !== TicketStatus.RESERVED) {
          throw new ConflictDomainException('Ticket cannot be paid');
        }
    
        if (status === TicketStatus.CANCELLED && this._status !== TicketStatus.PAID) {
          throw new ConflictDomainException('Ticket can be cancelled only if it is paid');
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
            throw new ForbiddenDomainException('You are not the owner of this ticket');
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