import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { type Payload } from 'src/application/common/models/payload.i';
import { CreateTicketApiDto } from './dtos/create-ticket.dto';
import { TicketService } from 'src/application/ticket/ticket.service';
import { UpdateTicketStatusApiDto } from './dtos/update-ticket-status.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  public async create(
    @Body() createTicketDto: CreateTicketApiDto,
    @CurrentUser() user: Payload
  ) {
    return await this.ticketService.create({ ...createTicketDto, userId: user.id });
  }

  @Patch()
  public async update(
    @Body() updateStatusDto: UpdateTicketStatusApiDto,
    @CurrentUser() user: Payload
  ) {
    return this.ticketService.updateStatus({ ...updateStatusDto, userId: user.id });
  }

  @Delete('/:id')
  public async remove(
    @Param('id') ticketId: string,
    @CurrentUser() user: Payload
  ) {
    return this.ticketService.remove({ userId: user.id, ticketId });
  }
}
