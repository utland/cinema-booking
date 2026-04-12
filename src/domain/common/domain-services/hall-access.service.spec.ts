import { Test, TestingModule } from "@nestjs/testing";
import { HallAccessService } from "./hall-access.service";
import { SESSION_REPOSITORY_TOKEN, SessionRepository } from "src/domain/session/ports/session.repository";
import { Session } from "src/domain/session/models/session.entity";
import { ConflictDomainException } from "../exceptions/conflict.exception";

describe("HallAccessService", () => {
    let service: HallAccessService;
    let mockSessionRepo: jest.Mocked<SessionRepository>;

    beforeEach(async () => {
        const mockSessionRepository = {
            findById: jest.fn(),
            findByHall: jest.fn(),
            findByRentDate: jest.fn(),
            findAll: jest.fn(),
            save: jest.fn(),
            delete: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HallAccessService,
                {
                    provide: SESSION_REPOSITORY_TOKEN,
                    useValue: mockSessionRepository
                }
            ]
        }).compile();

        service = module.get<HallAccessService>(HallAccessService);
        mockSessionRepo = module.get(SESSION_REPOSITORY_TOKEN);
    });

    describe("checkOngoingSessions", () => {
        it("should not throw when sessions exist but none are ongoing", async () => {
            const pastSession = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2023-01-01T10:00:00Z"),
                new Date("2023-01-01T12:00:00Z")
            );

            const futureSession = new Session(
                "movie-2",
                "hall-1",
                150,
                new Date("2026-12-01T10:00:00Z"),
                new Date("2026-12-01T12:00:00Z")
            );

            mockSessionRepo.findByHall.mockResolvedValue([pastSession, futureSession]);

            await expect(service.checkOngoingSessions("hall-1")).resolves.not.toThrow();
        });

        it("should throw DomainException when there is an ongoing session", async () => {
            const ongoingSession = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2026-03-29T10:00:00Z"),
                new Date("2026-03-31T12:00:00Z")
            );

            mockSessionRepo.findByHall.mockResolvedValue([ongoingSession]);

            try {
                await service.checkOngoingSessions(ongoingSession.hallId);
            } catch (err: any) {
                expect(err).toBeInstanceOf(ConflictDomainException);
                expect(err.message).toBe("There are unfinished sessions in this hall");
            }
        });

        it("should throw DomainException when multiple sessions and at least one is ongoing", async () => {
            const pastSession = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2023-01-01T10:00:00Z"),
                new Date("2023-01-01T12:00:00Z")
            );

            const ongoingSession = new Session(
                "movie-2",
                "hall-1",
                150,
                new Date("2026-03-29T10:00:00Z"),
                new Date("2026-03-31T12:00:00Z")
            );

            mockSessionRepo.findByHall.mockResolvedValue([pastSession, ongoingSession]);

            try {
                await service.checkOngoingSessions(ongoingSession.hallId);
            } catch (err: any) {
                expect(err).toBeInstanceOf(ConflictDomainException);
                expect(err.message).toBe("There are unfinished sessions in this hall");
            }
        });
    });
});
