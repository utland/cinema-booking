import { BadRequestDomainException } from "src/common/domain/domain-exceptions/bad-request.exception";
import { ValueObject } from "src/common/domain/domain-objects/value-object";

export class RentDate implements ValueObject {
    constructor(
        private readonly _start: Date,
        private readonly _end: Date
    ) {
        this.validateDates(_start, _end);
    }

    private validateDates(start: Date, end: Date): void {
        if (start >= end) {
            throw new BadRequestDomainException("End time must be greater than start time for movie");
        }
    }

    public isGoingNow(): boolean {
        const now = new Date();

        return this._end > now && this._start < now;
    }

    public get start() {
        return this._start;
    }

    public get end() {
        return this._end;
    }
}
