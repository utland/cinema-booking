import { Test, TestingModule } from "@nestjs/testing";
import { HallService } from "./hall.service";
import { Hall } from "./entities/hall.entity";
import { getRepositoryToken, getDataSourceToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Seat } from "./entities/seat.entity";
import { Session } from "src/session/entities/session.entity";
import { ConflictException, NotFoundException } from "@nestjs/common";

describe("HallService", () => {
    let service: HallService;
    let hallRepo: Repository<Hall>;
    let seatRepo: Repository<Seat>;
    let dataSource: DataSource;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HallService,
                {
                    provide: getRepositoryToken(Hall),
                    useValue: {
                        findOne: jest.fn(),
                        update: jest.fn()
                    }
                },
                {
                    provide: getRepositoryToken(Seat),
                    useValue: {
                        update: jest.fn(),
                        delete: jest.fn()
                    }
                },
                {
                    provide: getDataSourceToken(),
                    useValue: {}
                }
            ]
        }).compile();

        service = module.get<HallService>(HallService);
        hallRepo = module.get<Repository<Hall>>(getRepositoryToken(Hall));
        seatRepo = module.get<Repository<Seat>>(getRepositoryToken(Seat));
        dataSource = module.get<DataSource>(getDataSourceToken());
    });

    describe("checkSessions", () => {
        it("should throw NotFoundException if hall is not found", async () => {
            const hallId = "non-existent-hall";

            jest.spyOn(hallRepo, "findOne").mockResolvedValue(null);

            await expect(service.checkSessions(hallId)).rejects.toThrow(NotFoundException);
            expect(hallRepo.findOne).toHaveBeenCalledWith({ where: { id: hallId }, relations: ["sessions"] });
        });

        it("should throw ConflictException if there are active sessions", async () => {
            const hallId = "hall-with-active-session";
            const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
            const hall = { id: hallId, sessions: [{ finishTime: futureDate }] };

            jest.spyOn(hallRepo, "findOne").mockResolvedValue(hall as Hall);

            await expect(service.checkSessions(hallId)).rejects.toThrow(ConflictException);
            expect(hallRepo.findOne).toHaveBeenCalledWith({ where: { id: hallId }, relations: ["sessions"] });
        });

        it("should not throw if all sessions are ended", async () => {
            const hallId = "hall-no-active-sessions";
            const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
            const hall = { id: hallId, sessions: [{ finishTime: pastDate }] };

            jest.spyOn(hallRepo, "findOne").mockResolvedValue(hall as Hall);

            await expect(service.checkSessions(hallId)).resolves.toBeUndefined();
            expect(hallRepo.findOne).toHaveBeenCalledWith({ where: { id: hallId }, relations: ["sessions"] });
        });
    });
});
