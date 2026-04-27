import { AggregateRoot } from "@app/shared-kernel/domain/domain-objects/aggregate-root";
import { TimePeriod } from "./time-period";
import { BadRequestDomainException } from "@app/shared-kernel/domain/domain-exceptions/bad-request.exception";

export class Session extends AggregateRoot {
    private _timePeriod: TimePeriod;

    constructor(
        private readonly _movieId: string,
        private readonly _hallId: string,
        private _basePrice: number,
        startTime: Date,
        finishTime: Date,
        private _bookingTime: Date,
        id?: string
    ) {
        super(id);

        if (_bookingTime > startTime) {
            throw new BadRequestDomainException("Booking time must be before session start time");
        }

        this._timePeriod = new TimePeriod(startTime, finishTime);
    }

    public setPrice(price: number): void {
        this._basePrice = price;
    }

    public changeTime(start: Date, finish: Date, bookingTime: Date): void {
        this._timePeriod = new TimePeriod(start, finish);

        if (bookingTime > this._timePeriod.startTime) {
            throw new BadRequestDomainException("Booking time must be before session start time");
        }

        this._bookingTime = bookingTime;
    }

    public isActive(): boolean {
        const now = new Date();

        return this._timePeriod.endTime > now && this._bookingTime < now;
    }

    public get bookingTime(): Date {
        return this._bookingTime;
    }

    public get movieId(): string {
        return this._movieId;
    }

    public get hallId(): string {
        return this._hallId;
    }

    public get timePeriod(): TimePeriod {
        return this._timePeriod;
    }

    public get basePrice(): number {
        return this._basePrice;
    }
}
