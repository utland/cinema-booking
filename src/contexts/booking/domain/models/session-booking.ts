export class SessionBooking {
    constructor(
        private readonly _id: string,
        private readonly _price: number,
        private readonly _startTime: Date
    ) {}

    public hasReservationPassed(): boolean {
        const now = new Date();
        const deadLine = new Date(this._startTime.getTime() - 10 * 60 * 1000);

        return deadLine < now;
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
}
