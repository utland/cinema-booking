import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Between, In, LessThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { startOfDay, endOfDay, areIntervalsOverlapping } from "date-fns";
import { HallService } from "src/hall/hall.service";
import { Session } from "./entities/session.entity";
import { FindSessionByMovieDto } from "./dto/find-by-movie.dto";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { MovieService } from "src/movie/movie.service";
import { Movie } from "src/movie/entities/movie.entity";

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepo: Repository<Session>,

        private readonly hallService: HallService,

        private readonly movieService: MovieService
    ) {}

    public async create(createSessionDto: CreateSessionDto): Promise<Session> {
        const { startTime, finishTime, hallId, movieId } = createSessionDto;

        this.validateTime(startTime, finishTime);

        await this.hallService.findById(hallId);
        const movie = await this.movieService.findById(movieId);

        await this.checkIsOccupied(hallId, startTime, finishTime);
        this.checkIsInMovieRange(movie, startTime, finishTime);

        return await this.sessionRepo.save(createSessionDto);
    }

    public async findSessionHallById(sessionId: string, hallId: string): Promise<Session> {
        const session = await this.findById(sessionId);

        const hall = await this.hallService.findForSession(hallId, sessionId);
        session.hall = hall;

        return session;
    }

    public async findById(sessionId: string): Promise<Session> {
        const session = await this.sessionRepo.findOne({
            where: { id: sessionId }
        });
        if (!session) throw new NotFoundException("This session is not found");

        return session;
    }

    public async findByMovie(findByMovieDto: FindSessionByMovieDto): Promise<Session[]> {
        const { movieId, dateSession } = findByMovieDto;

        const from = startOfDay(dateSession);
        const to = endOfDay(dateSession);

        const sessions = await this.sessionRepo.find({
            where: { movieId, startTime: Between(from, to) },
            relations: ["hall", "hall.seats", "tickets"]
        });

        return sessions;
    }

    public async update(id: string, updateSessionDto: UpdateSessionDto): Promise<void> {
        const { startTime, finishTime, hallId } = updateSessionDto;
        this.validateTime(startTime, finishTime);

        const session = await this.checkSessionState(id);

        await this.checkIsOccupied(hallId, startTime, finishTime, id);

        const movie = await this.movieService.findById(session.movieId);
        this.checkIsInMovieRange(movie, startTime, finishTime);

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
            throw new ConflictException("You cannot modify a session that is streaming now");
        }

        return session;
    }

    private async checkIsOccupied(hallId: string, start: Date, end: Date, sessionId?: string): Promise<void> {
        const sessions = await this.sessionRepo.find({ where: { hallId } });
        const isOccupied = sessions.some((item) => {
            if (sessionId && sessionId === item.id) return false;

            return areIntervalsOverlapping({ start: item.startTime, end: item.finishTime }, { start, end });
        });

        if (isOccupied) {
            throw new ConflictException("This time range is occupied in this hall");
        }
    }

    private checkIsInMovieRange(movie: Movie, start: Date, end: Date) {
        const isInRange = areIntervalsOverlapping({ start: movie.rentStart, end: movie.rentEnd }, { start, end });

        if (!isInRange) {
            throw new ConflictException("Session's time is out from rent date");
        }
    }

    private validateTime(start: Date, end: Date) {
        if (start > end) {
            throw new BadRequestException("End time must be greater than start time for session");
        }
    }
}
