import { ValueObject } from "src/domain/common/domain-objects/value-object";
import { BadRequestDomainException } from "src/domain/common/exceptions/bad-request.exception";

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

    public hasReservationPassed(): boolean {
        const now = new Date();
        const deadLine = new Date(this._startTime.getTime() - 10 * 60 * 1000);

        return deadLine < now;
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