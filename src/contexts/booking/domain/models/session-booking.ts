import { isWithinInterval } from "date-fns";

export class SessionBooking {
    constructor(
        private readonly _id: string,
        private readonly _price: number,
        private readonly _startTime: Date,
        private readonly _bookingTime: Date
    ) {}

    public isReservationAvailable(): boolean {
        const now = new Date();
        const deadLine = new Date(this._startTime.getTime() - 10 * 60 * 1000);

        return isWithinInterval(now, { start: this._bookingTime, end: deadLine });
    }

    public get id() {
        return this._id;
    }

    public get price() {
        return this._price;
    }

    public get startTime() {
        return this._startTime;
    }

    public get bookingTime() {
        return this._bookingTime;
    }
}
