import { BadRequestDomainException } from "src/common/domain/domain-exceptions/bad-request.exception";
import { Session } from "./session.entity";

describe("Session", () => {
    it("should throw DomainException when start time is after end time", () => {
        try {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-03-31T12:00:00Z"),
                new Date("2026-03-31T10:00:00Z")
            );
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("End time must be greater than start time for session");
        }
    });

    it("should throw DomainException when trying to set price during ongoing session", () => {
        try {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date(Date.now() - 60 * 60),
                new Date(Date.now() + 60 * 60)
            );

            session.setPrice(150);
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("This session is closed for modification");
        }
    });

    it("should throw DomainException when trying to change time during ongoing session", () => {
        try {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date(Date.now() - 60 * 60),
                new Date(Date.now() + 60 * 60)
            );

            session.changeTime(new Date("2026-04-01T10:00:00Z"), new Date("2026-04-01T12:00:00Z"));
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("This session is closed for modification");
        }
    });

    it("should throw DomainException when changing to invalid time period", () => {
        try {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-03-31T8:00:00Z"),
                new Date("2026-03-31T10:00:00Z")
            );

            session.changeTime(new Date("2026-04-01T12:00:00Z"), new Date("2026-04-01T10:00:00Z"));
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("End time must be greater than start time for session");
        }
    });

    it("should throw DomainException when trying to delete ongoing session", () => {
        try {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date(Date.now() - 60 * 60),
                new Date(Date.now() + 60 * 60)
            );

            session.checkDeleteCondition();
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("Session cannot be deleted, during streaming");
        }
    });
});
