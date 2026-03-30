import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Movie } from "src/domain/movie/models/movie.entity";
import { MOVIE_REPOSITORY_TOKEN, type MovieRepository } from "src/domain/movie/ports/movie.repository";
import { CreateMovieDto } from "./dtos/request/create-movie.dto";
import { MovieListItemDto } from "./dtos/response/movie-list-item.dto";
import { toMovieListDto } from "./dtos/mappers/to-movie-list";
import { MovieInfoDto } from "./dtos/response/movie-info.dto";
import { toMovieInfoDto } from "./dtos/mappers/to-movie-info";
import { UpdateMovieDto } from "./dtos/request/update-movie.dto";


@Injectable()
export class MovieService {
  constructor(
    @Inject(MOVIE_REPOSITORY_TOKEN)
    private readonly movieRepo: MovieRepository,
  ) {}

  public async create(
    { title, duration, genre, description, rentStart, rentEnd }: CreateMovieDto
  ): Promise<void> {
    const movie = new Movie(title, duration, description, genre, rentStart, rentEnd);
    await this.movieRepo.save(movie);
  }

  public async findAll(): Promise<MovieListItemDto[]> {
    const movies = await this.movieRepo.findAll();

    const dto = toMovieListDto(movies);

    return dto;
  }

  public async findByRentDate(): Promise<MovieListItemDto[]> {
    const activeMovies = await this.movieRepo.findActive();

    const dto = toMovieListDto(activeMovies);
    
    return dto;
  }

  public async findById(movieId: string): Promise<MovieInfoDto> {
    const movie = await this.movieRepo.findById(movieId);
    if (!movie) throw new NotFoundException('Movie is not found');

    const dto = toMovieInfoDto(movie);
    
    return dto;
  }

  public async update(
    { movieId, title, description, duration, genre, rentEnd, rentStart }: UpdateMovieDto
  ): Promise<void> {
    const movie = await this.movieRepo.findById(movieId);
    if (!movie) throw new NotFoundException('Movie is not found');

    movie.updateInfo(title, description, duration, genre);
    movie.changeRentDate(rentStart, rentEnd);

    await this.movieRepo.save(movie);
  }

  public async remove(movieId: string): Promise<void> {
    const movie = await this.movieRepo.findById(movieId);
    if (!movie) throw new NotFoundException('Movie is not found');

    movie.validateDeleteOperation();

    await this.movieRepo.delete(movie);
  }
}
