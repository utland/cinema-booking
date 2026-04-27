export class SeatBooking {
    constructor(
        private readonly _id: string,
        private readonly _row: number,
        private readonly _column: number
    ) {}

    public get id() {
        return this._id;
    }

    public get row() {
        return this._row;
    }

    public get column() {
        return this._column;
    }
}
