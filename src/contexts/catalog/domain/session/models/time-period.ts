import { areIntervalsOverlapping, isWithinInterval } from "date-fns";
import { BadRequestDomainException } from "src/common/domain/domain-exceptions/bad-request.exception";
import { ValueObject } from "src/common/domain/domain-objects/value-object";

export class TimePeriod implements ValueObject {
    constructor(
        private readonly _startTime: Date,
        private readonly _endTime: Date
    ) {
        this.validatePoints(_startTime, _endTime);
    }

    public isInBetween(): boolean {
        const now = new Date();

        return this._startTime < now && this._endTime > now;
    }

    public isOverlapped(start: Date, end: Date) {
        return areIntervalsOverlapping({ start: this._startTime, end: this._endTime }, { start, end });
    }

    public isInRange(start: Date, end: Date) {
        const range = { start, end };
        return isWithinInterval(this._startTime, range) && isWithinInterval(this._endTime, range);
    }

    private validatePoints(start: Date, end: Date): void {
        if (start >= end) {
            throw new BadRequestDomainException("End time must be greater than start time for session");
        }
    }

    public get startTime(): Date {
        return this._startTime;
    }

    public get endTime(): Date {
        return this._endTime;
    }
}
