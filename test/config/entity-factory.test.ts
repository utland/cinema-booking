import { INestApplication } from "@nestjs/common";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from 'supertest';
import { Repository } from "typeorm";
import { adminTest, hallTest, ITestPayload, movieTest, sessionTest, tokenName, userTest } from "./dtos.test";
import { TypeOrmUser } from "src/infrastructure/persistence/user/entities/typeorm-user.entity";
import { Role } from "src/domain/user/models/user.entity";
import { TypeOrmHall } from "src/infrastructure/persistence/hall/entities/typeorm-hall.entity";
import { TypeOrmSeat } from "src/infrastructure/persistence/hall/entities/typeorm-seat.entity";
import { CreateMovieApiDto } from "src/presentation/movie/dtos/create-movie-api.dto";
import { TypeOrmMovie } from "src/infrastructure/persistence/movie/entities/typeorm-movie.entity";
import { TypeOrmTicket } from "src/infrastructure/persistence/ticket/entities/typeorm-ticket.entity";
import { CreateSessionApiDto } from "src/presentation/session/dtos/create-session-api.dto";
import { TypeOrmSession } from "src/infrastructure/persistence/session/entities/typeorm-session.entity";
import { randomUUID } from "crypto";

export class EntityFactory {
    server: any;
    app: INestApplication;

    constructor(app: INestApplication, server: any) {
        this.server = server;
        this.app = app;
    }

    public async createUsers(): Promise<Map<tokenName, ITestPayload>> {
        const tokens = new Map<tokenName, ITestPayload>();

        await request(this.server).post("/user/sign-up").send(userTest).expect(201);
        await request(this.server).post("/user/sign-up").send(adminTest).expect(201);

        const userRepo = this.app.get<Repository<TypeOrmUser>>(getRepositoryToken(TypeOrmUser));

        await userRepo.update({ login: adminTest.login }, { role: Role.ADMIN });

        const userRes = await request(this.server).post("/user/sign-in").send(userTest).expect(201);
        const adminRes = await request(this.server).post("/user/sign-in").send(adminTest).expect(201);

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
        await request(this.server).post("/user/sign-up").send(userTest).expect(201);
        const userRes = await request(this.server).post("/user/sign-in").send(userTest).expect(201);

        const userRepo = this.app.get<Repository<TypeOrmUser>>(getRepositoryToken(TypeOrmUser));
        const user = await userRepo.findOneByOrFail({ login: userTest.login });

        return {
            token: userRes.body.accessToken,
            id: user.id,
            login: userTest.login
        };
    }

    public async createHall(): Promise<string> {
        const hallRepo = this.app.get<Repository<TypeOrmHall>>(getRepositoryToken(TypeOrmHall));
        const { id } = await hallRepo.save({ ...hallTest, id: randomUUID() });

        return id;
    }

    public async createSeats(hallId: string, count: number): Promise<string[]> {
        const seatRepo = this.app.get<Repository<TypeOrmSeat>>(getRepositoryToken(TypeOrmSeat));
        const seats: Partial<TypeOrmSeat>[] = [];

        for (let i = 1; i <= count; i++) {
            seats.push({ rowNumber: 1, columnNumber: i, hallId, id: randomUUID() });
        }

        const seatsOrm = await seatRepo.save(seats);

        return seatsOrm.map(seat => seat.id);
    }

    public async createMovie(customMovieTest?: Partial<CreateMovieApiDto>): Promise<string> {
        const movieRepo = this.app.get<Repository<TypeOrmMovie>>(getRepositoryToken(TypeOrmMovie));
        const { id } = await movieRepo.save({ ...movieTest, ...customMovieTest, id: randomUUID() });

        return id;
    }

    public async createSession(customSessionTest?: Partial<CreateSessionApiDto>): Promise<string> {
        const sessionRepo = this.app.get<Repository<TypeOrmSession>>(getRepositoryToken(TypeOrmSession));

        const { id } = await sessionRepo.save({ ...sessionTest, ...customSessionTest, id: randomUUID() });
        return id;
    }

    public async createTicket(sessionId: string, seatId: string, userId: string): Promise<string> {
        const ticketRepo = this.app.get<Repository<TypeOrmTicket>>(getRepositoryToken(TypeOrmTicket));
        const { id } = await ticketRepo.save({ sessionId, seatId, userId, price: 100, id: randomUUID(), createdAt: new Date() });

        return id;
    }
}