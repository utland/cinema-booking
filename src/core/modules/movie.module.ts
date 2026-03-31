import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateMovieHandler } from 'src/application/movie/commands/create-movie/create-movie.handler';
import { DeleteMovieHandler } from 'src/application/movie/commands/delete-movie/delete-movie.handler';
import { UpdateMovieHandler } from 'src/application/movie/commands/update-movie/update-movie.handler';
import { MOVIE_READ_REPOSITORY_TOKEN } from 'src/application/movie/ports/movie.read-repository';
import { FindActiveMoviesHandler } from 'src/application/movie/queries/find-active-movies/find-active-movies.handler';
import { FindMovieAllHandler } from 'src/application/movie/queries/find-movie-all/find-movie-all.handler';
import { FindMovieByIdHandler } from 'src/application/movie/queries/find-movie-by-id/find-movie-by-id.handler';
import { MOVIE_REPOSITORY_TOKEN } from 'src/domain/movie/ports/movie.repository';
import { TypeOrmMovieReadRepository } from 'src/infrastructure/persistence/movie/adapters/typeorm-movie.read-repository';
import { TypeOrmMovieRepository } from 'src/infrastructure/persistence/movie/adapters/typeorm-movie.repository';
import { TypeOrmMovie } from 'src/infrastructure/persistence/movie/entities/typeorm-movie.entity';
import { TypeOrmMovieMapper } from 'src/infrastructure/persistence/movie/mappers/typeorm-movie.mapper';
import { MovieController } from 'src/presentation/movie/movie.controller';

const commands = [
  CreateMovieHandler,
  DeleteMovieHandler,
  UpdateMovieHandler
];

const queries = [
  FindActiveMoviesHandler,
  FindMovieByIdHandler,
  FindMovieAllHandler
];

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmMovie])],
  controllers: [MovieController],
  providers: [
    ...commands,
    ...queries,
    TypeOrmMovieMapper,
    { provide: MOVIE_REPOSITORY_TOKEN, useClass: TypeOrmMovieRepository },
    { provide: MOVIE_READ_REPOSITORY_TOKEN, useClass: TypeOrmMovieReadRepository }
  ]
})
export class MovieModule {}
