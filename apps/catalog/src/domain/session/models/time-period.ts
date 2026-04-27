import { BadRequestDomainException } from "@app/shared-kernel/domain/domain-exceptions/bad-request.exception";
import { ValueObject } from "@app/shared-kernel/domain/domain-objects/value-object";
import { areIntervalsOverlapping, isWithinInterval } from "date-fns";

export class TimePeriod implements ValueObject {
    constructor(
        private readonly _startTime: Date,
        private readonly _endTime: Date
    ) {
        this.validatePoints(_startTime, _endTime);
    }

    public isInRange(date: Date): boolean {
        return this._startTime < date && this._endTime > date;
    }

    public isOverlapped(start: Date, end: Date) {
        return areIntervalsOverlapping({ start: this._startTime, end: this._endTime }, { start, end });
    }

    public isTimePeriodInside(start: Date, end: Date) {
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
