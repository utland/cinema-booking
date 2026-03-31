import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Role } from 'src/domain/user/models/user.entity';
import { Roles } from '../common/decorators/role.decorator';
import { CreateHallApiDto } from './dtos/create-hall-api.dto';
import { UpdateSeatsApiDto } from './dtos/update-seats-api.dto';
import { UpdateHallInfoApiDto } from './dtos/update-hall-info-api.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateHallCommand } from 'src/application/hall/commands/create-hall/create-hall.command';
import { FindHallAllQuery } from 'src/application/hall/queries/find-hall-all/find-hall-all.query';
import { FindHallByIdQuery } from 'src/application/hall/queries/find-hall-by-id/find-hall-by-id.query';
import { UpdateSeatsCommand } from 'src/application/hall/commands/update-seats/update-seats.command';
import { UpdateHallInfoCommand } from 'src/application/hall/commands/update-hall-info/update-hall-info.command';
import { DeleteHallCommand } from 'src/application/hall/commands/delete-hall/delete-hall.command';

@Roles(Role.ADMIN)
@Controller('hall')
export class HallController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  public async create(@Body() createHallDto: CreateHallApiDto) {
    const { name, type, seats } = createHallDto;
    return await this.commandBus.execute(
      new CreateHallCommand(name, type, seats)
    );
  }

  @Get()
  public async findAll() {
    return await this.queryBus.execute(new FindHallAllQuery());
  }

  @Get('/:id')
  public async findOne(@Param('id', new ParseUUIDPipe()) hallId: string) {
    return await this.queryBus.execute(new FindHallByIdQuery(hallId));
  }

  @Patch('/seats')
  public async updateSeats(
    @Body() updateSeatsDto: UpdateSeatsApiDto,
  ) {
    const { hallId, seats } = updateSeatsDto;
    return await this.commandBus.execute(new UpdateSeatsCommand(hallId, seats));
  }

  @Patch('/:id')
  public async updateInfo(
    @Param('id', new ParseUUIDPipe()) hallId: string,
    @Body() updateHallDto: UpdateHallInfoApiDto,
  ) {
    const { name, type } = updateHallDto;
    return await this.commandBus.execute(new UpdateHallInfoCommand(hallId, name, type));
  }

  @Delete('/:id')
  public async remove(@Param('id', new ParseUUIDPipe()) hallId: string) {
    return await this.commandBus.execute(new DeleteHallCommand(hallId));
  }
}
