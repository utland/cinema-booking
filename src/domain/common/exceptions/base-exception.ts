export type StatusCode = 400 | 401 | 403 | 404 | 406 | 409 | 500;

export class DomainException extends Error { 
    private _status: StatusCode;

    constructor(status: StatusCode, message: string) {
        super(message);
        this._status = status;
    }

    public get status(): StatusCode {
        return this._status;
    }
}
