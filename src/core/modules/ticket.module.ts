import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketFactory } from 'src/domain/ticket/factories/ticket.factory';
import { TypeOrmTicketRepository } from 'src/infrastructure/persistence/ticket/adapters/typeorm-ticket.repository';
import { TypeOrmTicket } from 'src/infrastructure/persistence/ticket/entities/typeorm-ticket.entity';
import { TicketController } from 'src/presentation/ticket/ticket.controller';
import { HallModule } from './hall.module';
import { SessionModule } from './session.module';
import { TICKET_REPOSITORY_TOKEN } from 'src/domain/ticket/ports/ticket.repository';
import { TypeOrmTicketMapper } from 'src/infrastructure/persistence/ticket/mappers/typeorm-ticket.mapper';
import { CreateTicketHandler } from 'src/application/ticket/commands/create-ticket/create-ticket.handler';
import { DeleteTicketHandler } from 'src/application/ticket/commands/delete-ticket/delete-ticket.handler';
import { CancelTicketHandler } from 'src/application/ticket/commands/cancel-ticket/cancel-ticket.handler';
import { PayTicketHandler } from 'src/application/ticket/commands/pay-ticket/pay-ticket.handler';

const commands = [
  CreateTicketHandler,
  DeleteTicketHandler,
  CancelTicketHandler,
  PayTicketHandler
];

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmTicket]),
    forwardRef(() => SessionModule),
    forwardRef(() => HallModule)
  ],
  controllers: [TicketController],
  providers: [
    ...commands,
    TicketFactory,
    TypeOrmTicketMapper,
    { provide: TICKET_REPOSITORY_TOKEN, useClass: TypeOrmTicketRepository},
  ],
  exports: [TICKET_REPOSITORY_TOKEN]
})
export class TicketModule {}
