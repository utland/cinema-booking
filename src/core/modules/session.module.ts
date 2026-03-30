import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from 'src/application/session/session.service';
import { TypeOrmSession } from 'src/infrastructure/persistence/session/entities/typeorm-session.entity';
import { SessionController } from 'src/presentation/session/session.controller';
import { TicketModule } from './ticket.module';
import { HallModule } from './hall.module';
import { TypeOrmSessionRepository } from 'src/infrastructure/persistence/session/adapters/typeorm-session.repository';
import { SESSION_REPOSITORY_TOKEN } from 'src/domain/session/ports/session.repository';
import { TypeOrmSessionMapper } from 'src/infrastructure/persistence/session/mappers/typeorm-session.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmSession]),
    forwardRef(() => TicketModule),
    forwardRef(() => HallModule)
  ],
  controllers: [SessionController],
  providers: [
    SessionService, 
    TypeOrmSessionMapper,
    { provide: SESSION_REPOSITORY_TOKEN, useClass: TypeOrmSessionRepository}
  ],
  exports: [SESSION_REPOSITORY_TOKEN]
})
export class SessionModule {}
