import { DomainException } from "src/common/domain/domain-exception/base-exception";
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

    private validatePoints(start: Date, end: Date): void {
        if (start >= end) {
            throw new DomainException(400, "End time must be greater than start time for session");
        }
    }

    public get startTime(): Date {
        return this._startTime;
    }

    public get endTime(): Date {
        return this._endTime;
    }
}
