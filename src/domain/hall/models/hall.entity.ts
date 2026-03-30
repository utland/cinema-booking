import { AggregateRoot } from "src/domain/common/domain-objects/aggregate-root";
import { Seat } from "./seat.entity";
import { DomainException } from "src/domain/common/exceptions/base-exception";

export type SeatInfoType = {
    row: number;
    column: number;
    id?: string;
}

export enum HallType {
  STANDART = 'standart',
  VIP = 'vip',
}

export class Hall extends AggregateRoot {
    private _seats: Seat[];

    constructor(
        private _name: string,
        private _type: HallType,
        seatsInfo: SeatInfoType[],
        id? : string,
    ) {
        super(id);

        this.setSeats(seatsInfo);
    }

    public changeInfo(name: string, type: HallType): void {
        this._name = name;
        this._type = type;
    }

    public setSeats(seats: SeatInfoType[]): void {
        this._seats = [];

        for (const item of seats) {
            const seat = new Seat(item.row, item.column, item.id);
            this.seats.push(seat);
        }
    }

    public findSeat(seatId: string): Seat {
        const seat = this._seats.find(item => item.id === seatId);
        if (!seat) throw new DomainException(404, "Seat doesn't exist");

        return seat;
    }

    public get name(): string {
        return this._name;
    }

    public get type(): HallType {
        return this._type;
    }

    public get seats(): Seat[] {
        return this._seats;
    }
}
