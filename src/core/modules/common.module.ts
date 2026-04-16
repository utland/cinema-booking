import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigType } from "../config/config.types";
import { TypeOrmUser } from "src/contexts/identity/infrastructure/persistence/entities/typeorm-user.entity";
import { TypeOrmTicket } from "src/contexts/booking/infrastructure/persistence/typeorm-ticket.entity";
import { TypeOrmSession } from "src/contexts/catalog/infrastructure/session/entities/typeorm-session.entity";
import { TypeOrmMovie } from "src/contexts/catalog/infrastructure/movie/entities/typeorm-movie.entity";
import { TypeOrmHall } from "src/contexts/catalog/infrastructure/hall/entities/typeorm-hall.entity";
import { TypeOrmSeat } from "src/contexts/catalog/infrastructure/hall/entities/typeorm-seat.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { databaseConfig } from "../config/database.config";
import { jwtConfig } from "../config/jwt.config";
import { appSchema } from "../config/schema";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/common/presentation/guards/auth.guard";
import { RolesGuard } from "src/common/presentation/guards/role.guard";
import { IdentityModule } from "./identity.module";
import { stripeConfig } from "../config/stripe.config";
import { CacheModule } from "@nestjs/cache-manager";
import { BadRequestExceptionFilter } from "src/common/presentation/filters/bad-request.filter";
import { NotFoundExceptionFilter } from "src/common/presentation/filters/not-found.filter";
import { ForbiddenExceptionFilter } from "src/common/presentation/filters/forbidden.filter";
import { ConflictExceptionFilter } from "src/common/presentation/filters/conflict.filter";

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: appSchema,
            load: [databaseConfig, jwtConfig, stripeConfig]
        }),

        CqrsModule.forRoot(),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => ({
                ...configService.get("database"),
                entities: [TypeOrmUser, TypeOrmTicket, TypeOrmSession, TypeOrmMovie, TypeOrmHall, TypeOrmSeat]
            })
        }),

        CacheModule.register({ isGlobal: true }),

        IdentityModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        },
        {
            provide: APP_FILTER,
            useClass: BadRequestExceptionFilter
        },
        {
            provide: APP_FILTER,
            useClass: NotFoundExceptionFilter
        },
        {
            provide: APP_FILTER,
            useClass: ForbiddenExceptionFilter
        },
        {
            provide: APP_FILTER,
            useClass: ConflictExceptionFilter
        },
    ]
})
export class CommonModule {}
