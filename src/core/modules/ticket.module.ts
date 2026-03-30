import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketService } from 'src/application/ticket/ticket.service';
import { TicketFactory } from 'src/domain/ticket/factories/ticket.factory';
import { TypeOrmTicketRepository } from 'src/infrastructure/persistence/ticket/adapters/typeorm-ticket.repository';
import { TypeOrmTicket } from 'src/infrastructure/persistence/ticket/entities/typeorm-ticket.entity';
import { TicketController } from 'src/presentation/ticket/ticket.controller';
import { HallModule } from './hall.module';
import { SessionModule } from './session.module';
import { TICKET_REPOSITORY_TOKEN } from 'src/domain/ticket/ports/ticket.repository';
import { TypeOrmTicketMapper } from 'src/infrastructure/persistence/ticket/mappers/typeorm-ticket.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmTicket]),
    forwardRef(() => SessionModule),
    forwardRef(() => HallModule)
  ],
  controllers: [TicketController],
  providers: [
    TicketService, 
    TicketFactory,
    TypeOrmTicketMapper,
    { provide: TICKET_REPOSITORY_TOKEN, useClass: TypeOrmTicketRepository}
  ],
  exports: [TICKET_REPOSITORY_TOKEN]
})
export class TicketModule {}
