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
import { SessionService } from 'src/application/session/session.service';
import { Roles } from '../common/decorators/role.decorator';
import { CreateSessionApiDto } from './dtos/create-session-api.dto';
import { FindSessionsByMovieApiDto } from './dtos/find-sessions-by-movie-api.dto';
import { UpdateSessionApiDto } from './dtos/update-session-api.dto';
import { Role } from 'src/domain/user/models/user.entity';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Roles(Role.ADMIN)
  @Post()
  public async create(@Body() createSessionDto: CreateSessionApiDto) {
    return await this.sessionService.create(createSessionDto);
  }

  @Get()
  public async findByMovie(
    @Body() findSessionByMovieDto: FindSessionsByMovieApiDto,
  ) {
    return await this.sessionService.findByMovie(findSessionByMovieDto);
  }

  @Get("/:id")
  public async findById(
    @Param('id', new ParseUUIDPipe()) sessionId: string,
  ) {
    return await this.sessionService.findSessionHallById(sessionId);
  }

  @Roles(Role.ADMIN)
  @Patch('/:id')
  public async update(
    @Param('id', new ParseUUIDPipe()) sessionId: string,
    @Body() updateSessionDto: UpdateSessionApiDto,
  ) {
    return this.sessionService.update({ ...updateSessionDto, sessionId });
  }

  @Roles(Role.ADMIN)
  @Delete('/:id')
  public async remove(@Param('id', new ParseUUIDPipe()) sessionId: string) {
    return this.sessionService.remove(sessionId);
  }
}
