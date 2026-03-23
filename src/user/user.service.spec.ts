import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      findOneByOrFail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkExisted', () => {
    it('should not throw if no user exists', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.checkExisted('testlogin', 'test@email.com')).resolves.not.toThrow();
    });

    it('should throw ConflictException if login exists', async () => {
      const existingUser = { login: 'testlogin', email: 'other@email.com' };
      mockUserRepository.findOneBy.mockResolvedValue(existingUser);

      await expect(service.checkExisted('testlogin', 'test@email.com')).rejects.toThrow(ConflictException);
      await expect(service.checkExisted('testlogin', 'test@email.com')).rejects.toThrow('This login exists');
    });

    it('should throw ConflictException if email exists', async () => {
      const existingUser = { login: 'otherlogin', email: 'test@email.com' };
      mockUserRepository.findOneBy.mockResolvedValue(existingUser);

      await expect(service.checkExisted('testlogin', 'test@email.com')).rejects.toThrow(ConflictException);
      await expect(service.checkExisted('testlogin', 'test@email.com')).rejects.toThrow('This email exists');
    });
  });
});
