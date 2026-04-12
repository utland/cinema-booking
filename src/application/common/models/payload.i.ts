import { Role } from "src/domain/user/models/user.entity";

export interface Payload {
    id: string;
    role: Role;
}
