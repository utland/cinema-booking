import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SignUpDto } from "src/auth/dto/sign-up.dto";
import { Role } from "src/common/enums/role.enum";
import { Hall, HallType } from "src/hall/entities/hall.entity";
import { Seat } from "src/hall/entities/seat.entity";
import { Movie } from "src/movie/entities/movie.entity";
import { User } from "src/user/entities/user.entity";
import request from 'supertest';
import { Repository } from "typeorm";
import { adminTest, hallTest, ITestPayload, movieTest, sessionTest, tokenName, userTest } from "./dtos.test";
import { CreateMovieDto } from "src/movie/dto/create-movie.dto";
import { Session } from "src/session/entities/session.entity";
import { Ticket } from "src/ticket/entities/ticket.entity";
import { CreateSessionDto } from "src/session/dto/create-session.dto";

export class EntityFactory {
    server: any;
    app: INestApplication;

    constructor(app: INestApplication, server: any) {
        this.server = server;
        this.app = app;
    }

    public async createUsers(): Promise<Map<tokenName, ITestPayload>> {
        const tokens = new Map<tokenName, ITestPayload>();

        await request(this.server).post("/auth/register").send(userTest).expect(201);
        await request(this.server).post("/auth/register").send(adminTest).expect(201);

        const userRepo = this.app.get<Repository<User>>(getRepositoryToken(User));

        await userRepo.update({ login: adminTest.login }, { role: Role.ADMIN });

        const userRes = await request(this.server).post("/auth/login").send(userTest).expect(201);
        const adminRes = await request(this.server).post("/auth/login").send(adminTest).expect(201);

        const user = await userRepo.findOneByOrFail({ login: userTest.login });
        const admin = await userRepo.findOneByOrFail({ login: adminTest.login });

        tokens.set("user", {
            token: userRes.body.accessToken,
            id: user.id,
            login: userTest.login
        });

        tokens.set("admin", {
            token: adminRes.body.accessToken,
            id: admin.id,
            login: adminTest.login
        });
        
        return tokens;
    }

    public async createUser(): Promise<ITestPayload> {
        await request(this.server).post("/auth/register").send(userTest).expect(201);
        const userRes = await request(this.server).post("/auth/login").send(userTest).expect(201);

        const userRepo = this.app.get<Repository<User>>(getRepositoryToken(User));
        const user = await userRepo.findOneByOrFail({ login: userTest.login });

        return {
            token: userRes.body.accessToken,
            id: user.id,
            login: userTest.login
        };
    }

    public async createHall(): Promise<string> {
        const hallRepo = this.app.get<Repository<Hall>>(getRepositoryToken(Hall));
        const { id } = await hallRepo.save(hallTest);

        return id;
    }

    public async createSeats(hallId: string, count: number): Promise<string[]> {
        const seatRepo = this.app.get<Repository<Seat>>(getRepositoryToken(Seat));
        const seats: Partial<Seat>[] = [];

        for (let i = 1; i <= count; i++) {
            seats.push({ rowNumber: 1, seatNumber: i, hallId });
        }

        const seatsOrm = await seatRepo.save(seats);

        return seatsOrm.map(seat => seat.id);
    }

    public async createMovie(customMovieTest?: Partial<CreateMovieDto>): Promise<string> {
        const movieRepo = this.app.get<Repository<Movie>>(getRepositoryToken(Movie));
        const { id } = await movieRepo.save({ ...movieTest, ...customMovieTest });

        return id;
    }

    public async createSession(customSessionTest?: Partial<CreateSessionDto>): Promise<any> {
        const sessionRepo = this.app.get<Repository<Session>>(getRepositoryToken(Session));

        const { id } = await sessionRepo.save({ ...sessionTest, ...customSessionTest });
        return id;
    }

    public async createTicket(sessionId: string, seatId: string, userId: string): Promise<string> {
        const ticketRepo = this.app.get<Repository<Ticket>>(getRepositoryToken(Ticket));
        const { id } = await ticketRepo.save({ sessionId, seatId, userId, price: 100 });

        return id;
    }
}