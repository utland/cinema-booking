import { Role } from "src/common/domain/enums/user-role.enum";

export class UserIdentityDto {
    login: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: Role;
}
