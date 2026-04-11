import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieService } from 'src/application/movie/movie.service';
import { MOVIE_REPOSITORY_TOKEN } from 'src/domain/movie/ports/movie.repository';
import { TypeOrmMovieRepository } from 'src/infrastructure/persistence/movie/adapters/typeorm-movie.repository';
import { TypeOrmMovie } from 'src/infrastructure/persistence/movie/entities/typeorm-movie.entity';
import { TypeOrmMovieMapper } from 'src/infrastructure/persistence/movie/mappers/typeorm-movie.mapper';
import { MovieController } from 'src/presentation/movie/movie.controller';


@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmMovie])],
  controllers: [MovieController],
  providers: [
    MovieService, 
    TypeOrmMovieMapper,
    { provide: MOVIE_REPOSITORY_TOKEN, useClass: TypeOrmMovieRepository}
  ],
    exports: [MOVIE_REPOSITORY_TOKEN]
  
})
export class MovieModule {}
