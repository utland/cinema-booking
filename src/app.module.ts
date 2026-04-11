import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { MovieModule } from "./movie/movie.module";
import { SessionModule } from "./session/session.module";
import { HallModule } from "./hall/hall.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { appSchema } from "./config/schema";
import { databaseConfig } from "./config/database.config";
import { jwtConfig } from "./config/jwt.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigType } from "./config/config.types";
import { AuthModule } from "./auth/auth.module";
import { TicketController } from "./ticket/ticket.controller";
import { TicketModule } from "./ticket/ticket.module";
import { User } from "./user/entities/user.entity";
import { Ticket } from "./ticket/entities/ticket.entity";
import { Session } from "./session/entities/session.entity";
import { Movie } from "./movie/entities/movie.entity";
import { Hall } from "./hall/entities/hall.entity";
import { Seat } from "./hall/entities/seat.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => ({
                ...configService.get("database"),
                entities: [User, Ticket, Session, Movie, Hall, Seat]
            })
        }),

        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: appSchema,
            load: [databaseConfig, jwtConfig]
        }),

        UserModule,
        MovieModule,
        SessionModule,
        HallModule,
        TicketModule,
        AuthModule
    ]
})
export class AppModule {}
