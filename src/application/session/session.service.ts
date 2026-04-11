import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dtos/request/create-session.dto';
import { Session } from 'src/domain/session/models/session.entity';
import { SessionInMovieDto } from './dtos/response/session-in-movie.dto';
import { FindSessionsByMovieDto } from './dtos/request/find-sessions-by-movie.dto';
import { toSessionsInMovieDto } from './dtos/mappers/to-sessions-in-movie';
import { UpdateSessionDto } from './dtos/request/update-session.dto';
import { TICKET_REPOSITORY_TOKEN, type TicketRepository } from 'src/domain/ticket/ports/ticket.repository';
import { toSessionWithHallDto } from './dtos/mappers/to-session-with-hall';
import { SessionWithHallDto } from './dtos/response/session-with-hall.dto';
import { SESSION_REPOSITORY_TOKEN, type SessionRepository } from 'src/domain/session/ports/session.repository';
import { HALL_REPOSITORY_TOKEN, type HallRepository } from 'src/domain/hall/ports/hall.repository';
import { SessionFactory } from 'src/domain/session/factories/session.factory';

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepo: SessionRepository,

    @Inject(HALL_REPOSITORY_TOKEN)
    private readonly hallRepo: HallRepository,

    @Inject(TICKET_REPOSITORY_TOKEN)
    private readonly ticketRepo: TicketRepository,

    private readonly sessionFactory: SessionFactory
  ) {}

  public async create(
    { startTime, finishTime, basePrice, movieId, hallId }: CreateSessionDto
  ): Promise<void> {
    const session = await this.sessionFactory.create({ 
      movieId, hallId, basePrice, startTime, endTime: finishTime 
    });
    
    await this.sessionRepo.save(session);
  }

  public async findSessionHallById(
    sessionId: string
  ): Promise<SessionWithHallDto> {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new NotFoundException('This session is not found');

    const hall = await this.hallRepo.findById(session.hallId);
    if (!hall) throw new NotFoundException('This hall is not found');

    const ticket = await this.ticketRepo.findBySession(sessionId);

    const dto = toSessionWithHallDto(session, hall, ticket);

    return dto;
  }

  public async findByMovie(
    { movieId, dateOfSession }: FindSessionsByMovieDto
  ): Promise<SessionInMovieDto[]> {
    const sessionsInDate = await this.sessionRepo.findByRentDate(movieId, dateOfSession);
    const halls = await this.hallRepo.findAll();

    const sessionIds = sessionsInDate.map(session => session.id);
    const tickets = await this.ticketRepo.findBySession(...sessionIds);

    const dto = toSessionsInMovieDto(sessionsInDate, halls, tickets);

    return dto;
  }

  public async update(
    { sessionId, startTime, finishTime, basePrice }: UpdateSessionDto
  ): Promise<void> {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new NotFoundException('This session is not found');

    session.setPrice(basePrice);
    session.changeTime(startTime, finishTime);

    await this.sessionRepo.save(session);
  }

  public async remove(sessionId: string): Promise<void> {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) throw new NotFoundException('This session is not found');

    session.checkDeleteCondition();

    await this.sessionRepo.delete(session);
  }
}
