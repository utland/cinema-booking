import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateUserHandler } from "../application/commands/create-user/create-user.handler";
import { DeleteUserHandler } from "../application/commands/delete-user/delete-user.handler";
import { UpdateUserHandler } from "../application/commands/update-user/update-user.handler";
import { FindUserByIdHandler } from "../application/queries/find-user-by-id/find-user-by-id.handler";
import { ValidateUserHandler } from "../application/queries/validate-user/validate-user.handler";
import { USER_REPOSITORY_TOKEN } from "../domain/ports/user.repository";
import { TypeOrmUserRepository } from "../infrastructure/persistence/adapters/typeorm-user.repository";
import { USER_READ_REPOSITORY_TOKEN } from "../application/ports/user.read-repository";
import { TypeOrmUserReadRepository } from "../infrastructure/persistence/adapters/typeorm-user.read-repository";
import { CREDENTIAL_SERVICE_TOKEN } from "../domain/ports/credential.service";
import { TokenService } from "../infrastructure/external-services/token.service";
import { PASSWORD_SERVICE_TOKEN } from "../domain/ports/password.service";
import { BcryptService } from "../infrastructure/external-services/bcrypt.service";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { BadRequestExceptionFilter } from "@app/shared-kernel/presentation/filters/bad-request.filter";
import { NotFoundExceptionFilter } from "@app/shared-kernel/presentation/filters/not-found.filter";
import { ForbiddenExceptionFilter } from "@app/shared-kernel/presentation/filters/forbidden.filter";
import { ConflictExceptionFilter } from "@app/shared-kernel/presentation/filters/conflict.filter";
import { RolesGuard } from "@app/shared-kernel/presentation/guards/role.guard";
import { TypeOrmUserMapper } from "../infrastructure/persistence/mappers/typeorm-user.mapper";
import { ConfigType } from "./config/config.types";
import { IJwtConfig, jwtConfig } from "./config/jwt.config";
import { identitySchema } from "./config/schema";
import { databaseConfig } from "./config/database.config";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmUser } from "../infrastructure/persistence/entities/typeorm-user.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { UserController } from "../presentation/user.controller";
import { IdentityApiController } from "../user-api.controller";
import { IDENTITY_SERVICE_TOKEN } from "@app/shared-kernel/application/services/tokens";
import { AuthGuard } from "../presentation/guards/auth.guard";
import { rabbitmqConfig } from "./config/rabbitmq.config";

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

const filters = [
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
    { provide: APP_FILTER, useClass: ConflictExceptionFilter }
];

const guards = [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
];

@Module({
    imports: [
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
        }),

        CacheModule.register({ isGlobal: true }),

        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "apps/identity/.env",
            validationSchema: identitySchema,
            load: [databaseConfig, jwtConfig, rabbitmqConfig]
        }),

        CqrsModule.forRoot(),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => ({
                ...configService.get("database"),
                entities: [TypeOrmUser]
            })
        }),

        TypeOrmModule.forFeature([TypeOrmUser])
    ],
    controllers: [UserController, IdentityApiController],
    providers: [TypeOrmUserMapper, ...commands, ...queries, ...repositories, ...externalServices, ...filters, ...guards]
})
export class IdentityModule {}
