import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-status.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type IPayload } from 'src/common/interfaces/payload.i';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  public async create(
    @Body() createTicketDto: CreateTicketDto,
    @CurrentUser() user: IPayload
  ) {
    return await this.ticketService.create(user.id, createTicketDto);
  }

  @Patch()
  public async update(
    @Body() updateStatusDto: UpdateTicketStatusDto,
    @CurrentUser() user: IPayload
  ) {
    return this.ticketService.updateStatus(user.id, updateStatusDto);
  }

  @Delete('/:id')
  public async remove(
    @Param('id') id: string,
    @CurrentUser() user: IPayload
  ) {
    return this.ticketService.remove(user.id, id);
  }
}
