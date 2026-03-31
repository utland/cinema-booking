import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { type Payload } from 'src/application/common/models/payload.i';
import { CreateTicketApiDto } from './dtos/create-ticket.dto';
import { UpdateTicketStatusApiDto } from './dtos/update-ticket-status.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTicketCommand } from 'src/application/ticket/commands/create-ticket/create-ticket.command';
import { UpdateTicketStatusCommand } from 'src/application/ticket/commands/update-ticket-status/update-ticket-status.command';
import { DeleteTicketCommand } from 'src/application/ticket/commands/delete-ticket/delete-ticket.command';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  public async create(
    @Body() createTicketDto: CreateTicketApiDto,
    @CurrentUser() user: Payload
  ) {
    const { sessionId, seatId, hallId } = createTicketDto;
    return await this.commandBus.execute(
      new CreateTicketCommand(sessionId, seatId, user.id, hallId)
    );
  }

  @Patch()
  public async update(
    @Body() updateStatusDto: UpdateTicketStatusApiDto,
    @CurrentUser() user: Payload
  ) {
    const { ticketId, status } = updateStatusDto;
    return this.commandBus.execute(
      new UpdateTicketStatusCommand(ticketId, status, user.id)
    );
  }

  @Delete('/:id')
  public async remove(
    @Param('id', new ParseUUIDPipe()) ticketId: string,
    @CurrentUser() user: Payload
  ) {
    return this.commandBus.execute(new DeleteTicketCommand(ticketId, user.id));
  }
}
