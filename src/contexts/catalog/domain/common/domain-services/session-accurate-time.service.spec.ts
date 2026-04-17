import { Test, TestingModule } from "@nestjs/testing";
import { SessionAccurateTimeService } from "./session-accurate-time.service";
import { SESSION_REPOSITORY_TOKEN, SessionRepository } from "../../session/ports/session.repository";
import { Session } from "../../session/models/session.entity";
import { ConflictDomainException } from "src/common/domain/domain-exceptions/conflict.exception";
import { MOVIE_REPOSITORY_TOKEN, MovieRepository } from "../../movie/ports/movie.repository";
import { Movie } from "../../movie/models/movie.entity";

const mockSessionRepository = {
    findByHall: jest.fn()
};

const mockMovieRepository = {
    findById: jest.fn()
};

describe("SessionAccurateTimeService", () => {
    let service: SessionAccurateTimeService;
    let mockSessionRepo: jest.Mocked<SessionRepository>;
    let mockMovieRepo: jest.Mocked<MovieRepository>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SessionAccurateTimeService,
                {
                    provide: SESSION_REPOSITORY_TOKEN,
                    useValue: mockSessionRepository
                },
                {
                    provide: MOVIE_REPOSITORY_TOKEN,
                    useValue: mockMovieRepository
                }
            ]
        }).compile();

        service = module.get<SessionAccurateTimeService>(SessionAccurateTimeService);
        mockSessionRepo = module.get(SESSION_REPOSITORY_TOKEN);
        mockMovieRepo = module.get(MOVIE_REPOSITORY_TOKEN);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("checkTimeSlot", () => {
        it("should not throw when there is no overlapping session in the same hall", async () => {
            const existingSession = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-06-01T08:00:00Z"),
                new Date("2026-06-01T10:00:00Z"),
                new Date("2026-06-01T6:00:00Z"),
                "session-1"
            );

            const newSession = new Session(
                "movie-2",
                "hall-1",
                120,
                new Date("2026-06-01T10:00:00Z"),
                new Date("2026-06-01T12:00:00Z"),
                new Date("2026-06-01T6:00:00Z"),
                "session-2"
            );

            mockSessionRepo.findByHall.mockResolvedValue([existingSession]);

            await expect(service.checkTimeSlot("hall-1", newSession)).resolves.not.toThrow();
            expect(mockSessionRepo.findByHall).toHaveBeenCalledWith("hall-1");
        });

        it("should ignore the session itself when checking overlaps", async () => {
            const sameSession = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-06-01T08:00:00Z"),
                new Date("2026-06-01T10:00:00Z"),
                new Date("2026-06-01T6:00:00Z"),
                "session-1"
            );

            mockSessionRepo.findByHall.mockResolvedValue([sameSession]);

            await expect(service.checkTimeSlot("hall-1", sameSession)).resolves.not.toThrow();
        });

        it("should throw ConflictDomainException when an overlapping session exists", async () => {
            const overlappingSession = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-06-01T09:30:00Z"),
                new Date("2026-06-01T11:00:00Z"),
                new Date("2026-06-01T6:00:00Z"),
                "session-1"
            );

            const newSession = new Session(
                "movie-2",
                "hall-1",
                120,
                new Date("2026-06-01T10:00:00Z"),
                new Date("2026-06-01T12:00:00Z"),
                new Date("2026-06-01T6:00:00Z"),
                "session-2"
            );

            mockSessionRepo.findByHall.mockResolvedValue([overlappingSession]);

            await expect(service.checkTimeSlot("hall-1", newSession)).rejects.toThrow(ConflictDomainException);
            await expect(service.checkTimeSlot("hall-1", newSession)).rejects.toThrow("This time slot is occupied");
        });
    });

    describe("checkRentRange", () => {
        beforeEach(() => {
            const movie = new Movie(
                "test",
                120,
                "desc",
                "genre",
                new Date("2026-06-01T00:00:00Z"),
                new Date("2026-06-10T23:59:59Z"),
                "movie-1"
            );
            mockMovieRepo.findById.mockResolvedValue(movie);
        });

        it("should not throw when session time is inside the rent range", async () => {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-06-02T10:00:00Z"),
                new Date("2026-06-02T12:00:00Z"),
                new Date("2026-06-01T06:00:00Z"),
                "session-1"
            );

            await expect(service.checkRentRange("movie-1", session)).resolves.not.toThrow();
        });

        it("should throw ConflictException when session time is outside the rent range", async () => {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-06-02T10:00:00Z"),
                new Date("2026-06-02T12:00:00Z"),
                new Date("2026-05-01T06:00:00Z"),
                "session-1"
            );

            await expect(service.checkRentRange("movie-1", session)).rejects.toThrow(
                "Booking time should be after rent date"
            );
        });

        it("should throw ConflictException when session time is outside the rent range", async () => {
            const session = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-06-11T10:00:00Z"),
                new Date("2026-06-11T12:00:00Z"),
                new Date("2026-06-01T6:00:00Z"),
                "session-1"
            );

            await expect(service.checkRentRange("movie-1", session)).rejects.toThrow(
                "Session's time is out from rent date"
            );
        });
    });
});
