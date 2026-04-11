import { Role } from "src/common/domain/enums/user-role.enum";

export interface Payload {
    id: string;
    role: Role;
}
