import { BadRequestDomainException } from "src/domain/common/exceptions/bad-request.exception";
import { AggregateRoot } from "../../common/domain-objects/aggregate-root";
import { RentDate } from "./rent-date";

export class Movie extends AggregateRoot {
    private _rentDate: RentDate;

    constructor(
        private _title: string,
        private _duration: number,
        private _description: string,
        private _genre: string,
        rentStart: Date,
        rentEnd: Date,
        id?: string
    ) {
        super(id);

        this._rentDate = new RentDate(rentStart, rentEnd);
    }

    public updateInfo(title: string, description: string, duration: number, genre: string): void {
        this.checkStateToModify();

        this._title = title;
        this._description = description;
        this._duration = duration;
        this._genre = genre;
    }

    public changeRentDate(startDate: Date, endDate: Date): void {
        this.checkStateToModify();

        this._rentDate = new RentDate(startDate, endDate);
    }

    public validateDeleteOperation() {
        if (this._rentDate.isGoingNow()) {
            throw new BadRequestDomainException("Movie cannot be deleted during streaming");
        }
    }

    private checkStateToModify() {
        if (this._rentDate.isGoingNow()) {
            throw new BadRequestDomainException("Movie cannot be changed during streaming");
        }
    }

    public get title() {
        return this._title;
    }

    public get description() {
        return this._description;
    }

    public get duration() {
        return this._duration;
    }

    public get genre() {
        return this._genre;
    }

    public get rentDate() {
        return this._rentDate;
    }
}
