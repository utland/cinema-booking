import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";
import { SessionService } from "./session.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Session } from "./entities/session.entity";
import { HallService } from "src/hall/hall.service";
import { MovieService } from "src/movie/movie.service";

describe("SessionService", () => {
    let service: SessionService;
    let sessionRepo: any;

    const mockSessionRepo = {
        findOne: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
        remove: jest.fn()
    };

    const mockHallService = {
        findById: jest.fn(),
        findForSession: jest.fn()
    };

    const mockMovieService = {
        findById: jest.fn()
    };

    beforeEach(async () => {
        Object.values(mockSessionRepo).forEach((fn) => fn.mockReset());
        Object.values(mockHallService).forEach((fn) => fn.mockReset());
        Object.values(mockMovieService).forEach((fn) => fn.mockReset());

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SessionService,
                {
                    provide: getRepositoryToken(Session),
                    useValue: mockSessionRepo
                },
                {
                    provide: HallService,
                    useValue: mockHallService
                },
                {
                    provide: MovieService,
                    useValue: mockMovieService
                }
            ]
        }).compile();

        service = module.get<SessionService>(SessionService);
        sessionRepo = module.get(getRepositoryToken(Session));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should create a new session when hall and movie are valid and time is free", async () => {
            const sessionDto = {
                hallId: "hall-1",
                movieId: "movie-1",
                startTime: new Date("2026-06-01T08:00:00.000Z"),
                finishTime: new Date("2026-07-01T10:00:00.000Z")
            } as any;

            mockHallService.findById.mockResolvedValue({ id: "hall-1" });
            mockMovieService.findById.mockResolvedValue({
                id: "movie-1",
                rentStart: new Date("2026-06-02T00:00:00.000Z"),
                rentEnd: new Date("2026-06-05T00:00:00.000Z")
            });
            mockSessionRepo.find.mockResolvedValue([]);
            mockSessionRepo.save.mockResolvedValue(sessionDto);

            await expect(service.create(sessionDto)).resolves.toEqual(sessionDto);
            expect(mockSessionRepo.find).toHaveBeenCalledWith({ where: { hallId: "hall-1" } });
            expect(mockSessionRepo.save).toHaveBeenCalledWith(sessionDto);
        });

        it("should throw BadRequestException when finishTime is before startTime", async () => {
            const sessionDto = {
                hallId: "hall-1",
                movieId: "movie-1",
                startTime: new Date("2026-06-01T12:00:00.000Z"),
                finishTime: new Date("2026-06-01T10:00:00.000Z")
            } as any;

            await expect(service.create(sessionDto)).rejects.toThrow(BadRequestException);
            expect(mockSessionRepo.find).not.toHaveBeenCalled();
        });

        it("should throw ConflictException when hall is already occupied", async () => {
            const sessionDto = {
                hallId: "hall-1",
                movieId: "movie-1",
                startTime: new Date("2026-06-01T08:00:00.000Z"),
                finishTime: new Date("2026-06-30T10:00:00.000Z")
            } as any;

            mockHallService.findById.mockResolvedValue({ id: "hall-1" });
            mockMovieService.findById.mockResolvedValue({
                id: "movie-1",
                rentStart: new Date("2026-06-02T00:00:00.000Z"),
                rentEnd: new Date("2026-07-05T00:00:00.000Z")
            });
            mockSessionRepo.find.mockResolvedValue([
                {
                    startTime: new Date("2026-06-01T09:00:00.000Z"),
                    finishTime: new Date("2026-06-01T11:00:00.000Z")
                }
            ]);

            await expect(service.create(sessionDto)).rejects.toThrow(ConflictException);
            expect(mockSessionRepo.save).not.toHaveBeenCalled();
        });

        it("should throw ConflictException when movie's rent time doesn't overlap session interval", async () => {
            const sessionDto = {
                hallId: "hall-1",
                movieId: "movie-1",
                startTime: new Date("2026-06-03T08:00:00.000Z"),
                finishTime: new Date("2026-06-03T10:00:00.000Z")
            } as any;

            mockHallService.findById.mockResolvedValue({ id: "hall-1" });
            mockMovieService.findById.mockResolvedValue({
                id: "movie-1",
                rentStart: new Date("2026-06-04T00:00:00.000Z"),
                rentEnd: new Date("2026-06-05T00:00:00.000Z")
            });
            mockSessionRepo.find.mockResolvedValue([]);

            await expect(service.create(sessionDto)).rejects.toThrow(ConflictException);
            expect(mockSessionRepo.save).not.toHaveBeenCalled();
        });
    });

    describe("update", () => {
        it("should update session when all validations pass", async () => {
            const updateDto = {
                hallId: "hall-1",
                startTime: new Date("2026-06-01T08:00:00.000Z"),
                finishTime: new Date("2026-06-01T10:00:00.000Z")
            } as any;
            const existingSession = {
                id: "session-1",
                movieId: "movie-1",
                hallId: "hall-1",
                startTime: new Date("2026-05-30T08:00:00.000Z"),
                finishTime: new Date("2026-05-30T10:00:00.000Z")
            } as any;
            const movieData = {
                id: "movie-1",
                rentStart: new Date("2026-04-20T00:00:00.000Z"),
                rentEnd: new Date("2026-07-25T00:00:00.000Z")
            } as any;

            mockSessionRepo.findOne.mockResolvedValue(existingSession);
            mockSessionRepo.find.mockResolvedValue([]);
            mockMovieService.findById.mockResolvedValue(movieData);
            mockSessionRepo.save.mockResolvedValue({ ...existingSession, ...updateDto });

            await expect(service.update("session-1", updateDto)).resolves.toBeUndefined();
            expect(mockSessionRepo.save).toHaveBeenCalledWith({ ...existingSession, ...updateDto });
        });

        it("should throw ConflictException when session is currently streaming", async () => {
            const now = new Date();
            const updateDto = {
                hallId: "hall-1",
                startTime: new Date("2026-06-01T08:00:00.000Z"),
                finishTime: new Date("2026-06-01T10:00:00.000Z")
            } as any;
            const streamingSession = {
                id: "session-1",
                movieId: "movie-1",
                hallId: "hall-1",
                startTime: new Date(now.getTime() - 1000 * 60 * 60),
                finishTime: new Date(now.getTime() + 1000 * 60 * 60)
            } as any;

            mockSessionRepo.findOne.mockResolvedValue(streamingSession);

            await expect(service.update("session-1", updateDto)).rejects.toThrow(ConflictException);
            expect(mockSessionRepo.save).not.toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should remove a non-streaming session", async () => {
            const sessionData = {
                id: "session-1",
                startTime: new Date("2026-05-30T08:00:00.000Z"),
                finishTime: new Date("2026-05-30T10:00:00.000Z")
            } as any;

            mockSessionRepo.findOne.mockResolvedValue(sessionData);
            mockSessionRepo.remove.mockResolvedValue(undefined);

            await expect(service.remove("session-1")).resolves.toBeUndefined();
            expect(mockSessionRepo.remove).toHaveBeenCalledWith(sessionData);
        });

        it("should throw ConflictException when attempting to remove a streaming session", async () => {
            const now = new Date();
            const sessionData = {
                id: "session-1",
                startTime: new Date(now.getTime() - 1000 * 60 * 60),
                finishTime: new Date(now.getTime() + 1000 * 60 * 60)
            } as any;

            mockSessionRepo.findOne.mockResolvedValue(sessionData);

            await expect(service.remove("session-1")).rejects.toThrow(ConflictException);
            expect(mockSessionRepo.remove).not.toHaveBeenCalled();
        });
    });
});
