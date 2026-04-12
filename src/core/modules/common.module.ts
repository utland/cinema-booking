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
import { BadRequestDomainException } from "src/common/domain/domain-exceptions/bad-request.exception";
import { NotFoundDomainException } from "src/common/domain/domain-exceptions/not-found.exception";
import { ForbiddenDomainException } from "src/common/domain/domain-exceptions/forbidden.exception";
import { ConflictDomainException } from "src/common/domain/domain-exceptions/conflict.exception";

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
            useClass: BadRequestDomainException
        },
        {
            provide: APP_FILTER,
            useClass: NotFoundDomainException
        },
        {
            provide: APP_FILTER,
            useClass: ForbiddenDomainException
        },
        {
            provide: APP_FILTER,
            useClass: ConflictDomainException
        },
    ]
})
export class CommonModule {}
