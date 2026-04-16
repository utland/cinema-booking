import { UpdateMovieReqDto } from "src/contexts/catalog/presentation/movie/dtos/request/update-movie.request.dto";
import { TestBuilder } from "./config/builder.test";
import { ITestPayload, movieTest, tokenName } from "./config/dtos.test";
import { EntityFactory } from "./config/entity-factory.test";
import request from "supertest";

describe("MovieModule (e2e)", () => {
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

    describe("POST /movie", () => {
        it("should be available only for ADMIN", async () => {
            await request(server)
                .post("/movie")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .send(movieTest)
                .expect(403);
        });

        it("should create movie", async () => {
            const res = await request(server)
                .post("/movie")
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .send(movieTest)
                .expect(201);
        });
    });

    describe("GET /movie/all", () => {
        it("should be available only for ADMIN", async () => {
            await request(server)
                .post("/movie")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(403);
        });

        it("should return all movies", async () => {
            await entityFactory.createMovie();
            await entityFactory.createMovie();

            const res = await request(server)
                .get("/movie/all")
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(2);
        });
    });

    describe("GET /movie", () => {
        it("should return movies by rent date", async () => {
            await entityFactory.createMovie({
                rentStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                rentEnd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
            });

            await entityFactory.createMovie({
                rentStart: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                rentEnd: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            });

            const res = await request(server)
                .get("/movie")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
        });
    });

    describe("GET /movie/:id", () => {
        it("should return movie data", async () => {
            const movieId = await entityFactory.createMovie();

            const hallId = await entityFactory.createHall();

            await entityFactory.createSession({ movieId: movieId, hallId });
            await entityFactory.createSession({ movieId: movieId, hallId });

            const res = await request(builder.app.getHttpServer())
                .get(`/movie/${movieId}`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(200);

            expect(res.body.title).toBeDefined();
            expect(res.body.description).toBeDefined;
            expect(res.body.duration).toBeDefined();
            expect(res.body.genre).toBeDefined();
            expect(res.body.photoUrl).toBeDefined();
            expect(res.body.rentStart).toBeDefined();
            expect(res.body.rentEnd).toBeDefined();
        });
    });

    describe("PATCH /movie/:id", () => {
        const updateMovieDto = { title: "Updated Movie" };

        it("should be available only for ADMIN", async () => {
            await request(server)
                .patch("/movie/1")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .send(updateMovieDto)
                .expect(403);
        });

        it("should update movie", async () => {
            const updateMovieDto: UpdateMovieReqDto = {
                title: "Updated Movie",
                description: "Updated Description",
                duration: 150,
                genre: "Updated Genre",
                rentStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                rentEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            };

            const movieId = await entityFactory.createMovie();

            await request(server)
                .patch(`/movie/${movieId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .send(updateMovieDto)
                .expect(200);

            const res = await request(server)
                .get(`/movie/${movieId}`)
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(200);

            expect(res.body.title).toBe(updateMovieDto.title);
            expect(res.body.description).toBe(updateMovieDto.description);
            expect(res.body.duration).toBe(updateMovieDto.duration);
        });
    });

    describe("DELETE /movie/:id", () => {
        it("should be available only for ADMIN", async () => {
            await request(server)
                .delete("/movie/1")
                .set("Authorization", `Bearer ${tokens.get("user")?.token}`)
                .expect(403);
        });

        it("should delete movie", async () => {
            const movieId = await entityFactory.createMovie();

            await request(server)
                .delete(`/movie/${movieId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(200);

            await request(server)
                .get(`/movie/${movieId}`)
                .set("Authorization", `Bearer ${tokens.get("admin")?.token}`)
                .expect(404);
        });
    });
});
