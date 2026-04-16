import { CreateUserApiDto } from "src/contexts/identity/presentation/dtos/request/create-user.request.dto";
import { TestBuilder } from "./config/builder.test";
import request from "supertest";

const testSignUp: CreateUserApiDto = {
    email: "test@email.com",
    password: "0000",
    login: "user",
    firstName: "test",
    lastName: "test"
};

describe("AuthModule (e2e)", () => {
    let builder: TestBuilder;
    let server: any;

    beforeAll(async () => {
        builder = await TestBuilder.create();
        server = builder.app.getHttpServer();
    });

    afterEach(async () => {
        await builder.clearDb();
    });

    it("should require authentication for protected routes", async () => {
        const res = await request(server).get("/movie");
        expect(res.status).toBe(401);
    });

    it("should sign up a new user", async () => {
        const res = await request(server).post("/user/sign-up").send(testSignUp);

        expect(res.status).toBe(201);
    });

    it("should sign in an existing user", async () => {
        await request(server).post("/user/sign-up").send(testSignUp);

        const res = await request(server).post("/user/sign-in").send({
            login: testSignUp.login,
            password: testSignUp.password
        });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("accessToken");
    }, 10000);

    afterAll(async () => {
        await builder.closeApp();
    });
});
