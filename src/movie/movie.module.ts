import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { SessionModule } from 'src/session/session.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

@Module({
  imports: [SessionModule, TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
