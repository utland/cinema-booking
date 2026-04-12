import { BadRequestDomainException } from "src/domain/common/exceptions/bad-request.exception";
import { AggregateRoot } from "../../common/domain-objects/aggregate-root";
import { TimePeriod } from "./time-period";

export class Session extends AggregateRoot {
    private _timePeriod: TimePeriod;
    
    constructor(
        private readonly _movieId: string, 
        private readonly _hallId: string,
        private _basePrice: number,
        startTime: Date,
        finishTime: Date,
        id?: string
    ) {
        super(id);

        this._timePeriod = new TimePeriod(startTime, finishTime);
    }

    public setPrice(price: number): void {
        this.checkStateToModify();

        this._basePrice = price;
    }

    public changeTime(start: Date, finish: Date) {
        this.checkStateToModify();

        this._timePeriod = new TimePeriod(start, finish);
    }

    public checkDeleteCondition() {
        if (this._timePeriod.isInBetween()) {
            throw new BadRequestDomainException("Session cannot be deleted, during streaming")
        }
    }

    private checkStateToModify() {
        if (this._timePeriod.isInBetween()) {
            throw new BadRequestDomainException("This session is closed for modification")
        }
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