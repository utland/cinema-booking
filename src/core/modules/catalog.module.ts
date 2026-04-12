import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmHall } from "src/contexts/catalog/infrastructure/hall/entities/typeorm-hall.entity";
import { TypeOrmSeat } from "src/contexts/catalog/infrastructure/hall/entities/typeorm-seat.entity";
import { TypeOrmMovie } from "src/contexts/catalog/infrastructure/movie/entities/typeorm-movie.entity";
import { TypeOrmSession } from "src/contexts/catalog/infrastructure/session/entities/typeorm-session.entity";
import { HallController } from "src/contexts/catalog/presentation/hall/hall.controller";
import { MovieController } from "src/contexts/catalog/presentation/movie/movie.controller";
import { SessionController } from "src/contexts/catalog/presentation/session/session.controller";
import { CreateHallHandler } from "src/contexts/catalog/application/hall/commands/create-hall/create-hall.handler";
import { DeleteHallHandler } from "src/contexts/catalog/application/hall/commands/delete-hall/delete-hall.handler";
import { UpdateHallInfoHandler } from "src/contexts/catalog/application/hall/commands/update-hall-info/update-hall-info.handler";
import { UpdateSeatsHandler } from "src/contexts/catalog/application/hall/commands/update-seats/update-seats.handler";
import { FindAllHallHandler } from "src/contexts/catalog/application/hall/queries/find-hall-all/find-hall-all.handler";
import { FindHallByIdHandler } from "src/contexts/catalog/application/hall/queries/find-hall-by-id/find-hall-by-id.handler";
import { CreateMovieHandler } from "src/contexts/catalog/application/movie/commands/create-movie/create-movie.handler";
import { DeleteMovieHandler } from "src/contexts/catalog/application/movie/commands/delete-movie/delete-movie.handler";
import { UpdateMovieHandler } from "src/contexts/catalog/application/movie/commands/update-movie/update-movie.handler";
import { CreateSessionHandler } from "src/contexts/catalog/application/session/commands/create-session/create-session.handler";
import { DeleteSessionHandler } from "src/contexts/catalog/application/session/commands/delete-session/delete-session.handler";
import { UpdateSessionHandler } from "src/contexts/catalog/application/session/commands/update-session/update-session.handler";
import { FindSessionWithHallHandler } from "src/contexts/catalog/application/session/queries/find-session-with-hall/find-session-with-hall.handler";
import { FindSessionsByMovieHandler } from "src/contexts/catalog/application/session/queries/find-sessions-by-movie/find-sessions-by-movie.handler";
import { FindActiveMoviesHandler } from "src/contexts/catalog/application/movie/queries/find-active-movies/find-active-movies.handler";
import { FindMovieByIdHandler } from "src/contexts/catalog/application/movie/queries/find-movie-by-id/find-movie-by-id.handler";
import { FindMovieAllHandler } from "src/contexts/catalog/application/movie/queries/find-movie-all/find-movie-all.handler";
import { TypeOrmHallMapper } from "src/contexts/catalog/infrastructure/hall/mappers/typeorm-hall.mapper";
import { TypeOrmMovieMapper } from "src/contexts/catalog/infrastructure/movie/mappers/typeorm-movie.mapper";
import { TypeOrmSessionMapper } from "src/contexts/catalog/infrastructure/session/mappers/typeorm-session.mapper";
import { HallAccessService } from "src/contexts/catalog/domain/common/domain-services/hall-access.service";
import { HALL_REPOSITORY_TOKEN } from "src/contexts/catalog/domain/hall/ports/hall.repository";
import { TypeOrmHallRepository } from "src/contexts/catalog/infrastructure/hall/adapters/typeorm-hall.repository";
import { MOVIE_REPOSITORY_TOKEN } from "src/contexts/catalog/domain/movie/ports/movie.repository";
import { MOVIE_READ_REPOSITORY_TOKEN } from "src/contexts/catalog/application/movie/ports/movie.read-repository";
import { TypeOrmMovieRepository } from "src/contexts/catalog/infrastructure/movie/adapters/typeorm-movie.repository";
import { TypeOrmMovieReadRepository } from "src/contexts/catalog/infrastructure/movie/adapters/typeorm-movie.read-repository";
import { SESSION_REPOSITORY_TOKEN } from "src/contexts/catalog/domain/session/ports/session.repository";
import { SESSION_READ_REPOSITORY_TOKEN } from "src/contexts/catalog/application/session/ports/session.read-repository";
import { TypeOrmSessionReadRepository } from "src/contexts/catalog/infrastructure/session/adapters/typeorm-session.read-repository";
import { CatalogApi } from "src/contexts/catalog/api/catalog-api";
import { TypeOrmSessionRepository } from "src/contexts/catalog/infrastructure/session/adapters/typeorm-session.repository";
import { SessionAccurateTimeService } from "src/contexts/catalog/domain/common/domain-services/session-accurate-time.service";
import { SessionFactory } from "src/contexts/catalog/domain/session/factories/session.factory";

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

@Module({
    imports: [TypeOrmModule.forFeature([TypeOrmHall, TypeOrmSeat, TypeOrmMovie, TypeOrmSession])],
    controllers: [HallController, SessionController, MovieController],
    providers: [CatalogApi, ...commands, ...queries, ...mappers, ...domainServices, ...repositories, ...factories],
    exports: [CatalogApi]
})
export class CatalogModule {}
