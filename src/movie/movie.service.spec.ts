import { Test, TestingModule } from "@nestjs/testing";
import { MovieService } from "./movie.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Movie } from "./entities/movie.entity";
import { ConflictException, NotFoundException, BadRequestException } from "@nestjs/common";

describe("MovieService", () => {
    let service: MovieService;
    let movieRepo: any;

    const mockMovieRepo = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        remove: jest.fn()
    };

    beforeEach(async () => {
        Object.values(mockMovieRepo).forEach((fn) => fn.mockReset());

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MovieService,
                {
                    provide: getRepositoryToken(Movie),
                    useValue: mockMovieRepo
                }
            ]
        }).compile();

        service = module.get<MovieService>(MovieService);
        movieRepo = module.get(getRepositoryToken(Movie));
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("create", () => {
        it("should save and return new movie when rent dates are valid", async () => {
            const createDto = {
                rentStart: new Date("2026-06-01T00:00:00.000Z"),
                rentEnd: new Date("2026-06-05T00:00:00.000Z")
            } as any;
            const savedMovie = { id: "movie-1", ...createDto } as any;

            mockMovieRepo.save.mockResolvedValue(savedMovie);

            await expect(service.create(createDto)).resolves.toEqual(savedMovie);
            expect(mockMovieRepo.save).toHaveBeenCalledWith(createDto);
        });

        it("should throw BadRequestException when rentStart is after rentEnd", async () => {
            const createDto = {
                rentStart: new Date("2026-06-06T00:00:00.000Z"),
                rentEnd: new Date("2026-06-05T00:00:00.000Z")
            } as any;

            await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
            expect(mockMovieRepo.save).not.toHaveBeenCalled();
        });
    });

    describe("update", () => {
        it("should save updated movie when it is not currently streaming", async () => {
            const existingMovie = {
                id: "movie-1",
                rentStart: new Date("2026-05-01T00:00:00.000Z"),
                rentEnd: new Date("2026-05-10T00:00:00.000Z")
            } as any;
            const updateDto = {
                rentStart: new Date("2026-05-02T00:00:00.000Z"),
                rentEnd: new Date("2026-05-09T00:00:00.000Z")
            } as any;

            mockMovieRepo.findOne.mockResolvedValue(existingMovie);
            mockMovieRepo.save.mockResolvedValue({ ...existingMovie, ...updateDto });

            await expect(service.update("movie-1", updateDto)).resolves.toBeUndefined();
            expect(mockMovieRepo.save).toHaveBeenCalledWith({ ...existingMovie, ...updateDto });
        });

        it("should throw ConflictException when movie is currently streaming", async () => {
            const now = new Date();
            const streamingMovie = {
                id: "movie-1",
                rentStart: new Date(now.getTime() - 1000 * 60 * 60),
                rentEnd: new Date(now.getTime() + 1000 * 60 * 60)
            } as any;
            const updateDto = {
                rentStart: new Date("2026-06-01T00:00:00.000Z"),
                rentEnd: new Date("2026-06-05T00:00:00.000Z")
            } as any;

            mockMovieRepo.findOne.mockResolvedValue(streamingMovie);

            await expect(service.update("movie-1", updateDto)).rejects.toThrow(ConflictException);
            expect(mockMovieRepo.save).not.toHaveBeenCalled();
        });
    });

    describe("remove", () => {
        it("should remove a movie when it is not currently streaming", async () => {
            const existingMovie = {
                id: "movie-1",
                rentStart: new Date("2026-05-01T00:00:00.000Z"),
                rentEnd: new Date("2026-05-10T00:00:00.000Z")
            } as any;

            mockMovieRepo.findOne.mockResolvedValue(existingMovie);
            mockMovieRepo.remove.mockResolvedValue(undefined);

            await expect(service.remove("movie-1")).resolves.toBeUndefined();
            expect(mockMovieRepo.remove).toHaveBeenCalledWith(existingMovie);
        });

        it("should throw ConflictException when movie is currently streaming", async () => {
            const now = new Date();
            const streamingMovie = {
                id: "movie-1",
                rentStart: new Date(now.getTime() - 1000 * 60 * 60),
                rentEnd: new Date(now.getTime() + 1000 * 60 * 60)
            } as any;

            mockMovieRepo.findOne.mockResolvedValue(streamingMovie);

            await expect(service.remove("movie-1")).rejects.toThrow(ConflictException);
            expect(mockMovieRepo.remove).not.toHaveBeenCalled();
        });
    });

    describe("checkMovieState", () => {
        it("should throw NotFoundException if movie does not exist", async () => {
            mockMovieRepo.findOne.mockResolvedValue(null);

            await expect(service.checkMovieState("missing-movie")).rejects.toThrow(NotFoundException);
        });

        it("should throw ConflictException when movie is currently streaming", async () => {
            const now = new Date();
            const streamingMovie = {
                id: "movie-1",
                rentStart: new Date(now.getTime() - 1000 * 60 * 60),
                rentEnd: new Date(now.getTime() + 1000 * 60 * 60)
            } as any;

            mockMovieRepo.findOne.mockResolvedValue(streamingMovie);

            await expect(service.checkMovieState("movie-1")).rejects.toThrow(ConflictException);
        });

        it("should return movie if not currently streaming", async () => {
            const pastMovie = {
                id: "movie-1",
                rentStart: new Date("2026-05-01T00:00:00.000Z"),
                rentEnd: new Date("2026-05-02T00:00:00.000Z")
            } as any;

            mockMovieRepo.findOne.mockResolvedValue(pastMovie);

            await expect(service.checkMovieState("movie-1")).resolves.toEqual(pastMovie);
        });
    });
});
