import { randomUUID } from "crypto";
import { ServiceFetch } from "./common/service-fetch";

describe('Booking E2E Tests', () => {
    let booking: ServiceFetch;
    let identity: ServiceFetch

    beforeAll(() => {
        booking = new ServiceFetch("http://test-booking:3001");
        identity = new ServiceFetch("http://test-identity:3002");
    })

    it("shoulde require authentication", async () => {
        const response = await booking.post("/");

        expect(response.status).toBe(401);
    })

    it("should throw Not Found Exception", async () => {
        await identity.post("/sign-up", {
            body: {
                email: "user@example.com",
                password: "password",
                login: "user",
                firstName: "John",
                lastName: "Doe"
            }
        });
        
        const loginReponse = await identity.post("/sign-in", {
            body: {
                password: "password",
                login: "user"
            }
        });

        const { accessToken } = loginReponse.body;
        
        const randomId = randomUUID();
        const response = await booking.post("/", {
            token: accessToken,
            body: {
                sessionId: randomId,
                seatId: randomId,
                hallId: randomId
            }
        });


        expect(response.status).toBe(404);
    }, 10000);
})