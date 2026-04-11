import { CreateTicketDto } from "src/ticket/dto/create-ticket.dto";
import { TestBuilder } from "./config/builder.test";
import { ITestPayload, tokenName } from "./config/dtos.test";
import { EntityFactory } from "./config/entity-factory.test";
import request from "supertest";
import { UpdateTicketStatusDto } from "src/ticket/dto/update-status.dto";
import { TicketStatus } from "src/ticket/entities/ticket.entity";

describe("TicketModule (e2e)", () => {
    let builder: TestBuilder;
    let entityFactory: EntityFactory;
    let user: ITestPayload;
    let sessionId: string;
    let seatId: string;

    beforeAll(async () => {
        builder = await TestBuilder.create();
        entityFactory = new EntityFactory(builder.app, builder.app.getHttpServer());
        user = await entityFactory.createUser();

        const hallId = await entityFactory.createHall();
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
            const createTicketDto: CreateTicketDto = {
                sessionId,
                seatId
            };

            const res = await request(builder.app.getHttpServer())
                .post("/ticket")
                .send(createTicketDto)
                .set("Authorization", `Bearer ${user.token}`)
                .expect(201);

            expect(res.body.sessionId).toBe(createTicketDto.sessionId);
            expect(res.body.price).toBeDefined();
            expect(res.body.seatId).toBe(createTicketDto.seatId);
            expect(res.body.userId).toBe(user.id);
        });
    });

    describe("PATCH /ticket", () => {
        it("should update ticket status", async () => {
            const ticketId = await entityFactory.createTicket(sessionId, seatId, user.id);

            const updateTicketDto: UpdateTicketStatusDto = {
                status: TicketStatus.PAID,
                ticketId
            };

            await request(builder.app.getHttpServer())
                .patch("/ticket")
                .set("Authorization", `Bearer ${user.token}`)
                .send(updateTicketDto)
                .expect(200);
        });
    });

    describe("DELETE /ticket/:id", () => {
        it("should delete a ticket", async () => {
            const ticketId = await entityFactory.createTicket(sessionId, seatId, user.id);

            await request(builder.app.getHttpServer())
                .delete(`/ticket/${ticketId}`)
                .set("Authorization", `Bearer ${user.token}`)
                .expect(200);
        });
    });
});
