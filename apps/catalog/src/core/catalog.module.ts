import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { BadRequestExceptionFilter } from "@app/shared-kernel/presentation/filters/bad-request.filter";
import { NotFoundExceptionFilter } from "@app/shared-kernel/presentation/filters/not-found.filter";
import { ForbiddenExceptionFilter } from "@app/shared-kernel/presentation/filters/forbidden.filter";
import { ConflictExceptionFilter } from "@app/shared-kernel/presentation/filters/conflict.filter";
import { AuthGuard } from "@app/shared-kernel/presentation/guards/auth.guard";
import { RolesGuard } from "@app/shared-kernel/presentation/guards/role.guard";
import { CreateHallHandler } from "../application/hall/commands/create-hall/create-hall.handler";
import { DeleteHallHandler } from "../application/hall/commands/delete-hall/delete-hall.handler";
import { UpdateHallInfoHandler } from "../application/hall/commands/update-hall-info/update-hall-info.handler";
import { UpdateSeatsHandler } from "../application/hall/commands/update-seats/update-seats.handler";
import { CreateMovieHandler } from "../application/movie/commands/create-movie/create-movie.handler";
import { DeleteMovieHandler } from "../application/movie/commands/delete-movie/delete-movie.handler";
import { UpdateMovieHandler } from "../application/movie/commands/update-movie/update-movie.handler";
import { CreateSessionHandler } from "../application/session/commands/create-session/create-session.handler";
import { DeleteSessionHandler } from "../application/session/commands/delete-session/delete-session.handler";
import { UpdateSessionHandler } from "../application/session/commands/update-session/update-session.handler";
import { FindAllHallHandler } from "../application/hall/queries/find-hall-all/find-hall-all.handler";
import { FindHallByIdHandler } from "../application/hall/queries/find-hall-by-id/find-hall-by-id.handler";
import { FindActiveMoviesHandler } from "../application/movie/queries/find-active-movies/find-active-movies.handler";
import { FindMovieAllHandler } from "../application/movie/queries/find-movie-all/find-movie-all.handler";
import { FindMovieByIdHandler } from "../application/movie/queries/find-movie-by-id/find-movie-by-id.handler";
import { FindSessionWithHallHandler } from "../application/session/queries/find-session-with-hall/find-session-with-hall.handler";
import { FindSessionsByMovieHandler } from "../application/session/queries/find-sessions-by-movie/find-sessions-by-movie.handler";
import { TypeOrmHallMapper } from "../infrastructure/hall/mappers/typeorm-hall.mapper";
import { TypeOrmMovieMapper } from "../infrastructure/movie/mappers/typeorm-movie.mapper";
import { TypeOrmSessionMapper } from "../infrastructure/session/mappers/typeorm-session.mapper";
import { HallAccessService } from "../domain/common/domain-services/hall-access.service";
import { SessionAccurateTimeService } from "../domain/common/domain-services/session-accurate-time.service";
import { SessionFactory } from "../domain/session/factories/session.factory";
import { HALL_REPOSITORY_TOKEN } from "../domain/hall/ports/hall.repository";
import { MOVIE_REPOSITORY_TOKEN } from "../domain/movie/ports/movie.repository";
import { MOVIE_READ_REPOSITORY_TOKEN } from "../application/movie/ports/movie.read-repository";
import { SESSION_REPOSITORY_TOKEN } from "../domain/session/ports/session.repository";
import { SESSION_READ_REPOSITORY_TOKEN } from "../application/session/ports/session.read-repository";
import { TypeOrmHallRepository } from "../infrastructure/hall/adapters/typeorm-hall.repository";
import { TypeOrmMovieRepository } from "../infrastructure/movie/adapters/typeorm-movie.repository";
import { TypeOrmMovieReadRepository } from "../infrastructure/movie/adapters/typeorm-movie.read-repository";
import { TypeOrmSessionRepository } from "../infrastructure/session/adapters/typeorm-session.repository";
import { TypeOrmSessionReadRepository } from "../infrastructure/session/adapters/typeorm-session.read-repository";
import { TypeOrmHall } from "../infrastructure/hall/entities/typeorm-hall.entity";
import { TypeOrmSeat } from "../infrastructure/hall/entities/typeorm-seat.entity";
import { TypeOrmMovie } from "../infrastructure/movie/entities/typeorm-movie.entity";
import { TypeOrmSession } from "../infrastructure/session/entities/typeorm-session.entity";
import { HallController } from "../presentation/hall/hall.controller";
import { SessionController } from "../presentation/session/session.controller";
import { MovieController } from "../presentation/movie/movie.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { catalogSchema } from "./config/schema";
import { databaseConfig } from "./config/database.config";
import { CqrsModule } from "@nestjs/cqrs";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { IDENTITY_SERVICE_TOKEN } from "@app/shared-kernel/application/services/tokens";
import { ConfigType } from "./config/config.types";
import { CatalogApiController } from "../catalog-api.controller";
import { CacheModule } from "@nestjs/cache-manager";
import { rabbitmqConfig } from "./config/rabbitmq.config";

const commands = [
    CreateHallHandler,
    DeleteHallHandler,
    UpdateHallInfoHandler,
    UpdateSeatsHandler,

    CreateMovieHandler,
    DeleteMovieHandler,
    UpdateMovieHandler,

    CreateSessionHandler,
    DeleteSessionHandler,
    UpdateSessionHandler
];

const queries = [
    FindAllHallHandler,
    FindHallByIdHandler,

    FindActiveMoviesHandler,
    FindMovieByIdHandler,
    FindMovieAllHandler,

    FindSessionWithHallHandler,
    FindSessionsByMovieHandler
];

const mappers = [TypeOrmHallMapper, TypeOrmMovieMapper, TypeOrmSessionMapper];

const domainServices = [HallAccessService, SessionAccurateTimeService];

const factories = [SessionFactory];

const repositories = [
    { provide: HALL_REPOSITORY_TOKEN, useClass: TypeOrmHallRepository },
    { provide: MOVIE_REPOSITORY_TOKEN, useClass: TypeOrmMovieRepository },
    { provide: MOVIE_READ_REPOSITORY_TOKEN, useClass: TypeOrmMovieReadRepository },
    { provide: SESSION_REPOSITORY_TOKEN, useClass: TypeOrmSessionRepository },
    { provide: SESSION_READ_REPOSITORY_TOKEN, useClass: TypeOrmSessionReadRepository }
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
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: catalogSchema,
            envFilePath: "apps/catalog/.env",
            load: [databaseConfig, rabbitmqConfig]
        }),

        CqrsModule.forRoot(),

        CacheModule.register({ isGlobal: true }),

        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                name: IDENTITY_SERVICE_TOKEN,
                useFactory: (configService: ConfigService<ConfigType>) => {
                    const options = configService.get("rabbitmq");

                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [options.url],
                            queue: "identity_queue",
                            queueOptions: {
                                durable: true
                            }
                        }
                    };
                },
                inject: [ConfigService]
            }
        ]),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService<ConfigType>) => ({
                ...configService.get("database"),
                entities: [TypeOrmHall, TypeOrmSeat, TypeOrmMovie, TypeOrmSession]
            })
        }),

        TypeOrmModule.forFeature([TypeOrmHall, TypeOrmSeat, TypeOrmMovie, TypeOrmSession])
    ],
    controllers: [HallController, SessionController, MovieController, CatalogApiController],
    providers: [
        ...commands,
        ...queries,
        ...mappers,
        ...domainServices,
        ...repositories,
        ...factories,
        ...filters,
        ...guards
    ]
})
export class CatalogModule {}
