import { Injectable } from "@nestjs/common";
import { TypeOrmUser } from "../entities/typeorm-user.entity";
import { EntityMapper } from "src/common/interfaces/entity-mapper";
import { Role } from "src/common/domain/enums/user-role.enum";
import { User } from "src/contexts/identity/domain/models/user.entity";

@Injectable()
export class TypeOrmUserMapper implements EntityMapper<User, TypeOrmUser> {
    toDomain(ormEntity: TypeOrmUser): User {
        return new User(
            ormEntity.login,
            ormEntity.email,
            ormEntity.password,
            ormEntity.firstName,
            ormEntity.lastName,
            ormEntity.role as Role,
            ormEntity.id
        );
    }

    toOrm(domainEntity: User): TypeOrmUser {
        const ormUser = new TypeOrmUser();

        ormUser.id = domainEntity.id;
        ormUser.login = domainEntity.login;
        ormUser.email = domainEntity.email;
        ormUser.password = domainEntity.hashedPassword;
        ormUser.firstName = domainEntity.firstName;
        ormUser.lastName = domainEntity.lastName;
        ormUser.role = domainEntity.role;
        ormUser.createdAt = domainEntity.createdAt;

        return ormUser;
    }
}
