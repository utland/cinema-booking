import { differenceInMinutes } from "date-fns";
import { ValueObject } from "src/domain/common/domain-objects/value-object";
import { BadRequestDomainException } from "src/domain/common/exceptions/bad-request.exception";

export class Money implements ValueObject {
    constructor(
        private readonly _price: number
    ) {
        this.validatePrice(_price);
    }

    public calculateDiscount(startTime: Date, hasNeighbour: boolean): Money {
        let discount = 1;

        if (hasNeighbour) discount -= 0.1

        const minutesToStart = differenceInMinutes(startTime,new Date())
        if (minutesToStart < 30 && minutesToStart > 0) discount -= 0.2;

        return new Money(this._price * discount);
    }

    public validatePrice(price: number): void {
        if (price <= 0) {
            throw new BadRequestDomainException("Price cannot be less than 0")
        }
    }

    public get price() {
        return this._price;
    }
}