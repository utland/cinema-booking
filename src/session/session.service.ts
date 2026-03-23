import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { startOfDay, endOfDay } from 'date-fns';
import { HallService } from 'src/hall/hall.service';
import { Session } from './entities/session.entity';
import { FindSessionByMovieDto } from './dto/find-by-movie.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,

    private readonly hallService: HallService,
  ) {}

  public async create(createSessionDto: CreateSessionDto): Promise<Session> {
    return await this.sessionRepo.save(createSessionDto);
  }

  public async findSessionHallById(
    sessionId: string,
    hallId: string,
  ): Promise<Session> {
    const session = await this.findById(sessionId);

    const hall = await this.hallService.findForSession(hallId, sessionId);
    session.hall = hall;

    return session;
  }

  public async findById(sessionId: string): Promise<Session> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId },
    });
    if (!session) throw new NotFoundException('This session is not found');

    return session;
  }

  public async findByMovie(
    findByMovieDto: FindSessionByMovieDto,
  ): Promise<Session[]> {
    const { movieId, dateSession } = findByMovieDto;

    const from = startOfDay(dateSession);
    const to = endOfDay(dateSession);

    const sessions = await this.sessionRepo.find({
      where: { movieId, startTime: Between(from, to) },
      relations: ["hall", "hall.seats", "tickets"],
    });

    return sessions;
  }

  public async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<void> {
    const session = await this.checkSessionState(id);

    const updatedSession = Object.assign(session, updateSessionDto);
    await this.sessionRepo.save(updatedSession);
  }

  public async remove(id: string): Promise<void> {
    const session = await this.checkSessionState(id);
    await this.sessionRepo.remove(session);
  }

  public async checkSessionState(sessionId: string): Promise<Session> {
    const session = await this.findById(sessionId);
    const now = new Date();

    if (session.startTime < now && session.finishTime > now) {
      throw new ConflictException('You cannot modify a session that is streaming now');
    }

    return session;
  }
}
