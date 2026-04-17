import { BadRequestDomainException } from "src/common/domain/domain-exceptions/bad-request.exception";
import { Session } from "./session.entity";
import { TimePeriod } from "./time-period";

describe("Session", () => {
    it("should throw DomainException when start time is after end time", () => {
        try {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-03-31T12:00:00Z"),
                new Date("2026-03-31T10:00:00Z"),
                new Date("2026-03-31T8:00:00Z")
            );
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("End time must be greater than start time for session");
        }
    });

    it("should throw DomainException when booking time is after start time", () => {
        try {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-03-31T10:00:00Z"),
                new Date("2026-03-31T12:00:00Z"),
                new Date("2026-03-31T11:00:00Z")
            );
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("Booking time must be before session start time");
        }
    });

    it("should throw DomainException when changing to invalid time period", () => {
        try {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-03-31T8:00:00Z"),
                new Date("2026-03-31T10:00:00Z"),
                new Date("2026-03-31T7:00:00Z")
            );

            session.changeTime(
                new Date("2026-04-01T12:00:00Z"),
                new Date("2026-04-01T10:00:00Z"),
                new Date("2026-04-01T9:00:00Z")
            );
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("End time must be greater than start time for session");
        }
    });

    it("should throw DomainException when trying to change bookingTime to incorrect value", () => {
        try {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date(Date.now() - 60 * 60),
                new Date(Date.now() + 60 * 60),
                new Date(Date.now() - 2 * 60 * 60)
            );

            session.changeTime(
                new Date(Date.now() - 60 * 60),
                new Date(Date.now() + 60 * 60),
                new Date(Date.now() + 60 * 60)
            );
        } catch (err: any) {
            expect(err).toBeInstanceOf(BadRequestDomainException);
            expect(err.message).toBe("Booking time must be before session start time");
        }
    });

    it("should return correct value in when session is active", () => {
        const session = new Session(
            "movie-1",
            "hall-1",
            100,
            new Date(Date.now() - 60 * 60),
            new Date(Date.now() + 60 * 60),
            new Date(Date.now() - 2 * 60 * 60)
        );

        expect(session.isActive()).toBe(true);
    });

    it("should return correct value in when session is not active", () => {
        const session = new Session(
            "movie-1",
            "hall-1",
            100,
            new Date(Date.now() - 60 * 60),
            new Date(Date.now() - 30 * 60),
            new Date(Date.now() - 2 * 60 * 60)
        );

        expect(session.isActive()).toBe(false);
    });

    it("should return correct value in time-period function", () => {
        const time = new TimePeriod(new Date(Date.now()), new Date(Date.now() + 2 * 60 * 60));

        expect(time.isInRange(new Date(Date.now() + 60 * 60))).toBe(true);
        expect(time.isOverlapped(new Date(Date.now() - 60 * 60), new Date(Date.now() + 60 * 60))).toBe(true);
        expect(time.isTimePeriodInside(new Date(Date.now() - 60 * 60), new Date(Date.now() + 3 * 60 * 60))).toBe(true);
    });
});
