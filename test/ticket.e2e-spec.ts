import { CreateTicketReqDto } from "src/contexts/booking/presentation/dtos/create-ticket.request.dto";
import { TestBuilder } from "./config/builder.test";
import { ITestPayload } from "./config/dtos.test";
import { EntityFactory } from "./config/entity-factory.test";
import request from "supertest";

describe("TicketModule (e2e)", () => {
    let builder: TestBuilder;
    let entityFactory: EntityFactory;
    let server: any;

    let user: ITestPayload;
    let sessionId: string;
    let seatId: string;
    let hallId: string;

    beforeAll(async () => {
        builder = await TestBuilder.create();
        server = builder.app.getHttpServer();
        entityFactory = new EntityFactory(builder.app, server);

        user = await entityFactory.createUser();
        hallId = await entityFactory.createHall();
        const movieId = await entityFactory.createMovie();

        [seatId] = await entityFactory.createSeats(hallId, 1);
        sessionId = await entityFactory.createSession({ movieId, hallId });
    }, 15000);

    afterAll(async () => {
        await builder.closeApp();
    });

    afterEach(async () => {
        await builder.clearDb(["users", "sessions", "halls", "movies", "seats"]);
    });

    describe("POST /ticket", () => {
        it("should create a ticket", async () => {
            const createTicketDto: CreateTicketReqDto = {
                sessionId,
                seatId,
                hallId
            };

            const res = await request(server)
                .post("/ticket")
                .send(createTicketDto)
                .set("Authorization", `Bearer ${user.token}`)
                .expect((res) => {
                    console.log(res.body);
                })
                .expect(201);
        });
    });

    describe("PATCH /ticket/pay/:id", () => {
        it("should pay ticket", async () => {
            const start = performance.now();
            const ticketId = await entityFactory.createTicket(sessionId, seatId, user.id);

            await request(server)
                .patch(`/ticket/pay/${ticketId}`)
                .set("Authorization", `Bearer ${user.token}`)
                .expect(500);

            const end = performance.now();
            expect(end - start).toBeLessThan(10000);
        });
    });

    describe("PATCH /ticket", () => {
        it("should cancel ticket", async () => {
            const ticketId = await entityFactory.createTicket(sessionId, seatId, user.id);

            await request(server)
                .patch(`/ticket/cancel/${ticketId}`)
                .set("Authorization", `Bearer ${user.token}`)
                .expect(200);
        });
    });

    describe("DELETE /ticket/:id", () => {
        it("should delete a ticket", async () => {
            const ticketId = await entityFactory.createTicket(sessionId, seatId, user.id);

            await request(server)
                .delete(`/ticket/${ticketId}`)
                .set("Authorization", `Bearer ${user.token}`)
                .expect(200);
        });
    });
});
