import { AggregateRoot } from "@app/shared-kernel/domain/domain-objects/aggregate-root";
import { Role } from "@app/shared-kernel/domain/enums/user-role.enum";

export class User extends AggregateRoot {
    constructor(
        private readonly _login: string,
        private readonly _email: string,
        private _hashedPassword: string,
        private _firstName: string,
        private _lastName: string,
        private _role: Role,
        id?: string
    ) {
        super(id);
    }

    public updateInfo(firstName: string, lastName: string) {
        this._firstName = firstName;
        this._lastName = lastName;
    }

    public setHash(hashed: string) {
        this._hashedPassword = hashed;
    }

    public get login() {
        return this._login;
    }

    public get email() {
        return this._email;
    }

    public get firstName() {
        return this._firstName;
    }

    public get lastName() {
        return this._lastName;
    }

    public get hashedPassword() {
        return this._hashedPassword;
    }

    public get role() {
        return this._role;
    }
}
