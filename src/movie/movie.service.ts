import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  public async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = await this.movieRepo.save(createMovieDto);
    return movie;
  }

  public async findAll(): Promise<Movie[]> {
    return await this.movieRepo.find();
  }

  public async findByRentDate(): Promise<Movie[]> {
    const today = new Date();
    const movies = await this.movieRepo.find({ 
      where: { rentEnd: MoreThan(today) } 
    });
    
    return movies;
  }

  public async findById(id: string): Promise<Movie> {
    const movie = await this.movieRepo.findOne({ where: { id }, relations: ["sessions"] });
    if (!movie) throw new NotFoundException('Movie is not found');
    
    return movie;
  }

  public async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<void> {
    const movie = await this.checkMovieState(id);

    const updatedMovie = { ...movie, ...updateMovieDto };
    await this.movieRepo.save(updatedMovie);
  }

  public async remove(id: string): Promise<void> {
    const movie = await this.checkMovieState(id);
    await this.movieRepo.remove(movie);
  }

  public async checkMovieState(movieId: string): Promise<Movie> {
    const movie = await this.movieRepo.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Movie is not found');

    const today = new Date();
    if (movie.rentEnd > today && movie.rentStart < today) {
      throw new ConflictException('You cannot modify a movie that is streaming now');
    } 

    return movie;
  } 
}
