import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmSession } from 'src/infrastructure/persistence/session/entities/typeorm-session.entity';
import { SessionController } from 'src/presentation/session/session.controller';
import { TicketModule } from './ticket.module';
import { HallModule } from './hall.module';
import { TypeOrmSessionRepository } from 'src/infrastructure/persistence/session/adapters/typeorm-session.repository';
import { SESSION_REPOSITORY_TOKEN } from 'src/domain/session/ports/session.repository';
import { TypeOrmSessionMapper } from 'src/infrastructure/persistence/session/mappers/typeorm-session.mapper';
import { TypeOrmSessionReadRepository } from 'src/infrastructure/persistence/session/adapters/typeorm-session.read-repository';
import { CreateSessionHandler } from 'src/application/session/commands/create-session/create-session.handler';
import { DeleteSessionHandler } from 'src/application/session/commands/delete-session/delete-session.handler';
import { UpdateSessionHandler } from 'src/application/session/commands/update-session/update-session.handler';
import { FindSessionWithHallHandler } from 'src/application/session/queries/find-session-with-hall/find-session-with-hall.handler';
import { FindSessionsByMovieHandler } from 'src/application/session/queries/find-sessions-by-movie/find-sessions-by-movie.handler';
import { SESSION_READ_REPOSITORY_TOKEN } from 'src/application/session/ports/session.read-repository';
import { MovieModule } from './movie.module';
import { SessionFactory } from 'src/domain/session/factories/session.factory';
import { SessionAccurateTimeService } from 'src/domain/common/domain-services/session-accurate-time.service';

const commands = [
  CreateSessionHandler,
  DeleteSessionHandler,
  UpdateSessionHandler
];

const queries = [
  FindSessionWithHallHandler,
  FindSessionsByMovieHandler
];

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmSession]),
    forwardRef(() => TicketModule),
    forwardRef(() => HallModule),
    MovieModule
  ],
  controllers: [SessionController],
  providers: [
    ...commands,
    ...queries,
    TypeOrmSessionMapper,
    SessionFactory,
    SessionAccurateTimeService,
    { provide: SESSION_REPOSITORY_TOKEN, useClass: TypeOrmSessionRepository },
    { provide: SESSION_READ_REPOSITORY_TOKEN, useClass: TypeOrmSessionReadRepository }
  ],
  exports: [SESSION_REPOSITORY_TOKEN, SESSION_READ_REPOSITORY_TOKEN]
})
export class SessionModule {}
