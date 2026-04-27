import { Test, TestingModule } from "@nestjs/testing";
import { HallAccessService } from "./hall-access.service";
import { SESSION_REPOSITORY_TOKEN, SessionRepository } from "../../session/ports/session.repository";
import { Session } from "../../session/models/session.entity";
import { ConflictDomainException } from "@app/shared-kernel/domain/domain-exceptions/conflict.exception";

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
            const session1 = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2023-01-01T10:00:00Z"),
                new Date("2023-01-01T12:00:00Z"),
                new Date("2023-01-01T09:00:00Z")
            );

            const session2 = new Session(
                "movie-2",
                "hall-1",
                150,
                new Date("2026-12-01T10:00:00Z"),
                new Date("2026-12-01T12:00:00Z"),
                new Date("2026-12-01T09:00:00Z")
            );

            mockSessionRepo.findByHall.mockResolvedValue([session1, session2]);

            await expect(service.checkOngoingSessions("hall-1")).resolves.not.toThrow();
        });

        it("should throw DomainException when there is an ongoing session", async () => {
            const ongoingSession = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date(Date.now() - 60 * 60 * 1000), // started 1 hour ago
                new Date(Date.now() + 60 * 60 * 1000), // ends in 1 hour
                new Date(Date.now() - 2 * 60 * 60 * 1000) // booked 2 hours ago
            );

            mockSessionRepo.findByHall.mockResolvedValue([ongoingSession]);

            try {
                await service.checkOngoingSessions(ongoingSession.hallId);
            } catch (err: any) {
                expect(err).toBeInstanceOf(ConflictDomainException);
                expect(err.message).toBe("There are active sessions in this hall");
            }
        });

        it("should throw DomainException when multiple sessions and at least one is ongoing", async () => {
            const pastSession = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date("2023-01-01T10:00:00Z"),
                new Date("2023-01-01T12:00:00Z"),
                new Date("2023-01-01T09:00:00Z")
            );

            const ongoingSession = new Session(
                "movie-1",
                "hall-1",
                100,
                new Date(Date.now() - 60 * 60 * 1000), // started 1 hour ago
                new Date(Date.now() + 60 * 60 * 1000), // ends in 1 hour
                new Date(Date.now() - 2 * 60 * 60 * 1000) // booked 2 hours ago
            );

            mockSessionRepo.findByHall.mockResolvedValue([pastSession, ongoingSession]);

            try {
                await service.checkOngoingSessions(ongoingSession.hallId);
            } catch (err: any) {
                expect(err).toBeInstanceOf(ConflictDomainException);
                expect(err.message).toBe("There are active sessions in this hall");
            }
        });
    });
});
