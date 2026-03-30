import { BaseEntity } from "./base.entity";

export class AggregateRoot extends BaseEntity {
    private _createdAt: Date;

    constructor(id?: string) {
        super(id);
        this._createdAt = new Date();
    }

    public get createdAt() {
        return this._createdAt;
    }
}