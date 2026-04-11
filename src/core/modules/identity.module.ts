import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdentityApi } from "src/contexts/identity/api/indentity-api";
import { CreateUserHandler } from "src/contexts/identity/application/commands/create-user/create-user.handler";
import { DeleteUserHandler } from "src/contexts/identity/application/commands/delete-user/delete-user.handler";
import { UpdateUserHandler } from "src/contexts/identity/application/commands/update-user/update-user.handler";
import { USER_READ_REPOSITORY_TOKEN } from "src/contexts/identity/application/ports/user.read-repository";
import { FindUserByIdHandler } from "src/contexts/identity/application/queries/find-user-by-id/find-user-by-id.handler";
import { ValidateUserHandler } from "src/contexts/identity/application/queries/validate-user/validate-user.handler";
import { CREDENTIAL_SERVICE_TOKEN } from "src/contexts/identity/domain/ports/credential.service";
import { PASSWORD_SERVICE_TOKEN } from "src/contexts/identity/domain/ports/password.service";
import { USER_REPOSITORY_TOKEN } from "src/contexts/identity/domain/ports/user.repository";
import { BcryptService } from "src/contexts/identity/infrastructure/external-services/bcrypt.service";
import { TokenService } from "src/contexts/identity/infrastructure/external-services/token.service";
import { TypeOrmUserReadRepository } from "src/contexts/identity/infrastructure/persistence/adapters/typeorm-user.read-repository";
import { TypeOrmUserRepository } from "src/contexts/identity/infrastructure/persistence/adapters/typeorm-user.repository";
import { TypeOrmUser } from "src/contexts/identity/infrastructure/persistence/entities/typeorm-user.entity";
import { UserController } from "src/contexts/identity/presentation/user.controller";
import { ConfigType } from "../config/config.types";
import { IJwtConfig } from "../config/jwt.config";
import { TypeOrmUserMapper } from "src/contexts/identity/infrastructure/persistence/mappers/typeorm-user.mapper";

const commands = [CreateUserHandler, DeleteUserHandler, UpdateUserHandler];

const queries = [FindUserByIdHandler, ValidateUserHandler];

const repositories = [
    { provide: USER_REPOSITORY_TOKEN, useClass: TypeOrmUserRepository },
    { provide: USER_READ_REPOSITORY_TOKEN, useClass: TypeOrmUserReadRepository }
];

const externalServices = [
    { provide: CREDENTIAL_SERVICE_TOKEN, useClass: TokenService },
    { provide: PASSWORD_SERVICE_TOKEN, useClass: BcryptService }
];

@Module({
    imports: [
        TypeOrmModule.forFeature([TypeOrmUser]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => {
                const jwtConfig = configService.get("jwt") as IJwtConfig;

                return {
                    secret: jwtConfig.secret,
                    signOptions: {
                        expiresIn: jwtConfig.expiresIn as any
                    }
                };
            }
        })
    ],
    controllers: [UserController],
    providers: [IdentityApi, TypeOrmUserMapper, ...commands, ...queries, ...repositories, ...externalServices],
    exports: [IdentityApi]
})
export class IdentityModule {}
