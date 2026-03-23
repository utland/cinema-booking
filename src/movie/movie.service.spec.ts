import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { SessionService } from 'src/session/session.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('MovieService', () => {
  let service: MovieService;
  let movieRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          }
        },
        {
          provide: SessionService,
          useValue: {}
        }
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieRepo = module.get(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should throw NotFoundException if movie is not found', async () => {
      jest.spyOn(movieRepo, 'findOne').mockResolvedValue(null);

      await expect(service.findById('missing-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkMovieState', () => {
    it('should throw NotFoundException when movie does not exist', async () => {
      jest.spyOn(movieRepo, 'findOne').mockResolvedValue(null);

      await expect(service.checkMovieState('missing')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when movie is currently streaming', async () => {
      const now = new Date();
      const movieData = {
        id: 'current',
        rentStart: new Date(now.getTime() - 1000 * 60 * 60),
        rentEnd: new Date(now.getTime() + 1000 * 60 * 60),
      } as any;

      jest.spyOn(movieRepo, 'findOne').mockResolvedValue(movieData);

      await expect(service.checkMovieState('current')).rejects.toThrow(ConflictException);
    });

    it('should return movie when not streaming', async () => {
      const now = new Date();
      const movieData = {
        id: 'past',
        rentStart: new Date(now.getTime() - 1000 * 60 * 60 * 24),
        rentEnd: new Date(now.getTime() - 1000 * 60 * 60),
      } as any;

      jest.spyOn(movieRepo, 'findOne').mockResolvedValue(movieData);

      await expect(service.checkMovieState('past')).resolves.toEqual(movieData);
    });
  });
});
