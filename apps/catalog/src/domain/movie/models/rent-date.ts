import { BadRequestDomainException } from "@app/shared-kernel/domain/domain-exceptions/bad-request.exception";
import { ValueObject } from "@app/shared-kernel/domain/domain-objects/value-object";

export class RentDate implements ValueObject {
    constructor(
        private readonly _start: Date,
        private readonly _end: Date
    ) {
        if (_start >= _end) {
            throw new BadRequestDomainException("End time must be greater than start time for movie");
        }
    }

    public isInRange(date: Date): boolean {
        return this._end > date && this._start < date;
    }

    public get start() {
        return this._start;
    }

    public get end() {
        return this._end;
    }
}
