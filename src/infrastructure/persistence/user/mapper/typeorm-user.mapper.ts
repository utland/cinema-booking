import { Injectable } from "@nestjs/common";
import { User, Role } from "src/domain/user/models/user.entity";
import { TypeOrmMapper } from "src/infrastructure/common/interfaces/typeorm-mapper.i";
import { TypeOrmUser } from "../entities/typeorm-user.entity";

@Injectable()
export class TypeOrmUserMapper implements TypeOrmMapper<User, TypeOrmUser> {
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