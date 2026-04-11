export class UserNotifications {
    constructor(
        private readonly _email: string,
        private readonly _phoneNumber: string
    ) {}

    public get email() {
        return this._email;
    }

    public get phoneNumber() {
        return this._phoneNumber;
    }
}
