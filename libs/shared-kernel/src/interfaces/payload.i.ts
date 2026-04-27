import { Role } from "../domain/enums/user-role.enum";

export interface Payload {
    id: string;
    role: Role;
}
