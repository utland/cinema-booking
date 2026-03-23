import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { SessionService } from 'src/session/session.service';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), SessionModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
