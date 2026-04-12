import { Test, TestingModule } from "@nestjs/testing";
import { SessionFactory } from "./session.factory";
import { HALL_REPOSITORY_TOKEN, HallRepository } from "src/domain/hall/ports/hall.repository";
import { MOVIE_REPOSITORY_TOKEN, MovieRepository } from "src/domain/movie/ports/movie.repository";
import { SessionAccurateTimeService } from "src/domain/common/domain-services/session-accurate-time.service";
import { Session } from "../models/session.entity";
import { NotFoundDomainException } from "src/domain/common/exceptions/not-found.exception";

const mockHallRepository = {
    findById: jest.fn()
};

const mockMovieRepository = {
    findById: jest.fn()
};

const mockSessionAccurateTimeService = {
    checkTimeSlot: jest.fn(),
    checkRentRange: jest.fn()
};

describe("SessionFactory", () => {
    let factory: SessionFactory;
    let mockHallRepo: jest.Mocked<HallRepository>;
    let mockMovieRepo: jest.Mocked<MovieRepository>;
    let mockTimeService: jest.Mocked<SessionAccurateTimeService>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SessionFactory,
                {
                    provide: HALL_REPOSITORY_TOKEN,
                    useValue: mockHallRepository
                },
                {
                    provide: MOVIE_REPOSITORY_TOKEN,
                    useValue: mockMovieRepository
                },
                {
                    provide: SessionAccurateTimeService,
                    useValue: mockSessionAccurateTimeService
                }
            ]
        }).compile();

        factory = module.get<SessionFactory>(SessionFactory);
        mockHallRepo = module.get(HALL_REPOSITORY_TOKEN);
        mockMovieRepo = module.get(MOVIE_REPOSITORY_TOKEN);
        mockTimeService = module.get(SessionAccurateTimeService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        const validMovie = {
            id: "movie-1",
            rentDate: {
                start: new Date("2026-06-01T00:00:00Z"),
                end: new Date("2026-06-30T23:59:59Z")
            }
        } as any;

        const validHall = {
            id: "hall-1"
        } as any;

        it("should create a session when hall and movie exist and business rules pass", async () => {
            mockHallRepo.findById.mockResolvedValue(validHall);
            mockMovieRepo.findById.mockResolvedValue(validMovie);
            mockTimeService.checkTimeSlot.mockResolvedValue(undefined);
            mockTimeService.checkRentRange.mockResolvedValue(undefined);

            const startTime = new Date("2026-06-10T10:00:00Z");
            const endTime = new Date("2026-06-10T12:00:00Z");

            const result = await factory.create({
                movieId: "movie-1",
                hallId: "hall-1",
                basePrice: 120,
                startTime,
                endTime
            });

            expect(result).toBeInstanceOf(Session);
            expect(result.movieId).toBe("movie-1");
            expect(result.hallId).toBe("hall-1");
            expect(result.basePrice).toBe(120);
            expect(result.timePeriod.startTime).toEqual(startTime);
            expect(result.timePeriod.endTime).toEqual(endTime);

            expect(mockHallRepo.findById).toHaveBeenCalledWith("hall-1");
            expect(mockMovieRepo.findById).toHaveBeenCalledWith("movie-1");
            expect(mockTimeService.checkTimeSlot).toHaveBeenCalledWith("hall-1", expect.any(Session));
            expect(mockTimeService.checkRentRange).toHaveBeenCalledWith(
                validMovie.rentDate.start,
                validMovie.rentDate.end,
                expect.any(Session)
            );
        });

        it("should throw NotFoundDomainException when hall does not exist", async () => {
            mockHallRepo.findById.mockResolvedValue(null);
            mockMovieRepo.findById.mockResolvedValue(validMovie);

            await expect(
                factory.create({
                    movieId: "movie-1",
                    hallId: "hall-1",
                    basePrice: 120,
                    startTime: new Date("2026-06-10T10:00:00Z"),
                    endTime: new Date("2026-06-10T12:00:00Z")
                })
            ).rejects.toThrow(NotFoundDomainException);
        });

        it("should throw NotFoundDomainException when movie does not exist", async () => {
            mockHallRepo.findById.mockResolvedValue(validHall);
            mockMovieRepo.findById.mockResolvedValue(null);

            await expect(
                factory.create({
                    movieId: "movie-1",
                    hallId: "hall-1",
                    basePrice: 120,
                    startTime: new Date("2026-06-10T10:00:00Z"),
                    endTime: new Date("2026-06-10T12:00:00Z")
                })
            ).rejects.toThrow(NotFoundDomainException);
        });

        it("should propagate service errors from checkTimeSlot and checkRentRange", async () => {
            mockHallRepo.findById.mockResolvedValue(validHall);
            mockMovieRepo.findById.mockResolvedValue(validMovie);
            mockTimeService.checkTimeSlot.mockRejectedValue(new Error("occupied"));

            await expect(
                factory.create({
                    movieId: "movie-1",
                    hallId: "hall-1",
                    basePrice: 120,
                    startTime: new Date("2026-06-10T10:00:00Z"),
                    endTime: new Date("2026-06-10T12:00:00Z")
                })
            ).rejects.toThrow("occupied");
        });
    });
});
