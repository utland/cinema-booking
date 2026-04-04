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
import { CommandBus } from '@nestjs/cqrs';
import { CreateTicketCommand } from 'src/application/ticket/commands/create-ticket/create-ticket.command';
import { DeleteTicketCommand } from 'src/application/ticket/commands/delete-ticket/delete-ticket.command';
import { CancelTicketCommand } from 'src/application/ticket/commands/cancel-ticket/cancel-ticket.command';
import { PayTicketCommand } from 'src/application/ticket/commands/pay-ticket/pay-ticket.command';

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

  @Patch("/cancel/:id")
  public async cancelTicket(
    @Param('id', new ParseUUIDPipe()) ticketId: string,
    @CurrentUser() user: Payload
  ) {
    return this.commandBus.execute(
      new CancelTicketCommand(ticketId, user.id)
    );
  }

  @Patch("/pay/:id")
  public async payTicket(
    @Param('id', new ParseUUIDPipe()) ticketId: string,
    @Body('token') token: string,
    @CurrentUser() user: Payload
  ) {
    return this.commandBus.execute(
      new PayTicketCommand(ticketId, user.id, token)
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
