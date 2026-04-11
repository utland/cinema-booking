import { HallType } from "src/hall/entities/hall.entity";
import { TestBuilder } from "./config/builder.test";
import { EntityFactory } from "./config/entity-factory.test";
import request from "supertest";
import { DeleteSeatsDto } from "src/hall/dto/delete-seats.dto";
import { UpdateSeatsDto } from "src/hall/dto/update-seat.dto";
import { Seat } from "src/hall/entities/seat.entity";
import { ITestPayload, tokenName } from "./config/dtos.test";

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
        const createHallDto = {
            name: "Test Hall",
            seats: [
                { rowNumber: 1, seatNumber: 1 },
                { rowNumber: 1, seatNumber: 2 }
            ]
        };

        it("should be available only for ADMIN", async () => {
            await request(server)
                .post("/hall")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .send(createHallDto)
                .expect(403);
        });

        it("should create a new hall", async () => {
            const res = await request(server)
                .post("/hall")
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .send(createHallDto)
                .expect(201);

            expect(res.body.name).toBe(createHallDto.name);
            expect(res.body.id).toBeDefined();
            expect(res.body.type).toBe(HallType.STANDART);

            await request(server)
                .get(`/hall/${res.body.id}`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(200);
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
            expect(res.body.id).toBeDefined();
            expect(res.body.type).toBe(HallType.STANDART);
            expect(res.body.seats).toBeDefined();
        });
    });

    describe("PATCH /hall/:id", () => {
        const updateHallDto = { name: "Updated Hall", type: HallType.VIP };

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
            const seatIds = await entityFactory.createSeats(hallId, 3);

            const updateSeatsDto: UpdateSeatsDto = {
                hallId,
                seats: [
                    { id: seatIds[0], isAvailable: false },
                    { id: seatIds[1], isAvailable: false }
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
                .expect((res) => {
                    res.body.seats.forEach((seat: Seat) => {
                        if (seat.id === seatIds[0] || seat.id === seatIds[1]) {
                            expect(seat.IsAvailable).toBe(false);
                        } else {
                            expect(seat.IsAvailable).toBe(true);
                        }
                    });
                });
        });
    });

    describe("DELETE /hall/seats", () => {
        it("should be available only for ADMIN", async () => {
            await request(server)
                .delete(`/hall/seats`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .send({})
                .expect(403);
        });

        it("should update seats successfully", async () => {
            const hallId = await entityFactory.createHall();
            const seatIds = await entityFactory.createSeats(hallId, 3);

            const deleteSeatsDto: DeleteSeatsDto = {
                hallId,
                seatsId: [seatIds[0], seatIds[1]]
            };

            await request(server)
                .delete(`/hall/seats`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .send(deleteSeatsDto)
                .expect(200);

            const res = await request(server)
                .get(`/hall/${hallId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(200);

            expect(res.body.seats.length).toBe(1);
            expect(res.body.seats[0].id).toBe(seatIds[2]);
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
