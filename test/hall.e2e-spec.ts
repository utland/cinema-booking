import { TestBuilder } from "./config/builder.test";
import { EntityFactory } from "./config/entity-factory.test";
import request from "supertest";
import { ITestPayload, tokenName } from "./config/dtos.test";
import { CreateHallReqDto } from "src/contexts/catalog/presentation/hall/dtos/request/create-hall.request.dto";
import { HallType } from "src/contexts/catalog/domain/hall/models/hall.entity";
import { UpdateSeatsReqDto } from "src/contexts/catalog/presentation/hall/dtos/request/update-seats.request.dto";

describe("HallModule (e2e)", () => {
    let builder: TestBuilder;
    let entityFactory: EntityFactory;
    let tokens: Map<tokenName, ITestPayload>;
    let server: any;

    beforeAll(async () => {
        builder = await TestBuilder.create();
        await builder.clearDb();

        server = builder.app.getHttpServer();
        entityFactory = new EntityFactory(builder.app, server);
        tokens = await entityFactory.createUsers();
    }, 15000);

    afterEach(async () => {
        await builder.clearDb(["users"]);
    });

    afterAll(async () => {
        await builder.closeApp();
    });

    describe("POST /hall", () => {
        const createHallDto: CreateHallReqDto = {
            name: "Test Hall",
            seats: [
                { row: 1, column: 1 },
                { row: 1, column: 2 }
            ],
            type: HallType.STANDART
        };

        it("should be available only for ADMIN", async () => {
            await request(server)
                .post("/hall")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .send(createHallDto)
                .expect(403);
        });

        it("should create a new hall", async () => {
            await request(server)
                .post("/hall")
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .send(createHallDto)
                .expect(201);
        });
    });

    describe("GET /hall", () => {
        it("should return a list of halls", async () => {
            const res = await request(server)
                .get("/hall")
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe("GET /hall/:id", () => {
        it("should return hall data", async () => {
            const hallId = await entityFactory.createHall();

            const res = await request(server)
                .get(`/hall/${hallId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(200);

            expect(res.body.name).toBeDefined();
            expect(res.body.type).toBe(HallType.STANDART);
            expect(res.body.seats).toBeDefined();
        });
    });

    describe("PATCH /hall/:id", () => {
        const updateHallDto = {
            name: "Updated Hall",
            type: HallType.VIP
        };

        it("should be available only for ADMIN", async () => {
            await request(server)
                .patch(`/hall/${1}`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .send(updateHallDto)
                .expect(403);
        });

        it("should update a hall successfully", async () => {
            const hallId = await entityFactory.createHall();

            await request(server)
                .patch(`/hall/${hallId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .send(updateHallDto)
                .expect(200);

            const res = await request(server)
                .get(`/hall/${hallId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(200);

            expect(res.body.name).toBe(updateHallDto.name);
            expect(res.body.type).toBe(updateHallDto.type);
        });
    });

    describe("PATCH /hall/seats", () => {
        it("should be available only for ADMIN", async () => {
            await request(server)
                .patch(`/hall/seats`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .send({})
                .expect(403);
        });

        it("should update seats successfully", async () => {
            const hallId = await entityFactory.createHall();
            await entityFactory.createSeats(hallId, 3);

            const updateSeatsDto: UpdateSeatsReqDto = {
                hallId,
                seats: [
                    { row: 1, column: 1 },
                    { row: 1, column: 2 }
                ]
            };

            await request(server)
                .patch(`/hall/seats`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .send(updateSeatsDto)
                .expect(200);

            await request(server)
                .get(`/hall/${hallId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(200)
                .expect((res) => res.body.seats.length === 2);
        });
    });

    describe("DELETE /hall/:id", () => {
        it("should be available only for ADMIN", async () => {
            await request(server)
                .delete(`/hall/1`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(403);
        });

        it("should be available only for ADMIN", async () => {
            const hallId = await entityFactory.createHall();
            await entityFactory.createSeats(hallId, 3);

            await request(server)
                .delete(`/hall/${hallId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(200);

            await request(server)
                .get(`/hall/${hallId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(404);
        });
    });
});
