import { differenceInMinutes } from "date-fns";
import { BadRequestDomainException } from "src/common/domain/domain-exceptions/bad-request.exception";
import { ValueObject } from "src/common/domain/domain-objects/value-object";

export class Money implements ValueObject {
    constructor(private readonly _price: number) {
        if (_price <= 0) {
            throw new BadRequestDomainException("Price cannot be less than 0");
        }
    }

    public get price() {
        return this._price;
    }
}
