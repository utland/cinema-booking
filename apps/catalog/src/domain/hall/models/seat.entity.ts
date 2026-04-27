import { LocalEntity } from "@app/shared-kernel/domain/domain-objects/local-entity";

export class Seat extends LocalEntity {
    constructor(
        private readonly _row: number,
        private readonly _column: number,
        id?: string
    ) {
        super(id);
    }

    public get row(): number {
        return this._row;
    }

    public get column(): number {
        return this._column;
    }
}
