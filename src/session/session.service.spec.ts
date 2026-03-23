import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { HallService } from 'src/hall/hall.service';

describe('SessionService', () => {
  let service: SessionService;
  let sessionRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: getRepositoryToken(Session),
          useValue: {
            findOne: jest.fn(),
          }
        },
        {
          provide: HallService,
          useValue: {}
        }
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    sessionRepo = module.get(getRepositoryToken(Session));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkSessionState', () => {
    it("should throw ConflictException when session is streaming now", async () => {
      const now = new Date();
      const sessionData = {
        id: 'session-1',
        startTime: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
        finishTime: new Date(now.getTime() + 1000 * 60 * 60), // 1 hour from now
      } as any;
  
      jest.spyOn(sessionRepo, 'findOne').mockResolvedValue(sessionData);
  
      await expect(service.checkSessionState('session-1')).rejects.toThrow('You cannot modify a session that is streaming now');
      expect(sessionRepo.findOne).toHaveBeenCalledWith({ where: { id: 'session-1' } });
    });

    it("should return session when it's not streaming now", async () => {
      const now = new Date();
      const sessionData = {
        id: 'session-2',
        startTime: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
        finishTime: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
      } as any;
  
      jest.spyOn(sessionRepo, 'findOne').mockResolvedValue(sessionData);
  
      await expect(service.checkSessionState('session-2')).resolves.toEqual(sessionData);
      expect(sessionRepo.findOne).toHaveBeenCalledWith({ where: { id: 'session-2' } });
    })
  });

  describe('findById', () => {
    it('should throw NotFoundException when session does not exist', async () => {
      jest.spyOn(sessionRepo, 'findOne').mockResolvedValue(null);

      await expect(service.findById('missing-session')).rejects.toThrow('This session is not found');
      expect(sessionRepo.findOne).toHaveBeenCalledWith({ where: { id: 'missing-session' } });
    });

    it('should return session when exists', async () => {
      const sessionData = { id: 'found-session' } as any;
      jest.spyOn(sessionRepo, 'findOne').mockResolvedValue(sessionData);

      await expect(service.findById('found-session')).resolves.toEqual(sessionData);
      expect(sessionRepo.findOne).toHaveBeenCalledWith({ where: { id: 'found-session' } });
    });
  });
});
