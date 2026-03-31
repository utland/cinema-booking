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
import { Roles } from '../common/decorators/role.decorator';
import { CreateSessionApiDto } from './dtos/create-session-api.dto';
import { FindSessionsByMovieApiDto } from './dtos/find-sessions-by-movie-api.dto';
import { UpdateSessionApiDto } from './dtos/update-session-api.dto';
import { Role } from 'src/domain/user/models/user.entity';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSessionCommand } from 'src/application/session/commands/create-session/create-session.command';
import { FindSessionsByMovieQuery } from 'src/application/session/queries/find-sessions-by-movie/find-sessions-by-movie.query';
import { FindSessionWithHallQuery } from 'src/application/session/queries/find-session-with-hall/find-session-with-hall.query';
import { UpdateSessionCommand } from 'src/application/session/commands/update-session/update-session.command';
import { DeleteSessionCommand } from 'src/application/session/commands/delete-session/delete-session.command';

@Controller('session')
export class SessionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  public async create(@Body() createSessionDto: CreateSessionApiDto) {
    const { startTime, finishTime, basePrice, movieId, hallId } = createSessionDto;
    return await this.commandBus.execute(
      new CreateSessionCommand(startTime, finishTime, basePrice, movieId, hallId)
    );
  }

  @Get()
  public async findByMovie(
    @Body() findSessionByMovieDto: FindSessionsByMovieApiDto,
  ) {
    const { movieId, dateOfSession } = findSessionByMovieDto;

    return await this.queryBus.execute(
      new FindSessionsByMovieQuery(movieId, dateOfSession)
    );
  }

  @Get("/:id")
  public async findById(
    @Param('id', new ParseUUIDPipe()) sessionId: string,
  ) {
    return await this.queryBus.execute(new FindSessionWithHallQuery(sessionId));
  }

  @Roles(Role.ADMIN)
  @Patch('/:id')
  public async update(
    @Param('id', new ParseUUIDPipe()) sessionId: string,
    @Body() updateSessionDto: UpdateSessionApiDto,
  ) {
    const { startTime, finishTime, basePrice } = updateSessionDto;

    return this.commandBus.execute(
      new UpdateSessionCommand(sessionId, startTime, finishTime, basePrice)
    );
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  public async remove(@Param('id', new ParseUUIDPipe()) sessionId: string) {
    return this.commandBus.execute(new DeleteSessionCommand(sessionId));
  }
}
