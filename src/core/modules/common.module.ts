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
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "src/common/presentation/guards/auth.guard";
import { RolesGuard } from "src/common/presentation/guards/role.guard";
import { IdentityApi } from "src/contexts/identity/api/indentity-api";
import { IdentityModule } from "./identity.module";
import { stripeConfig } from "../config/stripe.config";

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
        }
    ]
})
export class CommonModule {}
