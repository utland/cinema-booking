import { CreateSessionReqDto } from "src/contexts/catalog/presentation/session/dtos/request/create-session.request.dto";
import { TestBuilder } from "./config/builder.test";
import { ITestPayload, sessionTest, tokenName } from "./config/dtos.test";
import { EntityFactory } from "./config/entity-factory.test";
import request from "supertest";
import { FindSessionsByMovieReqDto } from "src/contexts/catalog/presentation/session/dtos/request/find-sessions-by-movie.request.dto";
import { UpdateSessionReqDto } from "src/contexts/catalog/presentation/session/dtos/request/update-session.request.dto";

describe("SessionModule (e2e)", () => {
    let builder: TestBuilder;
    let entityFactory: EntityFactory;
    let tokens: Map<tokenName, ITestPayload>;
    let server: any;
    let hallId: string;
    let movieId: string;
    let createSessionDto: CreateSessionReqDto;

    beforeAll(async () => {
        builder = await TestBuilder.create();
        await builder.clearDb();

        server = builder.app.getHttpServer();

        entityFactory = new EntityFactory(builder.app, server);
        tokens = await entityFactory.createUsers();

        hallId = await entityFactory.createHall();
        movieId = await entityFactory.createMovie({
            rentStart: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            rentEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        createSessionDto = { ...sessionTest, hallId, movieId };
    }, 20000);

    afterEach(async () => {
        await builder.clearDb(["users", "halls", "movies"]);
    });

    afterAll(async () => {
        await builder.closeApp();
    });

    describe("POST /session", () => {
        it("should be available only for ADMIN", async () => {
            await request(server)
                .post("/session")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(403);
        });

        it("should create a new session", async () => {
            await request(server)
                .post("/session")
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .send(createSessionDto)
                .expect(201);
        });
    });

    describe("GET /session/:id", () => {
        it("should return session with hall information", async () => {
            const sessionId = await entityFactory.createSession(createSessionDto);

            const [seatId1] = await entityFactory.createSeats(hallId, 3);
            await entityFactory.createTicket(sessionId, seatId1, tokens.get("user")!.id);

            const res = await request(server)
                .get(`/session/${sessionId}`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(200);

            expect(res.body.sessionId).toBeDefined();
            expect(res.body.hallId).toBe(createSessionDto.hallId);
            expect(res.body.hallName).toBeDefined();
            expect(res.body.startTime).toBe(createSessionDto.startTime.toISOString());
            expect(res.body.endTime).toBe(createSessionDto.finishTime.toISOString());

            expect(res.body.seats).toBeDefined();
            expect(Array.isArray(res.body.seats)).toBe(true);
            expect(res.body.seats.length).toBe(3);

            expect(res.body.seats[0]).toBeDefined();
            expect(res.body.seats[0].seatId).toBeDefined();
            expect(res.body.seats[0].row).toBeDefined();
            expect(res.body.seats[0].column).toBeDefined();
            expect(res.body.seats[0].isAvailable).toBe(false);
        });
    });

    describe("GET /session", () => {
        it("should return sessions by movie", async () => {
            const findDto: FindSessionsByMovieReqDto = {
                movieId,
                dateOfSession: new Date()
            };

            const sessionId = await entityFactory.createSession({
                movieId,
                hallId,
                startTime: new Date(),
                finishTime: new Date(Date.now() + 2 * 60 * 60 * 1000)
            });

            const sessionId2 = await entityFactory.createSession({
                movieId,
                hallId,
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
                finishTime: new Date(Date.now() + 26 * 60 * 60 * 1000)
            });

            const [seatId1, seatId2, seatId3] = await entityFactory.createSeats(hallId, 5);
            await entityFactory.createTicket(sessionId, seatId1, tokens.get("user")!.id);
            await entityFactory.createTicket(sessionId, seatId2, tokens.get("user")!.id);
            await entityFactory.createTicket(sessionId, seatId3, tokens.get("user")!.id);

            const res = await request(server)
                .get(`/session?movieId=${findDto.movieId}&dateOfSession=${findDto.dateOfSession.toISOString()}`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0].sessionId).toBeDefined();
            expect(res.body[0].hallName).toBeDefined();
            expect(res.body[0].startTime).toBeDefined();
            expect(res.body[0].endTime).toBeDefined();
            expect(res.body[0].availableSeats).toBe(2);
            expect(res.body[0].totalSeats).toBe(5);
        });
    });

    describe("PATCH /session/:id", () => {
        const updateSessionDto: UpdateSessionReqDto = {
            startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
            finishTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
            basePrice: 100,
            bookingTime: new Date(Date.now() + 60 * 60 * 1000)
        };

        it("should be available only for ADMIN", async () => {
            await request(server)
                .patch("/session/1")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(403);
        });

        it("should update a session", async () => {
            const sessionId = await entityFactory.createSession({
                movieId,
                hallId,
                startTime: new Date(Date.now() + 60 * 60 * 1000),
                finishTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
                bookingTime: new Date(Date.now() + 30 * 60 * 1000)
            });

            await request(builder.app.getHttpServer())
                .patch(`/session/${sessionId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .send(updateSessionDto)
                .expect(200);

            await request(builder.app.getHttpServer())
                .get(`/session/${sessionId}`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(200);
        });
    });

    describe("DELETE /session/:id", () => {
        it("should be available only for ADMIN", async () => {
            await request(server)
                .delete("/session/1")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(403);
        });

        it("should delete a session", async () => {
            const sessionId = await entityFactory.createSession({
                movieId,
                hallId,
                startTime: new Date(Date.now() + 60 * 60 * 1000),
                finishTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
                bookingTime: new Date(Date.now() + 30 * 60 * 1000)
            });

            await request(builder.app.getHttpServer())
                .delete(`/session/${sessionId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(200);

            await request(builder.app.getHttpServer())
                .get(`/session/${sessionId}`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(404);
        });
    });
});
