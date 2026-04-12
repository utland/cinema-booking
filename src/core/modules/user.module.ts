import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { USER_REPOSITORY_TOKEN } from "src/domain/user/ports/user.repository";
import { TypeOrmUserRepository } from "src/infrastructure/persistence/user/adapters/typeorm-user.repository";
import { TypeOrmUser } from "src/infrastructure/persistence/user/entities/typeorm-user.entity";
import { TypeOrmUserMapper } from "src/infrastructure/persistence/user/mapper/typeorm-user.mapper";
import { UserController } from "src/presentation/user/user.controller";
import { CreateUserHandler } from "src/application/user/commands/create-user/create-user.handler";
import { DeleteUserHandler } from "src/application/user/commands/delete-user/delete-user.handler";
import { UpdateUserHandler } from "src/application/user/commands/update-user/update-user.handler";
import { FindUserByIdHandler } from "src/application/user/queries/find-user-by-id/find-user-by-id.handler";
import { ValidateUserHandler } from "src/application/user/queries/validate-user/validate-user.handler";
import { TypeOrmUserReadRepository } from "src/infrastructure/persistence/user/adapters/typeorm-user.read-repository";
import { USER_READ_REPOSITORY_TOKEN } from "src/application/user/ports/user.read-repository";

const commands = [CreateUserHandler, DeleteUserHandler, UpdateUserHandler];

const queries = [FindUserByIdHandler, ValidateUserHandler];

@Module({
    imports: [TypeOrmModule.forFeature([TypeOrmUser])],
    controllers: [UserController],
    providers: [
        ...commands,
        ...queries,
        TypeOrmUserMapper,
        { provide: USER_REPOSITORY_TOKEN, useClass: TypeOrmUserRepository },
        { provide: USER_READ_REPOSITORY_TOKEN, useClass: TypeOrmUserReadRepository }
    ]
})
export class UserModule {}
