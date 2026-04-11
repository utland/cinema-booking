import { UpdateUserApiDto } from "src/contexts/identity/presentation/dtos/update-user-api.dto";
import { TestBuilder } from "./config/builder.test";
import { ITestPayload, tokenName } from "./config/dtos.test";
import { EntityFactory } from "./config/entity-factory.test";
import request from "supertest";

describe("UserModule (e2e)", () => {
    let builder: TestBuilder;
    let entityFactory: EntityFactory;
    let tokens: Map<tokenName, ITestPayload>;
    let server: any;

    beforeAll(async () => {
        builder = await TestBuilder.create();
        server = builder.app.getHttpServer();

        entityFactory = new EntityFactory(builder.app, builder.app.getHttpServer());
        tokens = await entityFactory.createUsers();
    }, 15000);

    afterAll(async () => {
        await builder.closeApp();
    });

    afterEach(async () => {
        await builder.clearDb(["users"]);
    });

    describe("GET /user", () => {
        it("should return current user data", async () => {
            const movieId = await entityFactory.createMovie();

            const hallId = await entityFactory.createHall();

            const [seatId1, seatId2] = await entityFactory.createSeats(hallId, 2);

            const sessionsId1 = await entityFactory.createSession({ hallId, movieId });
            const sessionId2 = await entityFactory.createSession({
                hallId,
                movieId,
                startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                finishTime: new Date(Date.now() - 1 * 60 * 60 * 1000)
            });

            const ticketId1 = await entityFactory.createTicket(sessionsId1, seatId1, tokens.get("user")!.id);
            const ticketId2 = await entityFactory.createTicket(sessionId2, seatId2, tokens.get("user")!.id);

            const res = await request(server)
                .get("/user")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(200);

            console.log(res.body);

            expect(res.body.id).toBe(tokens.get("user")?.id);
            expect(res.body.login).toBe(tokens.get("user")?.login);
            expect(res.body.email).toBeDefined();
            expect(res.body.firstName).toBeDefined();
            expect(res.body.lastName).toBeDefined();
            expect(res.body.password).toBeUndefined();

            expect(Array.isArray(res.body.tickets)).toBe(true);
            expect(res.body.tickets.length).toBe(1);
            expect(res.body.tickets[0].ticketId).toBe(ticketId1);
            expect(res.body.tickets[0].movieTitle).toBeDefined();
            expect(res.body.tickets[0].showTime).toBeDefined();
            expect(res.body.tickets[0].row).toBeDefined();
            expect(res.body.tickets[0].column).toBeDefined();
        });
    });

    describe("PATCH /user", () => {
        it("should update current user data", async () => {
            const updateUserDto: UpdateUserApiDto = {
                firstName: "UpdatedName",
                lastName: "UpdatedLastName"
            };

            await request(server)
                .patch("/user")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .send(updateUserDto)
                .expect(200);

            const res = await request(server)
                .get("/user")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(200);

            expect(res.body.firstName).toBe(updateUserDto.firstName);
            expect(res.body.lastName).toBe(updateUserDto.lastName);
        });
    });

    describe("DELETE /user/:id", () => {
        it("should be available only for ADMIN", async () => {
            await request(server)
                .delete(`/user/${1}`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(403);
        });

        it("should delete an user", async () => {
            await request(server)
                .delete(`/user/${tokens.get("user")?.id}`)
                .set("Authorization", `Bearer ${tokens.get("admin")!.token}`)
                .expect(200);

            await request(server)
                .get("/user")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(404);
        });
    });
});
